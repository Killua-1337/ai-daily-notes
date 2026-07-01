"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import type { Tag } from "@/types"

export function SearchForm({ tags }: { tags: Tag[] }) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const router = useRouter()

  const search = useCallback(async (q: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/notes/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setResults(data)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) search(query.trim())
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          placeholder="Поиск по тексту заметок..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={loading || !query.trim()}>
          {loading ? "Поиск..." : "Найти"}
        </Button>
      </form>

      {tags.length > 0 && (
        <div className="flex gap-1 flex-wrap">
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => setSelectedTag(selectedTag === tag.id ? null : tag.id)}
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                selectedTag === tag.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      )}

      {results.length === 0 && query && !loading && (
        <p className="text-muted-foreground text-center py-8">
          Ничего не найдено
        </p>
      )}

      <div className="space-y-2">
        {results.map((note: any) => (
          <Link key={note.id} href={`/notes/${note.id}`}>
            <div className="rounded-lg border p-3 hover:bg-accent transition-colors">
              <h3 className="font-medium">{note.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {note.content}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{note.note_date}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
