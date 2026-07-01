"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { createServerSupabaseClient } from "@/lib/supabase/server"

const createSchema = z.object({
  title: z.string().default("Без названия"),
  content: z.string().default(""),
  date: z.string().optional(),
})

export async function createNote(
  prevState: { error: string } | undefined,
  formData: FormData,
): Promise<{ error: string } | undefined> {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const data = createSchema.parse({
    title: formData.get("title") || undefined,
    content: formData.get("content") || undefined,
    date: formData.get("date") || undefined,
  })

  const { error } = await supabase.from("note").insert({
    user_id: user.id,
    title: data.title,
    content: data.content,
    note_date: data.date || new Date().toISOString().split("T")[0],
  })

  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  redirect("/")
}

const updateSchema = z.object({
  id: z.string().uuid(),
  title: z.string().default("Без названия"),
  content: z.string().default(""),
})

export async function updateNote(
  prevState: { error: string } | undefined,
  formData: FormData,
): Promise<{ error: string } | undefined> {
  const supabase = await createServerSupabaseClient()

  const data = updateSchema.parse({
    id: formData.get("id"),
    title: formData.get("title") || undefined,
    content: formData.get("content") || undefined,
  })

  const { error } = await supabase
    .from("note")
    .update({ title: data.title, content: data.content, updated_at: new Date().toISOString() })
    .eq("id", data.id)

  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  redirect("/")
}

export async function deleteNote(id: string) {
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.from("note").delete().eq("id", id)
  if (error) throw new Error(error.message)

  revalidatePath("/", "layout")
}
