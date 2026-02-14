import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { NoteList } from './NoteList'
import { NoteEditor } from './NoteEditor'
import { DocumentLibrary } from './DocumentLibrary'
import { useNotes } from '@/hooks/useNotes'
import { useDocuments } from '@/hooks/useDocuments'

export function WorkspaceContainer() {
  const { notes, activeNote, createNote, updateNote, deleteNote, selectNote } =
    useNotes()
  const { documents, deleteDocument } = useDocuments()

  return (
    <div className="flex h-full flex-col">
      <Tabs defaultValue="notes" className="flex h-full flex-col">
        <div className="border-b px-4">
          <TabsList className="h-10">
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="notes" className="flex-1 m-0 overflow-hidden">
          <div className="flex h-full">
            <div className="w-64 border-r">
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
        </TabsContent>

        <TabsContent value="documents" className="flex-1 m-0 overflow-hidden">
          <DocumentLibrary documents={documents} onDelete={deleteDocument} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
