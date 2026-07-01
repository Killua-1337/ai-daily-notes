import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NoteEditor } from "@/components/notes/note-editor"
import { notFound } from "next/navigation"

export default async function NotePage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: note } = await supabase
    .from("note")
    .select("*, tags:note_tag(tag:tag(*))")
    .eq("id", params.id)
    .eq("user_id", user!.id)
    .single()

  if (!note) notFound()

  return <NoteEditor note={note} />
}
