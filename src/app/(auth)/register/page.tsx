"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { register } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Регистрация..." : "Создать аккаунт"}
    </Button>
  )
}

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setError(null)
    const result = await register(undefined, formData)
    if (result?.error) setError(result.error)
  }

  return (
    <div className="w-full max-w-sm space-y-6 px-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Регистрация</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Создайте аккаунт для заметок
        </p>
      </div>

      <form action={handleSubmit} className="space-y-4">
        <Input
          name="name"
          type="text"
          label="Имя"
          placeholder="Алексей"
          required
        />
        <Input
          name="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          required
        />
        <Input
          name="password"
          type="password"
          label="Пароль"
          placeholder="••••••••"
          required
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <SubmitButton />
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Уже есть аккаунт?{" "}
        <Link href="/login" className="underline hover:text-foreground">
          Войти
        </Link>
      </p>
    </div>
  )
}
