import { redirect } from "next/navigation"
import { getTodayString } from "@/lib/utils"

export default function Home() {
  redirect(`/day/${getTodayString()}`)
}
