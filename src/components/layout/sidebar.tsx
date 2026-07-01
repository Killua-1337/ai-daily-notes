import Link from "next/link"
import { getTodayString } from "@/lib/utils"

export function Sidebar() {
  const today = getTodayString()

  return (
    <aside className="w-56 border-r bg-muted/30 hidden md:block">
      <nav className="flex flex-col gap-1 p-3">
        <Link
          href={`/day/${today}`}
          className="rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors"
        >
          Сегодня
        </Link>
        <Link
          href="/search"
          className="rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors"
        >
          Поиск
        </Link>
      </nav>
    </aside>
  )
}
