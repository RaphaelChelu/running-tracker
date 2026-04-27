import { openDB } from 'idb'

const DB_NAME = 'running-tracker'
const DB_VERSION = 1
const STORE_DAYS = 'days'

let dbPromise

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_DAYS)) {
          db.createObjectStore(STORE_DAYS, { keyPath: 'date' })
        }
      },
    })
  }
  return dbPromise
}

export async function requestPersistence() {
  if (navigator.storage?.persist) {
    const granted = await navigator.storage.persist()
    return granted
  }
  return false
}

export async function getDay(date) {
  const db = await getDb()
  return (await db.get(STORE_DAYS, date)) ?? null
}

export async function saveDay(day) {
  const db = await getDb()
  await db.put(STORE_DAYS, day)
}

export async function getDaysBetween(startDate, endDate) {
  const db = await getDb()
  const range = IDBKeyRange.bound(startDate, endDate)
  return await db.getAll(STORE_DAYS, range)
}

export async function getAllDays() {
  const db = await getDb()
  return await db.getAll(STORE_DAYS)
}

export async function clearAll() {
  const db = await getDb()
  await db.clear(STORE_DAYS)
}

export async function importDays(days) {
  const db = await getDb()
  const tx = db.transaction(STORE_DAYS, 'readwrite')
  for (const day of days) {
    await tx.store.put(day)
  }
  await tx.done
}
