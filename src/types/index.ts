export interface Note {
  id: string
  user_id: string
  title: string
  content: string
  note_date: string
  created_at: string
  updated_at: string
  tags?: { tag: Tag }[] | Tag[]
}

export interface Tag {
  id: string
  user_id: string
  name: string
  created_at: string
}

export interface NoteTag {
  note_id: string
  tag_id: string
}

export type ThemePreference = "light" | "dark"
