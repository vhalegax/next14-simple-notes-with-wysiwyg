export type NoteType = {
  id: string
  title?: string
  content: string
  height?: number
  width?: number
  createdAt: number
  updatedAt: number
  coordinate?: {
    x: number
    y: number
  }
}
