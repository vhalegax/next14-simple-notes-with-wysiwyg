"use client"

import * as React from "react"
import parse from "html-react-parser"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { NoteType } from "@/types/NoteType"
import { generateUUID } from "@/utils/uuid"
import { Separator } from "@/components/ui/separator"

interface Props {
  note: NoteType
  handleEditor: (value: boolean, note?: NoteType) => void
}

export function NotesCard({ note, handleEditor }: Props) {
  return (
    <Card
      className="max-w-[350px] hover:cursor-pointer hover:bg-muted"
      onClick={() => handleEditor(true, note)}
    >
      <CardContent className="p-4">
        <h3 className="font-medium">{note.title}</h3>
        <Separator className="my-3 border-b border-primary" />
        <div className="max-h-36 overflow-hidden text-sm dark:text-muted-foreground">
          {parse(note.content)}
        </div>
      </CardContent>
    </Card>
  )
}
