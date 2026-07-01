import { createServerSupabaseClient } from "@/lib/supabase/server"
import { SearchForm } from "./search-form"
import { TagFilter } from "@/components/tags/tag-filter"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { tag?: string }
}) {
  const tag = searchParams.tag

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Поиск</h2>
      <TagFilter currentTag={tag} />
      <SearchForm currentTag={tag} />
    </div>
  )
}
