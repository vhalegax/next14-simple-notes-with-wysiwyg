import { NoteType } from "@/types/NoteType"

import { generateUUID } from "./uuid"

const DATABASE_NAME = "notes_database"

interface SaveNoteProps {
  content: string
  title?: string
}

interface UpdateNoteProps extends SaveNoteProps {
  id: string
  width?: number
  height?: number
  coordinate?: {
    x: number
    y: number
  }
}

export function saveToIndexedDB({
  content,
  title,
}: SaveNoteProps): Promise<void> {
  return new Promise((resolve, reject) => {
    const note = {
      id: generateUUID(),
      title: title || "",
      content: content,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    }

    // Open (or create) the database
    const request = indexedDB.open(DATABASE_NAME, 1)

    // Handle database opening success
    request.onsuccess = function (event) {
      const db = (event.target as IDBOpenDBRequest).result as IDBDatabase

      // Start a new transaction
      const transaction = db.transaction(["notes"], "readwrite")

      // Access the object store
      const objectStore = transaction.objectStore("notes")

      // Add the note to the object store
      const addRequest = objectStore.add(note)

      // Handle the successful addition of the note
      addRequest.onsuccess = function (event) {
        console.log("Note added to IndexedDB")
        resolve() // Resolve the promise when the note is successfully added
      }

      // Handle errors
      addRequest.onerror = function (event) {
        console.error(
          "Error adding note to IndexedDB",
          (event.target as IDBRequest).error,
        )
        reject((event.target as IDBRequest).error) // Reject the promise if there's an error
      }

      // Close the transaction
      transaction.oncomplete = function () {
        db.close()
      }
    }

    // Handle database opening errors
    request.onerror = function (event) {
      console.error(
        "Error opening IndexedDB",
        (event.target as IDBRequest).error,
      )
      reject((event.target as IDBRequest).error) // Reject the promise if there's an error opening the database
    }

    // Handle database upgrades (e.g., creating object store)
    request.onupgradeneeded = function (event) {
      const db = (event.target as IDBOpenDBRequest).result as IDBDatabase

      // Create the object store
      const objectStore = db.createObjectStore("notes", { keyPath: "id" })

      // Create an index for searching notes if needed
      // objectStore.createIndex('valueIndex', 'value', { unique: false });
    }
  })
}

export function readNotesFromIndexedDB(): Promise<NoteType[]> {
  return new Promise((resolve, reject) => {
    // Open (or create) the database
    const request = indexedDB.open(DATABASE_NAME, 1)

    // Handle database opening success
    request.onsuccess = function (event) {
      const db = (event.target as IDBOpenDBRequest).result as IDBDatabase

      // Start a new transaction
      const transaction = db.transaction(["notes"], "readonly")

      // Access the object store
      const objectStore = transaction.objectStore("notes")

      // Create a cursor to iterate over the object store
      const notes: NoteType[] = []
      const cursorRequest = objectStore.openCursor()

      // Handle cursor success
      cursorRequest.onsuccess = function (event) {
        const cursor = (event.target as IDBRequest).result as IDBCursorWithValue
        if (cursor) {
          // Add note to the list
          notes.push(cursor.value as NoteType)
          cursor.continue()
        } else {
          // No more entries
          resolve(notes)
        }
      }

      // Handle cursor errors
      cursorRequest.onerror = function (event) {
        reject((event.target as IDBRequest).error)
      }

      // Close the transaction
      transaction.oncomplete = function () {
        db.close()
      }
    }

    // Handle database opening errors
    request.onerror = function (event) {
      reject((event.target as IDBRequest).error)
    }
  })
}

export function updateNoteInIndexedDB({
  id,
  content,
  title,
  width,
  height,
  coordinate,
}: UpdateNoteProps): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, 1)

    request.onsuccess = function (event) {
      const db = (event.target as IDBOpenDBRequest).result as IDBDatabase

      const transaction = db.transaction(["notes"], "readwrite")

      const objectStore = transaction.objectStore("notes")

      const getRequest = objectStore.get(id)

      getRequest.onsuccess = function (event) {
        const note = (event.target as IDBRequest).result as NoteType

        if (note) {
          note.content = content
          note.title = title
          note.updatedAt = new Date().getTime()

          if (width) note.width = width
          if (height) note.height = height

          const updateRequest = objectStore.put(note)

          updateRequest.onsuccess = function () {
            console.log("Note updated in IndexedDB")
            resolve()
          }

          updateRequest.onerror = function (event) {
            console.error(
              "Error updating note in IndexedDB",
              (event.target as IDBRequest).error,
            )
            reject((event.target as IDBRequest).error)
          }
        } else {
          reject("Note not found")
        }
      }

      getRequest.onerror = function (event) {
        console.error(
          "Error retrieving note from IndexedDB for update",
          (event.target as IDBRequest).error,
        )
        reject((event.target as IDBRequest).error)
      }

      transaction.oncomplete = function () {
        db.close()
      }
    }

    request.onerror = function (event) {
      console.error(
        "Error opening IndexedDB for update",
        (event.target as IDBRequest).error,
      )
      reject((event.target as IDBRequest).error)
    }
  })
}

export function createIndexedDB() {
  // Check if IndexedDB is supported by the browser
  if (!window.indexedDB) {
    console.error("IndexedDB is not supported by your browser")
    return
  }

  var request = window.indexedDB.open(DATABASE_NAME, 1)

  // Handle database creation/upgrading
  request.onupgradeneeded = function (event: any) {
    var db = event.target.result

    // Check if the "notes" object store already exists
    if (!db.objectStoreNames.contains("notes")) {
      db.createObjectStore("notes", { keyPath: "id" })
    }
  }

  // Handle successful database opening or creation
  request.onsuccess = function (event) {
    console.log("Database opened/created successfully")
  }
}
