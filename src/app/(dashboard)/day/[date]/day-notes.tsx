"use client"

import { useState, useCallback, useRef } from "react"
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
  const dragSource = useRef<string | null>(null)

  const filtered = filterTag
    ? items.filter((n) =>
        n.tags?.some((nt: any) => nt.tag.name === filterTag),
      )
    : items

  const handleDragStart = useCallback(
    (e: React.DragEvent, noteId: string) => {
      dragSource.current = noteId
      e.dataTransfer.effectAllowed = "move"
      e.dataTransfer.setData("text/plain", noteId)

      const card = e.currentTarget.querySelector('[data-card]') as HTMLElement | null
      if (!card) return

      const rect = card.getBoundingClientRect()
      const ghost = document.createElement("div")
      ghost.textContent = card.textContent
      ghost.style.cssText = `
        position: absolute; top: -1000px; left: -1000px;
        width: ${rect.width}px; max-width: ${rect.width}px;
        padding: ${getComputedStyle(card).padding};
        background: var(--background, #fff);
        color: var(--foreground, #000);
        border-radius: 8px;
        border: 1px solid var(--border, #ccc);
        box-shadow: 0 8px 32px rgba(0,0,0,0.12);
        font-family: system-ui, sans-serif;
        font-size: 14px;
        line-height: 1.5;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        pointer-events: none;
        transform: rotate(2deg);
        opacity: 0.95;
      `
      document.body.appendChild(ghost)
      e.dataTransfer.setDragImage(ghost, rect.width / 2, rect.height / 2)

      setTimeout(() => ghost.remove(), 0)
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

      const sourceId = dragSource.current
      if (!sourceId || sourceId === targetId) return

      const newItems = [...items]
      const sourceIdx = newItems.findIndex((n) => n.id === sourceId)
      const targetIdx = newItems.findIndex((n) => n.id === targetId)
      if (sourceIdx === -1 || targetIdx === -1) return

      const [moved] = newItems.splice(sourceIdx, 1)
      newItems.splice(targetIdx, 0, moved)

      setItems(newItems)
      dragSource.current = null

      await updateNotePosition(sourceId, targetIdx)
      router.refresh()
    },
    [items, router],
  )

  if (filtered.length === 0 && filterTag) {
    return (
      <p className="text-muted-foreground text-center py-8">
        Нет заметок с тегом «{filterTag}»
      </p>
    )
  }

  if (filtered.length === 0) return null

  return (
    <div className="relative">
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
            className="note-card relative flex gap-4 cursor-grab active:cursor-grabbing group"
          >
            <div className="flex flex-col items-center pt-5">
              <div className="h-3 w-3 rounded-full border-2 border-primary bg-background shrink-0" />
            </div>

            <Link
              href={`/notes/${note.id}`}
              className="flex-1 block"
              draggable={false}
              onClick={(e) => { if (dragSource.current) e.preventDefault() }}
            >
              <div
                data-card
                className="rounded-lg border p-4 hover:bg-accent transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-medium truncate">{note.title}</h3>
                  <span className="text-xs text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity select-none">
                    ⋮⋮
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {note.content || <span className="italic">Пустая заметка</span>}
                </p>
                {note.tags && note.tags.length > 0 && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {note.tags.map((nt: any) => (
                      <span
                        key={nt.tag.id}
                        className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300"
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
