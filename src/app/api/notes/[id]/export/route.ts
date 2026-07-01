import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {},
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data: note } = await supabase
    .from("note")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single()

  if (!note) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const content = note.content ?? ""
  const markdown = `# ${note.title}\n\n${content}\n\n---\n*Создано: ${note.created_at}*`

  const safeName = note.title.replace(/[<>:"/\\|?*]/g, "_").trim() || "note"
  const filename = `${note.note_date}-${safeName}.md`
  const encodedFilename = encodeURIComponent(filename)

  return new NextResponse(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodedFilename}`,
    },
  })
}
