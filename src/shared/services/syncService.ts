import { useEffect, useState } from 'react';
import type { Note } from '@/entities/note/model/types';
import { db, ensureDbReady, type SyncAction, type SyncQueueRecord } from '@/shared/db';
import { firebaseService } from '@/shared/services/firebaseService';

export type SyncState = {
  online: boolean;
  queueLength: number;
  processing: boolean;
  lastError: string | null;
};

type SyncListener = (status: SyncState) => void;

class SyncService {
  private static instance: SyncService;
  private readonly readyPromise: Promise<void>;
  private online: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private queueLength = 0;
  private processing = false;
  private lastError: string | null = null;
  private listeners = new Set<SyncListener>();
  private noteListeners = new Set<(noteId: string) => void>();
  private authUnsubscribe?: () => void;
  private queueRunning = false;

  private constructor() {
    this.readyPromise = this.initialize();
  }

  static getInstance(): SyncService {
    if (!SyncService.instance) {
      SyncService.instance = new SyncService();
    }
    return SyncService.instance;
  }

  getStatus(): SyncState {
    return {
      online: this.online,
      queueLength: this.queueLength,
      processing: this.processing,
      lastError: this.lastError,
    };
  }

  subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    listener(this.getStatus());
    return () => {
      this.listeners.delete(listener);
    };
  }

  subscribeNoteChange(listener: (noteId: string) => void): () => void {
    this.noteListeners.add(listener);
    return () => {
      this.noteListeners.delete(listener);
    };
  }

  async enqueue(action: SyncAction, noteId: string, payload: Partial<Note>): Promise<void> {
    await this.ensureReady();
    const timestamp = new Date().toISOString();
    const existing = await db.syncQueue.where('noteId').equals(noteId).first();

    if (existing?.id) {
      if (action === 'delete') {
        if (existing.action === 'create') {
          await db.syncQueue.delete(existing.id);
          await this.afterQueueMutation(noteId);
          return;
        }
        await db.syncQueue.update(existing.id, {
          action: 'delete',
          payload: {},
          timestamp,
          error: null,
        });
        await this.afterQueueMutation(noteId);
        return;
      }

      const updatedAction = existing.action === 'create' ? 'create' : action;
      await db.syncQueue.update(existing.id, {
        action: updatedAction,
        payload,
        timestamp,
        error: null,
      });
      await this.afterQueueMutation(noteId);
      return;
    }

    const record: SyncQueueRecord = {
      action,
      noteId,
      payload,
      timestamp,
    };
    await db.syncQueue.add(record);
    await this.afterQueueMutation(noteId);
  }

  private async initialize(): Promise<void> {
    await ensureDbReady();
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.handleOnline);
      window.addEventListener('offline', this.handleOffline);
    }
    this.authUnsubscribe = firebaseService.onAuthStateChanged(() => {
      if (this.online) {
        void this.processQueue();
      }
    });
    await this.refreshQueueLength();
    void this.processQueue();
  }

  private async ensureReady(): Promise<void> {
    await this.readyPromise;
  }

  private handleOnline = (): void => {
    this.online = true;
    this.notify();
    void this.processQueue();
  };

  private handleOffline = (): void => {
    this.online = false;
    this.notify();
  };

  private async afterQueueMutation(noteId: string): Promise<void> {
    this.lastError = null;
    await this.refreshQueueLength();
    this.notifyNoteChange(noteId);
    void this.processQueue();
  }

  private async processQueue(): Promise<void> {
    await this.ensureReady();
    if (!this.online || this.queueRunning) {
      return;
    }

    this.queueRunning = true;
    this.processing = true;
    this.notify();

    try {
      while (this.online) {
        const nextRecord = await db.syncQueue.orderBy('timestamp').first();
        if (!nextRecord) {
          break;
        }

        try {
          await firebaseService.syncNoteRecord(nextRecord);
          if (nextRecord.id) {
            await db.syncQueue.delete(nextRecord.id);
          }
          await this.markNoteSynced(nextRecord);
          this.notifyNoteChange(nextRecord.noteId);
          this.lastError = null;
        } catch (error) {
          const message =
            error instanceof Error ? error.message : 'Не удалось синхронизировать заметку.';
          if (nextRecord.id) {
            await db.syncQueue.update(nextRecord.id, { error: message });
          }
          this.lastError = message;
          this.notifyNoteChange(nextRecord.noteId);
          break;
        } finally {
          await this.refreshQueueLength();
        }
      }
    } finally {
      this.processing = false;
      this.queueRunning = false;
      this.notify();
    }
  }

  private async markNoteSynced(record: SyncQueueRecord): Promise<void> {
    if (record.action === 'delete') {
      return;
    }
    await db.notes.update(record.noteId, { synced: true });
  }

  private async refreshQueueLength(): Promise<void> {
    this.queueLength = await db.syncQueue.count();
    this.notify();
  }

  private notify(): void {
    const status = this.getStatus();
    this.listeners.forEach((listener) => listener(status));
  }

  private notifyNoteChange(noteId: string): void {
    this.noteListeners.forEach((listener) => listener(noteId));
  }
}

export const syncService = SyncService.getInstance();

export const useSyncStatus = (): SyncState => {
  const [status, setStatus] = useState<SyncState>(syncService.getStatus());

  useEffect(() => {
    return syncService.subscribe(setStatus);
  }, [setStatus]);

  return status;
};
