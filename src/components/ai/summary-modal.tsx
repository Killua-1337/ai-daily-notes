"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"

export function SummaryModal() {
  const [open, setOpen] = useState(false)
  const [summary, setSummary] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/ai/summarize", { method: "POST" })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setSummary(data.summary)
        setOpen(true)
      }
    } catch {
      setError("Ошибка при генерации")
    } finally {
      setLoading(false)
    }
  }, [])

  const copyToClipboard = useCallback(async () => {
    await navigator.clipboard.writeText(summary)
  }, [summary])

  return (
    <>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? "Генерация..." : "Суммаризация за неделю"}
        </Button>
      </div>

      {error && !loading && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-2">
              Суммаризация за неделю
            </h3>
            <p className="text-sm text-foreground whitespace-pre-wrap">
              {summary}
            </p>
            <div className="flex gap-2 mt-4 justify-end">
              <Button variant="secondary" size="sm" onClick={copyToClipboard}>
                Копировать
              </Button>
              <Button size="sm" onClick={() => setOpen(false)}>
                Закрыть
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
