"use client"

import { useState, useRef, useCallback } from "react"
import { TagBadge } from "./tag-badge"
import { addTagToNote, removeTagFromNote } from "@/actions/tags"
import type { Tag } from "@/types"

interface TagInputProps {
  noteId: string
  tags: Tag[]
  onTagsChange?: () => void
}

export function TagInput({ noteId, tags, onTagsChange }: TagInputProps) {
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleAdd = useCallback(async () => {
    const name = input.trim()
    if (!name) return
    if (tags.some((t) => t.name.toLowerCase() === name.toLowerCase())) {
      setInput("")
      return
    }

    setLoading(true)
    setError(null)
    const result = await addTagToNote(noteId, name)
    setLoading(false)

    if (result.error) {
      setError(result.error)
    } else {
      setInput("")
      onTagsChange?.()
    }
  }, [input, tags, noteId, onTagsChange])

  const handleRemove = useCallback(
    async (tagId: string) => {
      const result = await removeTagFromNote(noteId, tagId)
      if (result.error) setError(result.error)
      else onTagsChange?.()
    },
    [noteId, onTagsChange],
  )

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none">Теги</label>
      <div className="flex gap-1 flex-wrap">
        {tags.map((tag) => (
          <TagBadge key={tag.id} tag={tag} onRemove={() => handleRemove(tag.id)} />
        ))}
      </div>
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              handleAdd()
            }
          }}
          placeholder="Добавить тег..."
          className="flex h-9 w-full max-w-[200px] rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          disabled={loading}
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={loading || !input.trim()}
          className="inline-flex h-9 items-center justify-center rounded-md bg-secondary px-3 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50"
        >
          +
        </button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
