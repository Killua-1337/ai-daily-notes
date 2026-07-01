import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? ""
  const tagName = request.nextUrl.searchParams.get("tag") ?? ""

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

  let noteIds: string[] | null = null
  if (tagName.trim()) {
    const { data: tagData } = await supabase
      .from("tag")
      .select("id")
      .eq("user_id", user.id)
      .eq("name", tagName)
      .single()

    if (tagData) {
      const { data: noteTagData } = await supabase
        .from("note_tag")
        .select("note_id")
        .eq("tag_id", tagData.id)

      noteIds = noteTagData?.map((nt) => nt.note_id) ?? []
    } else {
      return NextResponse.json([])
    }
  }

  let dbQuery = supabase
    .from("note")
    .select("id, title, content, note_date")
    .eq("user_id", user.id)

  if (noteIds !== null) {
    dbQuery = dbQuery.in("id", noteIds.length > 0 ? noteIds : [""])
  }

  if (query.trim()) {
    dbQuery = dbQuery.or(`title.ilike.%${query}%,content.ilike.%${query}%`)
  }

  const { data } = await dbQuery
    .order("note_date", { ascending: false })
    .limit(20)

  return NextResponse.json(data ?? [])
}
