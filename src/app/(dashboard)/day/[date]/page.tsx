import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getTodayString } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function DayPage({
  params,
}: {
  params: { date: string }
}) {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: notes } = await supabase
    .from("note")
    .select("*, tags:note_tag(tag:tag(*))")
    .eq("user_id", user!.id)
    .eq("note_date", params.date)
    .order("created_at", { ascending: false })

  const today = getTodayString()
  const isToday = params.date === today

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {isToday ? "Сегодня" : params.date}
          </h2>
          <p className="text-sm text-muted-foreground">{params.date}</p>
        </div>
        <Link href={`/notes/new?date=${params.date}`}>
          <Button>+ Заметка</Button>
        </Link>
      </div>

      {(!notes || notes.length === 0) && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Нет заметок на этот день</p>
          <Link href={`/notes/new?date=${params.date}`}>
            <Button variant="secondary" className="mt-4">
              Создать заметку
            </Button>
          </Link>
        </div>
      )}

      <div className="space-y-3">
        {notes?.map((note) => (
          <Link key={note.id} href={`/notes/${note.id}`}>
            <div className="rounded-lg border p-4 hover:bg-accent transition-colors">
              <h3 className="font-medium">{note.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {note.content}
              </p>
              {note.tags && note.tags.length > 0 && (
                <div className="flex gap-1 mt-2 flex-wrap">
                  {note.tags.map((nt: any) => (
                    <span
                      key={nt.tag.id}
                      className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
                    >
                      {nt.tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
