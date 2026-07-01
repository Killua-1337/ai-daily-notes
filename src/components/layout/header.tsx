import { ThemeToggle } from "./theme-toggle"
import { logout } from "@/actions/auth"
import { Button } from "@/components/ui/button"

export function Header({ userEmail }: { userEmail: string }) {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4">
        <h1 className="text-lg font-semibold">AI Daily Notes</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden sm:block">
            {userEmail}
          </span>
          <ThemeToggle />
          <form action={logout}>
            <Button variant="ghost" size="sm" type="submit">
              Выйти
            </Button>
          </form>
        </div>
      </div>
    </header>
  )
}
