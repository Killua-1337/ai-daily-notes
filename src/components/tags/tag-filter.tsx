import { createServerSupabaseClient } from "@/lib/supabase/server"
import { TagBadge } from "./tag-badge"
import Link from "next/link"

export async function TagFilter({ currentTag }: { currentTag?: string }) {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: tags } = await supabase
    .from("tag")
    .select("*")
    .eq("user_id", user.id)
    .order("name")

  if (!tags || tags.length === 0) return null

  return (
    <div className="flex gap-1 flex-wrap">
      <Link
        href="/search"
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
          !currentTag
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        }`}
      >
        Все
      </Link>
      {tags.map((tag) => (
        <Link
          key={tag.id}
          href={`/search?tag=${tag.name}`}
        >
          <TagBadge tag={tag} selected={currentTag === tag.name} />
        </Link>
      ))}
    </div>
  )
}
