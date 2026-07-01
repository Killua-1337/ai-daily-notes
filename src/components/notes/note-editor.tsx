"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { updateNote, deleteNote } from "@/actions/notes"
import { TagInput } from "@/components/tags/tag-input"
import type { Note, Tag } from "@/types"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Сохранение..." : "Сохранить"}
    </Button>
  )
}

export function NoteEditor({ note }: { note: Note }) {
  const [error, setError] = useState<string | null>(null)
  const [tags, setTags] = useState<Tag[]>(
    note.tags?.map((t: any) => (t.tag ? t.tag : t)) ?? [],
  )
  const [exporting, setExporting] = useState(false)
  const router = useRouter()

  const handleExport = useCallback(async () => {
    setExporting(true)
    const res = await fetch(`/api/notes/${note.id}/export`)
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${note.note_date}-${note.title}.md`
    a.click()
    URL.revokeObjectURL(url)
    setExporting(false)
  }, [note.id, note.note_date, note.title])

  async function handleSubmit(formData: FormData) {
    setError(null)
    const result = await updateNote(undefined, formData)
    if (result?.error) setError(result.error)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Редактировать</h2>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={handleExport} disabled={exporting}>
            {exporting ? "Скачивание..." : "MD"}
          </Button>
          <form
            action={async () => {
              await deleteNote(note.id)
              router.push(`/day/${note.note_date}`)
            }}
          >
            <Button variant="destructive" size="sm" type="submit">
              Удалить
            </Button>
          </form>
          <Button variant="ghost" onClick={() => router.back()}>
            Назад
          </Button>
        </div>
      </div>

      <form action={handleSubmit} className="space-y-4">
        <input type="hidden" name="id" value={note.id} />
        <Input
          name="title"
          type="text"
          label="Заголовок"
          defaultValue={note.title}
        />
        <div className="space-y-1">
          <label className="text-sm font-medium leading-none">Содержимое</label>
          <textarea
            name="content"
            rows={16}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y min-h-[300px]"
            defaultValue={note.content}
          />
        </div>
        <TagInput noteId={note.id} tags={tags} onTagsChange={() => router.refresh()} />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="flex gap-2">
          <SubmitButton />
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
          >
            Отмена
          </Button>
        </div>
      </form>
    </div>
  )
}
