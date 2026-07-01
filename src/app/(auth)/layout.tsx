export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-purple-50/50 dark:to-purple-950/30">
      {children}
    </div>
  )
}
