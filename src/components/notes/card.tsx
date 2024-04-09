"use client"

import Draggable from "react-draggable"
import { useResizeDetector } from "react-resize-detector"
import parse from "html-react-parser"

import { Card, CardContent } from "@/components/ui/card"

import { NoteType } from "@/types/NoteType"
import { Separator } from "@/components/ui/separator"
import { updateNoteInIndexedDB } from "@/utils/index-db"

interface Props {
  note: NoteType
  handleEditor: (value: boolean, note?: NoteType) => void
}

export function NotesCard({ note, handleEditor }: Props) {
  const { ref }: any = useResizeDetector({
    refreshMode: "debounce",
    refreshRate: 1000,
    skipOnMount: true,
    onResize: (width: number | undefined, height: number | undefined) => {
      if (width && height) updateNoteInIndexedDB({ ...note, width, height })
    },
  })

  return (
    <Card
      ref={ref}
      className="resize overflow-auto"
      style={{
        height: note.height ? `${note.height}px` : "144px",
        width: note.width ? `${note.width}px` : "200px",
      }}
    >
      <CardContent
        className="h-full w-full overflow-hidden p-4 hover:cursor-pointer hover:bg-muted"
        onClick={() => handleEditor(true, note)}
      >
        <h3 className="font-medium">{note.title}</h3>
        <Separator className="my-3 border-b border-primary" />
        <div className="text-sm dark:text-muted-foreground">
          {parse(note.content)}
        </div>
      </CardContent>
    </Card>
  )
}
