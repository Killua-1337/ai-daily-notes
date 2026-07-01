"use client"

import type { Tag } from "@/types"

interface TagBadgeProps {
  tag: Tag
  onRemove?: () => void
  onClick?: () => void
  selected?: boolean
}

export function TagBadge({ tag, onRemove, onClick, selected }: TagBadgeProps) {
  const base =
    "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors"

  const color = selected
    ? "bg-primary text-primary-foreground"
    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"

  return (
    <span
      className={`${base} ${color} ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      {tag.name}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="ml-0.5 hover:text-destructive"
        >
          ×
        </button>
      )}
    </span>
  )
}
