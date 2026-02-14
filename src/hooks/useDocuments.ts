import { useState, useEffect, useCallback } from 'react'
import { getAllDocuments, deleteDocument as dbDeleteDocument } from '@/lib/db'
import type { Document } from '@/types'

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([])

  const load = useCallback(async () => {
    const all = await getAllDocuments()
    setDocuments(all)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const deleteDocument = useCallback(
    async (id: string) => {
      await dbDeleteDocument(id)
      await load()
    },
    [load]
  )

  return { documents, deleteDocument, refresh: load }
}
