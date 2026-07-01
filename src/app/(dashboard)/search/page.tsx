import { createServerSupabaseClient } from "@/lib/supabase/server"
import { SearchForm } from "./search-form"

export default async function SearchPage() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: tags } = await supabase
    .from("tag")
    .select("*")
    .eq("user_id", user!.id)
    .order("name")

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Поиск</h2>
      <SearchForm tags={tags ?? []} />
    </div>
  )
}
