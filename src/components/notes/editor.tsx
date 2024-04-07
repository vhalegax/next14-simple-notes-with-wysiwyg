"use client"
import { useState, useMemo } from "react"
import { X } from "lucide-react"
import dynamic from "next/dynamic"
import "react-quill/dist/quill.snow.css"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { NoteType } from "@/types/NoteType"
import { saveToIndexedDB, updateNoteInIndexedDB } from "@/utils/index-db"

interface Props {
  open: boolean
  note?: NoteType
  handleEditor: (value: boolean, note?: NoteType) => void
}

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image", "video"],
    ["clean"],
  ],
}

export function NotesEditor({ open, note, handleEditor }: Props) {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    [],
  )
  const [title, setTitle] = useState(note?.title || "")
  const [content, setContent] = useState(note?.content || "")

  const handleSave = async () => {
    if (note?.id) {
      await updateNoteInIndexedDB({ id: note!.id, content, title })
    } else if (content || title) {
      await saveToIndexedDB({ content, title })
    }
    handleEditor(false)
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(open) => {
        if (!open) handleEditor(false)
      }}
    >
      <AlertDialogOverlay
        className="!z-[51] bg-transparent"
        onClick={() => handleSave()}
      />

      <AlertDialogContent
        className={`z-[52] h-[calc(100dvh-100px)] w-[1050px]
       max-w-[calc(100dvw-20px)] gap-y-4 overflow-hidden rounded p-4 text-lg`}
      >
        {/* Header */}
        <div className="flex h-14 items-center justify-between space-x-4">
          <div className="w-full">
            <Input
              type="text"
              value={title}
              placeholder="Your Note Title"
              className="bg-card"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <AlertDialogCancel className="mt-0">
              <X className="h-4 w-4" />
            </AlertDialogCancel>
          </div>
        </div>
        {/* End Header */}

        <div className="h-[calc(100dvh-100px-90px-90px)] max-h-[calc(100dvh-100px-90px-90px)] overflow-y-auto bg-card">
          <ReactQuill
            className="h-[calc(100%-74px)] sm:h-[calc(100%-46px)]"
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
          />
        </div>

        {/* Footer */}
        <div className="!flex h-14 items-center justify-end gap-x-4">
          <Button onClick={handleSave}>Close</Button>
        </div>
        {/* End Footer */}
      </AlertDialogContent>
    </AlertDialog>
  )
}
