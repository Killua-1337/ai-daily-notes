export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-200/50 dark:from-purple-800/30 via-background to-background">
      {children}
    </div>
  )
}
