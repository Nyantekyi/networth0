export interface Note {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
}

export const useNotes = () => {
  const notes = useState<Note[]>('notes', () => {
    // Load from localStorage if in browser
    if (process.client) {
      const stored = localStorage.getItem('notes')
      if (stored) {
        const parsed = JSON.parse(stored)
        return parsed.map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt)
        }))
      }
    }
    return []
  })

  const saveToStorage = () => {
    if (process.client) {
      localStorage.setItem('notes', JSON.stringify(notes.value))
    }
  }

  const createNote = (title: string, content: string = ''): Note => {
    const note: Note = {
      id: Date.now().toString(),
      title,
      content,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    notes.value.push(note)
    saveToStorage()
    return note
  }

  const updateNote = (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => {
    const index = notes.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notes.value[index] = {
        ...notes.value[index],
        ...updates,
        updatedAt: new Date()
      }
      saveToStorage()
    }
  }

  const deleteNote = (id: string) => {
    notes.value = notes.value.filter(n => n.id !== id)
    saveToStorage()
  }

  const getNoteById = (id: string): Note | undefined => {
    return notes.value.find(n => n.id === id)
  }

  const getNoteByTitle = (title: string): Note | undefined => {
    return notes.value.find(n => n.title.toLowerCase() === title.toLowerCase())
  }

  const parseNoteLinks = (content: string): { text: string; isLink: boolean; linkedNote?: Note }[] => {
    const parts: { text: string; isLink: boolean; linkedNote?: Note }[] = []
    const regex = /\[\[([^\]]+)\]\]/g
    let lastIndex = 0
    let match

    while ((match = regex.exec(content)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push({
          text: content.substring(lastIndex, match.index),
          isLink: false
        })
      }

      // Add the link
      const linkedTitle = match[1]
      const linkedNote = getNoteByTitle(linkedTitle)
      parts.push({
        text: linkedTitle,
        isLink: true,
        linkedNote
      })

      lastIndex = regex.lastIndex
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push({
        text: content.substring(lastIndex),
        isLink: false
      })
    }

    return parts
  }

  return {
    notes,
    createNote,
    updateNote,
    deleteNote,
    getNoteById,
    getNoteByTitle,
    parseNoteLinks
  }
}
