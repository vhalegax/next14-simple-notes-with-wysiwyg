import Image from "next/image"

import { NotesCard } from "@/components/notes-card"

export default function Home() {
  return (
    <main className="min-h-screen p-10">
      <div className="grid grid-cols-5 gap-5">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((value) => {
          return <NotesCard key={value} />
        })}
      </div>
    </main>
  )
}
