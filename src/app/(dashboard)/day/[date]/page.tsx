import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getTodayString } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DayNotes } from "./day-notes"

export default async function DayPage({
  params,
  searchParams,
}: {
  params: { date: string }
  searchParams: { tag?: string }
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
    .order("position", { ascending: true })
    .order("created_at", { ascending: false })

  const { data: allTags } = await supabase
    .from("tag")
    .select("*")
    .eq("user_id", user!.id)
    .order("name")

  const today = getTodayString()
  const isToday = params.date === today
  const filterTag = searchParams.tag ?? null

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

      {notes && notes.length > 0 && (
        <>
          {allTags && allTags.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              <Link href={`/day/${params.date}`}>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                    !filterTag
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  Все
                </span>
              </Link>
              {allTags.map((tag) => (
                <Link key={tag.id} href={`/day/${params.date}?tag=${tag.name}`}>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                      filterTag === tag.name
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {tag.name}
                  </span>
                </Link>
              ))}
            </div>
          )}

          <DayNotes
            notes={notes ?? []}
            filterTag={filterTag}
          />
        </>
      )}
    </div>
  )
}
