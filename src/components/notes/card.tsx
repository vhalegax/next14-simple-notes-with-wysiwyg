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

const exampleNote: NoteType = {
  id: generateUUID(),
  title: "Sample Note with Rich Content Loream Loream",
  content: `
    <h1>This is a Sample Note</h1>
    <ul>
      <li><strong>Bold Text:</strong> Use the strong tag to make text bold.</li>
      <li><em>Italic Text:</em> Use the em tag to make text italic.</li>
      <li><u>Underlined Text:</u> Use the u tag to underline text.</li>
      <li><a href="#">Hyperlinks:</a> Use the a tag to create hyperlinks.</li>
      <li><h2>Headings:</h2> Use h1, h2, h3, etc., tags to create headings of different levels.</li>
      <li><img src="https://via.placeholder.com/150" alt="Sample Image"> Images: Use the img tag to insert images.</li>
      <li><blockquote>Blockquotes:</blockquote> Use the blockquote tag to create blockquotes.</li>
    </ul>
    <p>You can customize the content of your notes using the features provided by the rich text editor.</p>
  `,
  createdAt: new Date().getTime(),
  updatedAt: new Date().getTime(),
}

export function NotesCard() {
  return (
    <Card
      className="w-[350px] hover:cursor-pointer hover:bg-muted"
      onClick={() => alert("alex")}
    >
      <CardContent className="p-5">
        <Separator className="my-3 border-b border-primary"/>
        <div className="max-h-36 overflow-hidden text-sm">
          {parse(exampleNote.content)}
        </div>
      </CardContent>
    </Card>
  )
}
