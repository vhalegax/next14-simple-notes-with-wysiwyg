"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { NotesCard } from "@/components/notes/card"
import { NotesEditor } from "@/components/notes/editor"

import { NoteType } from "@/types/NoteType"
import { readNotesFromIndexedDB } from "@/utils/index-db"

export default function Home() {
  const [openEditor, setOpenEditor] = useState(false)
  const [activeNote, setActiveNote] = useState<NoteType | undefined>(undefined)
  const [notes, setNotes] = useState<NoteType[]>([])

  const handleEditor = (value: boolean, note?: NoteType) => {
    setActiveNote(note || undefined)
    setOpenEditor(value)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await readNotesFromIndexedDB()
        setNotes(data)
      } catch (e) {}
    }

    fetchData()
  }, [openEditor])

  return (
    <>
      <div className="flex flex-wrap gap-5">
        {notes
          .sort((noteA, noteB) => noteB.createdAt - noteA.createdAt)
          .map((note) => {
            return (
              <NotesCard
                key={note.id}
                note={note}
                handleEditor={handleEditor}
              />
            )
          })}
      </div>

      {openEditor ? (
        <NotesEditor
          open={openEditor}
          note={activeNote}
          handleEditor={handleEditor}
        />
      ) : null}

      <Button
        className="fixed bottom-10 right-10"
        onClick={() => handleEditor(true)}
      >
        Add Notes
      </Button>
    </>
  )
}
