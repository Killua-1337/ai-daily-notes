"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function addTagToNote(
  noteId: string,
  tagName: string,
): Promise<{ error?: string }> {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  // find or create tag
  const { data: existing } = await supabase
    .from("tag")
    .select("id")
    .eq("user_id", user.id)
    .eq("name", tagName)
    .maybeSingle()

  let tagId: string
  if (existing) {
    tagId = existing.id
  } else {
    const { data: newTag, error: createError } = await supabase
      .from("tag")
      .insert({ user_id: user.id, name: tagName })
      .select("id")
      .single()
    if (createError || !newTag) return { error: createError?.message ?? "Failed to create tag" }
    tagId = newTag.id
  }

  // already attached?
  const { data: link } = await supabase
    .from("note_tag")
    .select()
    .eq("note_id", noteId)
    .eq("tag_id", tagId)
    .maybeSingle()

  if (!link) {
    const { error: linkError } = await supabase
      .from("note_tag")
      .insert({ note_id: noteId, tag_id: tagId })
    if (linkError) return { error: linkError.message }
  }

  revalidatePath("/", "layout")
  return {}
}

export async function removeTagFromNote(
  noteId: string,
  tagId: string,
): Promise<{ error?: string }> {
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase
    .from("note_tag")
    .delete()
    .eq("note_id", noteId)
    .eq("tag_id", tagId)

  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  return {}
}

export async function deleteTag(tagId: string): Promise<{ error?: string }> {
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.from("tag").delete().eq("id", tagId)
  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  return {}
}
