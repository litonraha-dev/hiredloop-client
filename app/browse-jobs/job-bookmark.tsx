"use client"

import { useSyncExternalStore } from "react"
import { Bookmark } from "lucide-react"

const updateEvent = "hireloop-bookmark-updated"

function subscribe(onChange: () => void) {
  window.addEventListener(updateEvent, onChange)
  window.addEventListener("storage", onChange)
  return () => {
    window.removeEventListener(updateEvent, onChange)
    window.removeEventListener("storage", onChange)
  }
}

export function JobBookmark({ id, title }: { id: string; title: string }) {
  const key = "hireloop-bookmark:" + id
  const saved = useSyncExternalStore(
    subscribe,
    () => window.localStorage.getItem(key) === "true",
    () => false
  )

  function toggle() {
    if (saved) window.localStorage.removeItem(key)
    else window.localStorage.setItem(key, "true")
    window.dispatchEvent(new Event(updateEvent))
  }

  return (
    <button
      type="button"
      aria-label={"Bookmark " + title}
      aria-pressed={saved}
      onClick={toggle}
      className="grid size-8 place-items-center rounded-md text-zinc-400 hover:bg-white/10 hover:text-white aria-pressed:text-indigo-300"
    >
      <Bookmark
        aria-hidden="true"
        className={saved ? "size-4 fill-current" : "size-4"}
      />
    </button>
  )
}
