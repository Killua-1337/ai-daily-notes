"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createNote } from "@/actions/notes"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Сохранение..." : "Сохранить"}
    </Button>
  )
}

export default function NewNotePage() {
  const searchParams = useSearchParams()
  const date = searchParams.get("date") ?? ""
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setError(null)
    const result = await createNote(undefined, formData)
    if (result?.error) setError(result.error)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Новая заметка</h2>
        <Button variant="ghost" onClick={() => router.back()}>
          Отмена
        </Button>
      </div>

      <form action={handleSubmit} className="space-y-4">
        <input type="hidden" name="date" value={date} />
        <Input
          name="title"
          type="text"
          label="Заголовок"
          placeholder="Без названия"
        />
        <div className="space-y-1">
          <label className="text-sm font-medium leading-none">Содержимое</label>
          <textarea
            name="content"
            rows={12}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y min-h-[200px]"
            placeholder="Напишите что-нибудь..."
          />
        </div>
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
