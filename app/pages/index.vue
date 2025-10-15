<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">Notes App</h1>
        <p class="text-gray-600 dark:text-gray-400">Create and link your notes using [[NoteName]] syntax</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Notes List -->
        <div class="lg:col-span-1">
          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold">All Notes</h2>
                <UButton @click="openCreateNoteModal" color="primary" size="sm">
                  <template #leading>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </template>
                  New Note
                </UButton>
              </div>
            </template>

            <div v-if="notes.length === 0" class="text-center py-8 text-gray-500">
              No notes yet. Create your first note!
            </div>

            <div v-else class="space-y-2">
              <div
                v-for="note in sortedNotes"
                :key="note.id"
                @click="selectNote(note)"
                :class="[
                  'p-3 rounded-lg cursor-pointer transition-colors',
                  selectedNote?.id === note.id
                    ? 'bg-primary-100 dark:bg-primary-900 border-2 border-primary-500'
                    : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-2 border-transparent'
                ]"
              >
                <h3 class="font-semibold text-gray-900 dark:text-white">{{ note.title }}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {{ note.content || 'Empty note' }}
                </p>
                <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {{ formatDate(note.updatedAt) }}
                </p>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Note Editor -->
        <div class="lg:col-span-2">
          <UCard v-if="selectedNote">
            <template #header>
              <div class="flex items-center justify-between">
                <UInput
                  v-model="selectedNote.title"
                  @input="saveCurrentNote"
                  placeholder="Note title"
                  size="lg"
                  variant="none"
                  class="font-semibold text-2xl"
                />
                <UButton @click="deleteCurrentNote" color="red" variant="ghost" size="sm">
                  <template #leading>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </template>
                  Delete
                </UButton>
              </div>
            </template>

            <div class="space-y-4">
              <!-- Editor -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Content (Use [[NoteName]] to link to other notes)
                </label>
                <UTextarea
                  v-model="selectedNote.content"
                  @input="saveCurrentNote"
                  placeholder="Start typing... Use [[NoteName]] to create a link to another note"
                  :rows="10"
                  size="lg"
                />
              </div>

              <!-- Preview -->
              <div v-if="selectedNote.content">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preview
                </label>
                <div class="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 min-h-[200px]">
                  <div class="prose dark:prose-invert max-w-none">
                    <template v-for="(part, index) in parsedContent" :key="index">
                      <span v-if="!part.isLink">{{ part.text }}</span>
                      <UBadge
                        v-else
                        :color="part.linkedNote ? 'primary' : 'gray'"
                        variant="subtle"
                        class="cursor-pointer mx-1"
                        @click="part.linkedNote ? selectNote(part.linkedNote) : createNoteFromLink(part.text)"
                      >
                        <template #leading>
                          <svg v-if="part.linkedNote" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <svg v-else class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                          </svg>
                        </template>
                        {{ part.text }}
                      </UBadge>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </UCard>

          <UCard v-else>
            <div class="text-center py-16 text-gray-500">
              <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p class="text-lg font-medium">Select a note to view or edit</p>
              <p class="text-sm mt-2">Or create a new note to get started</p>
            </div>
          </UCard>
        </div>
      </div>
    </div>

    <!-- Create Note Modal -->
    <UModal v-model="isCreateModalOpen">
      <UCard>
        <template #header>
          <h3 class="text-xl font-semibold">Create New Note</h3>
        </template>

        <div class="space-y-4">
          <UInput
            v-model="newNoteTitle"
            placeholder="Note title"
            size="lg"
            autofocus
            @keyup.enter="createNewNote"
          />
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="ghost" @click="isCreateModalOpen = false">
              Cancel
            </UButton>
            <UButton color="primary" @click="createNewNote" :disabled="!newNoteTitle.trim()">
              Create Note
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const {
  notes,
  createNote,
  updateNote,
  deleteNote,
  getNoteByTitle,
  parseNoteLinks
} = useNotes()

const selectedNote = ref<typeof notes.value[0] | null>(null)
const isCreateModalOpen = ref(false)
const newNoteTitle = ref('')

const sortedNotes = computed(() => {
  return [...notes.value].sort((a, b) => 
    b.updatedAt.getTime() - a.updatedAt.getTime()
  )
})

const parsedContent = computed(() => {
  if (!selectedNote.value?.content) return []
  return parseNoteLinks(selectedNote.value.content)
})

const selectNote = (note: typeof notes.value[0]) => {
  selectedNote.value = { ...note }
}

const saveCurrentNote = () => {
  if (selectedNote.value) {
    updateNote(selectedNote.value.id, {
      title: selectedNote.value.title,
      content: selectedNote.value.content
    })
  }
}

const deleteCurrentNote = () => {
  if (selectedNote.value && confirm('Are you sure you want to delete this note?')) {
    deleteNote(selectedNote.value.id)
    selectedNote.value = null
  }
}

const openCreateNoteModal = () => {
  newNoteTitle.value = ''
  isCreateModalOpen.value = true
}

const createNewNote = () => {
  if (newNoteTitle.value.trim()) {
    const note = createNote(newNoteTitle.value.trim())
    selectedNote.value = { ...note }
    isCreateModalOpen.value = false
    newNoteTitle.value = ''
  }
}

const createNoteFromLink = (title: string) => {
  if (confirm(`Note "${title}" doesn't exist. Create it?`)) {
    const note = createNote(title)
    selectedNote.value = { ...note }
  }
}

const formatDate = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

// Initialize with example notes if empty
onMounted(() => {
  if (notes.value.length === 0) {
    createNote('Welcome', 'Welcome to the Notes App! You can create notes and link them together using [[NoteName]] syntax.\n\nFor example, try creating a note called "Todo" and then reference it here: [[Todo]]')
    createNote('Todo', 'This is my todo list:\n- Learn about note linking\n- Create more notes\n- Link to [[Welcome]] page')
  }
})
</script>
