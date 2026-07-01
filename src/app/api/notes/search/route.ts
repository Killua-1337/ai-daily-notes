import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? ""

  if (!query.trim()) {
    return NextResponse.json([])
  }

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

  const { data } = await supabase
    .from("note")
    .select("id, title, content, note_date")
    .eq("user_id", user.id)
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .order("note_date", { ascending: false })
    .limit(20)

  return NextResponse.json(data ?? [])
}
