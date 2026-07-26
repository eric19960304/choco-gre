import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import type { SyncedWordProgress } from '../types/sync'
import type { StoredVocabularyData, SyncStatus } from '../types/vocabulary'
import {
  mergeSyncedReviewEvents,
  mergeSyncedWordProgress,
  syncedWordFingerprint,
  toSyncedReviewEvent,
  toSyncedWordProgress,
} from '../utils/progressSync'

export function useCloudVocabularySync({
  userId,
  enabled,
  data,
  setData,
}: {
  userId: string | null
  enabled: boolean
  data: StoredVocabularyData
  setData: Dispatch<SetStateAction<StoredVocabularyData>>
}): SyncStatus {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('local')
  const [readyUserId, setReadyUserId] = useState<string | null>(null)
  const cloudProgressRef = useRef(new Map<string, SyncedWordProgress>())
  const cloudEventIdsRef = useRef(new Set<string>())
  const activeUserIdRef = useRef(userId)
  activeUserIdRef.current = userId

  useEffect(() => {
    cloudProgressRef.current = new Map()
    cloudEventIdsRef.current = new Set()
    setReadyUserId(null)
    if (!userId || !enabled) {
      setSyncStatus('local')
      return
    }

    let wordProgressReady = false
    let reviewHistoryReady = false
    let active = true
    setSyncStatus('connecting')

    const markReady = () => {
      if (active && wordProgressReady && reviewHistoryReady) {
        setReadyUserId(userId)
        setSyncStatus('synced')
      }
    }
    const handleError = () => {
      if (active) setSyncStatus('error')
    }

    let unsubscribeProgress = () => {}
    let unsubscribeHistory = () => {}
    void import('../services/cloudProgress')
      .then(({ subscribeToReviewHistory, subscribeToWordProgress }) => {
        if (!active) return
        unsubscribeProgress = subscribeToWordProgress(userId, (cloudProgress) => {
          cloudProgressRef.current = new Map(
            cloudProgress.map((progress) => [progress.wordKey, progress]),
          )
          setData((current) => {
            const words = mergeSyncedWordProgress(current.words, cloudProgress)
            return words === current.words ? current : { ...current, words }
          })
          wordProgressReady = true
          markReady()
        }, handleError)

        unsubscribeHistory = subscribeToReviewHistory(userId, (cloudEvents) => {
          cloudEventIdsRef.current = new Set(cloudEvents.map((event) => event.id))
          setData((current) => mergeSyncedReviewEvents(current, cloudEvents))
          reviewHistoryReady = true
          markReady()
        }, handleError)
      })
      .catch(handleError)

    return () => {
      active = false
      unsubscribeProgress()
      unsubscribeHistory()
    }
  }, [enabled, setData, userId])

  useEffect(() => {
    if (!userId || readyUserId !== userId) return

    const progressUpdates = data.words.flatMap((word) => {
      const progress = toSyncedWordProgress(word)
      if (!progress) return []
      const cloudProgress = cloudProgressRef.current.get(progress.wordKey)
      if (
        cloudProgress
        && (
          cloudProgress.updatedAt > progress.updatedAt
          || syncedWordFingerprint(cloudProgress) === syncedWordFingerprint(progress)
        )
      ) return []
      return [progress]
    })

    if (progressUpdates.length) {
      progressUpdates.forEach((progress) => {
        cloudProgressRef.current.set(progress.wordKey, progress)
      })
      void import('../services/cloudProgress')
        .then(({ saveWordProgress }) => saveWordProgress(userId, progressUpdates))
        .catch(() => {
          if (activeUserIdRef.current !== userId) return
          progressUpdates.forEach((progress) => {
            const current = cloudProgressRef.current.get(progress.wordKey)
            if (
              current
              && syncedWordFingerprint(current)
              === syncedWordFingerprint(progress)
            ) cloudProgressRef.current.delete(progress.wordKey)
          })
          setSyncStatus('error')
        })
    }

    const reviewEvents = data.reviewHistory.flatMap((event) => {
      if (cloudEventIdsRef.current.has(event.id)) return []
      const synced = toSyncedReviewEvent(event, data.words)
      return synced ? [synced] : []
    })

    if (reviewEvents.length) {
      reviewEvents.forEach((event) => cloudEventIdsRef.current.add(event.id))
      void import('../services/cloudProgress')
        .then(({ saveReviewEvents }) => saveReviewEvents(userId, reviewEvents))
        .catch(() => {
          if (activeUserIdRef.current !== userId) return
          reviewEvents.forEach((event) => cloudEventIdsRef.current.delete(event.id))
          setSyncStatus('error')
        })
    }
  }, [data, readyUserId, userId])

  return syncStatus
}
