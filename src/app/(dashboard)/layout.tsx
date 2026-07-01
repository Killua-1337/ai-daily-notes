import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  return (
    <div className="flex h-screen flex-col">
      <Header userEmail={user.email ?? ""} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}
