import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import "@/styles/globals.css"

export const metadata: Metadata = {
  title: "AI Daily Notes",
  description: "Онлайн-ежедневник для ведения заметок",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
