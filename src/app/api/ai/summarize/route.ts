import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { createAIClient, AI_MODEL } from "@/lib/ai"

export async function POST() {
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

  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)

  const { data: notes } = await supabase
    .from("note")
    .select("title, content, note_date")
    .eq("user_id", user.id)
    .gte("note_date", weekAgo.toISOString().split("T")[0])
    .order("note_date", { ascending: true })

  if (!notes || notes.length === 0) {
    return NextResponse.json({
      summary: "Недостаточно заметок для суммаризации",
    })
  }

  const notesText = notes
    .map((n) => `[${n.note_date}] ${n.title}\n${n.content}`)
    .join("\n\n---\n\n")

  const ai = createAIClient()

  const response = await ai.chat.completions.create({
    model: AI_MODEL,
    messages: [
      {
        role: "system",
        content:
          "Ты — помощник для суммаризации личных заметок. " +
          "Составь краткое резюме (3–5 предложений) на русском языке, " +
          "выделив ключевые темы и инсайты за неделю. " +
          "Если заметки на разные темы — сгруппируй по темам.",
      },
      {
        role: "user",
        content: `Вот мои заметки за последнюю неделю:\n\n${notesText}`,
      },
    ],
    max_tokens: 500,
    temperature: 0.7,
  })

  const summary = response.choices[0]?.message?.content ?? "Не удалось сгенерировать суммаризацию"

  return NextResponse.json({ summary })
}
