"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { updateNotePosition } from "@/actions/notes"

interface DayNotesProps {
  notes: any[]
  filterTag: string | null
}

export function DayNotes({ notes, filterTag }: DayNotesProps) {
  const router = useRouter()
  const [items, setItems] = useState(notes)
  const [dragId, setDragId] = useState<string | null>(null)

  const filtered = filterTag
    ? items.filter((n) =>
        n.tags?.some((nt: any) => nt.tag.name === filterTag),
      )
    : items

  const handleDragStart = useCallback(
    (e: React.DragEvent, noteId: string) => {
      setDragId(noteId)
      e.dataTransfer.effectAllowed = "move"
      e.dataTransfer.setData("text/plain", noteId)
    },
    [],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    const el = e.currentTarget as HTMLElement
    el.classList.add("drag-over")
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    const el = e.currentTarget as HTMLElement
    el.classList.remove("drag-over")
  }, [])

  const handleDrop = useCallback(
    async (e: React.DragEvent, targetId: string) => {
      e.preventDefault()
      ;(e.currentTarget as HTMLElement).classList.remove("drag-over")

      const sourceId = dragId
      if (!sourceId || sourceId === targetId) return

      const newItems = [...items]
      const sourceIdx = newItems.findIndex((n) => n.id === sourceId)
      const targetIdx = newItems.findIndex((n) => n.id === targetId)
      if (sourceIdx === -1 || targetIdx === -1) return

      const [moved] = newItems.splice(sourceIdx, 1)
      newItems.splice(targetIdx, 0, moved)

      setItems(newItems)
      setDragId(null)

      await updateNotePosition(sourceId, targetIdx)
      router.refresh()
    },
    [items, dragId, router],
  )

  if (filtered.length === 0 && filterTag) {
    return (
      <p className="text-muted-foreground text-center py-8">
        Нет заметок с тегом «{filterTag}»
      </p>
    )
  }

  if (filtered.length === 0) {
    return null
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-border" />

      <div className="space-y-3">
        {filtered.map((note) => (
          <div
            key={note.id}
            draggable
            onDragStart={(e) => handleDragStart(e, note.id)}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, note.id)}
            className="note-card relative flex gap-4 cursor-grab active:cursor-grabbing"
          >
            {/* Timeline dot */}
            <div className="flex flex-col items-center pt-5">
              <div className="h-3 w-3 rounded-full border-2 border-primary bg-background shrink-0" />
            </div>

            {/* Card */}
            <Link href={`/notes/${note.id}`} className="flex-1 block">
              <div className="rounded-lg border p-4 hover:bg-accent transition-colors">
                <h3 className="font-medium">{note.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {note.content}
                </p>
                {note.tags && note.tags.length > 0 && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {note.tags.map((nt: any) => (
                      <span
                        key={nt.tag.id}
                        className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
                      >
                        {nt.tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
