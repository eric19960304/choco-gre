import {
  collection,
  doc,
  getFirestore,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  type DocumentData,
  type Unsubscribe,
} from 'firebase/firestore'
import type { SyncedReviewEvent, SyncedWordProgress } from '../types/sync'
import { firebaseApp } from './firebase'

const MAX_BATCH_SIZE = 400
const firebaseDb = getFirestore(firebaseApp)

function progressDocumentId(wordKey: string): string {
  return encodeURIComponent(wordKey)
}

function isStringOrNull(value: unknown): value is string | null {
  return typeof value === 'string' || value === null
}

function parseWordProgress(data: DocumentData): SyncedWordProgress | null {
  if (
    typeof data.wordKey !== 'string'
    || typeof data.word !== 'string'
    || !Number.isInteger(data.reviewLevel)
    || typeof data.nextReviewAt !== 'string'
    || !isStringOrNull(data.viewedAt)
    || !isStringOrNull(data.lastReviewedAt)
    || !Number.isInteger(data.correctCount)
    || !Number.isInteger(data.incorrectCount)
    || typeof data.isMastered !== 'boolean'
    || typeof data.updatedAt !== 'string'
  ) return null
  return {
    wordKey: data.wordKey,
    word: data.word,
    reviewLevel: data.reviewLevel,
    nextReviewAt: data.nextReviewAt,
    viewedAt: data.viewedAt,
    lastReviewedAt: data.lastReviewedAt,
    correctCount: data.correctCount,
    incorrectCount: data.incorrectCount,
    isMastered: data.isMastered,
    updatedAt: data.updatedAt,
  }
}

function parseReviewEvent(data: DocumentData): SyncedReviewEvent | null {
  if (
    typeof data.id !== 'string'
    || typeof data.wordKey !== 'string'
    || typeof data.rating !== 'string'
    || !['again', 'hard', 'good', 'master', 'easy'].includes(data.rating)
    || typeof data.reviewedAt !== 'string'
  ) return null
  return {
    id: data.id,
    wordKey: data.wordKey,
    rating: data.rating,
    reviewedAt: data.reviewedAt,
  } as SyncedReviewEvent
}

export function subscribeToWordProgress(
  userId: string,
  onData: (progress: SyncedWordProgress[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    collection(firebaseDb, 'users', userId, 'wordProgress'),
    (snapshot) => onData(snapshot.docs.flatMap((item) => {
      const progress = parseWordProgress(item.data())
      return progress ? [progress] : []
    })),
    onError,
  )
}

export function subscribeToReviewHistory(
  userId: string,
  onData: (events: SyncedReviewEvent[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    collection(firebaseDb, 'users', userId, 'reviewHistory'),
    (snapshot) => onData(snapshot.docs.flatMap((item) => {
      const event = parseReviewEvent(item.data())
      return event ? [event] : []
    })),
    onError,
  )
}

export async function saveWordProgress(
  userId: string,
  updates: SyncedWordProgress[],
): Promise<void> {
  for (let index = 0; index < updates.length; index += MAX_BATCH_SIZE) {
    const batch = writeBatch(firebaseDb)
    updates.slice(index, index + MAX_BATCH_SIZE).forEach((progress) => {
      batch.set(
        doc(firebaseDb, 'users', userId, 'wordProgress', progressDocumentId(progress.wordKey)),
        { ...progress, serverUpdatedAt: serverTimestamp() },
      )
    })
    await batch.commit()
  }
}

export async function saveReviewEvents(
  userId: string,
  events: SyncedReviewEvent[],
): Promise<void> {
  for (let index = 0; index < events.length; index += MAX_BATCH_SIZE) {
    const batch = writeBatch(firebaseDb)
    events.slice(index, index + MAX_BATCH_SIZE).forEach((event) => {
      batch.set(
        doc(firebaseDb, 'users', userId, 'reviewHistory', event.id),
        { ...event, serverCreatedAt: serverTimestamp() },
      )
    })
    await batch.commit()
  }
}
