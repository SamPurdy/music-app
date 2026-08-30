// ── IndexedDB Storage for Audio Voice Memos ────────────────────

export interface AudioMemo {
  id: string
  sectionId: number
  blob: Blob
  mimeType: string
  duration: number
  createdAt: number
  name?: string
}

const DB_NAME = 'soundwave_audio_memos_db'
const DB_VERSION = 1
const STORE_NAME = 'audio_memos'

let dbPromise: Promise<IDBDatabase> | null = null

function getDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise

  dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment.'))
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        store.createIndex('sectionId', 'sectionId', { unique: false })
        store.createIndex('createdAt', 'createdAt', { unique: false })
      }
    }

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onerror = () => {
      reject(request.error)
    }
  })

  return dbPromise
}

/** Save or update an audio memo in IndexedDB */
export async function saveAudioMemo(memo: AudioMemo): Promise<string> {
  const db = await getDB()
  return new Promise<string>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const req = store.put(memo)

    req.onsuccess = () => resolve(memo.id)
    req.onerror = () => reject(req.error)
  })
}

/** Retrieve an audio memo by its unique ID */
export async function getAudioMemo(id: string): Promise<AudioMemo | undefined> {
  const db = await getDB()
  return new Promise<AudioMemo | undefined>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const req = store.get(id)

    req.onsuccess = () => resolve(req.result as AudioMemo | undefined)
    req.onerror = () => reject(req.error)
  })
}

/** Delete an audio memo by ID */
export async function deleteAudioMemo(id: string): Promise<void> {
  const db = await getDB()
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const req = store.delete(id)

    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })
}

/** Trigger download of an audio memo blob */
export function exportAudioMemo(blob: Blob, filename = 'voice-memo.webm'): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
