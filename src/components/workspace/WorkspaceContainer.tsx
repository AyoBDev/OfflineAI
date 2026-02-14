import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { NoteList } from './NoteList'
import { NoteEditor } from './NoteEditor'
import { DocumentLibrary } from './DocumentLibrary'
import { useNotes } from '@/hooks/useNotes'
import { useDocuments } from '@/hooks/useDocuments'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export function WorkspaceContainer() {
  const { notes, activeNote, createNote, updateNote, deleteNote, selectNote } =
    useNotes()
  const { documents, deleteDocument } = useDocuments()
  const [mobileShowEditor, setMobileShowEditor] = useState(false)

  const handleSelectNote = (id: string) => {
    selectNote(id)
    setMobileShowEditor(true)
  }

  const handleCreateNote = async () => {
    await createNote()
    setMobileShowEditor(true)
  }

  return (
    <div className="flex h-full flex-col">
      <Tabs defaultValue="notes" className="flex h-full flex-col">
        <div className="border-b px-4 pl-14 md:pl-4">
          <TabsList className="h-10">
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="notes" className="flex-1 m-0 overflow-hidden">
          {/* Desktop: side-by-side */}
          <div className="hidden sm:flex h-full">
            <div className="w-64 border-r shrink-0">
              <NoteList
                notes={notes}
                activeId={activeNote?.id}
                onCreate={createNote}
                onSelect={selectNote}
                onDelete={deleteNote}
              />
            </div>
            <div className="flex-1">
              {activeNote ? (
                <NoteEditor note={activeNote} onUpdate={updateNote} />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  Select a note or create a new one
                </div>
              )}
            </div>
          </div>

          {/* Mobile: list or editor */}
          <div className="sm:hidden h-full">
            {mobileShowEditor && activeNote ? (
              <div className="flex h-full flex-col">
                <div className="border-b px-2 py-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMobileShowEditor(false)}
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                </div>
                <div className="flex-1 overflow-auto">
                  <NoteEditor note={activeNote} onUpdate={updateNote} />
                </div>
              </div>
            ) : (
              <NoteList
                notes={notes}
                activeId={activeNote?.id}
                onCreate={handleCreateNote}
                onSelect={handleSelectNote}
                onDelete={deleteNote}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="documents" className="flex-1 m-0 overflow-hidden">
          <DocumentLibrary documents={documents} onDelete={deleteDocument} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
