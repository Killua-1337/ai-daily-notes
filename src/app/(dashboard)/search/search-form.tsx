"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

interface SearchFormProps {
  currentTag?: string
}

export function SearchForm({ currentTag }: SearchFormProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const search = useCallback(async (q: string, tag?: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (q.trim()) params.set("q", q.trim())
      if (tag) params.set("tag", tag)
      const res = await fetch(`/api/notes/search?${params.toString()}`)
      const data = await res.json()
      setResults(data)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    search(query, currentTag)
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
        <Button type="submit" disabled={loading}>
          {loading ? "Поиск..." : "Найти"}
        </Button>
      </form>

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
