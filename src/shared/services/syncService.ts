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

// Приоритеты операций синхронизации (меньше число = выше приоритет)
const SYNC_PRIORITIES: Record<SyncAction, number> = {
  delete: 0, // Удаления обрабатываются первыми
  update: 1, // Затем обновления
  create: 2, // Создания последними
};

class SyncService {
  private static instance: SyncService;
  private readonly readyPromise: Promise<void>;
  private online: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private queueLength = 0;
  private processing = false;
  private lastError: string | null = null;
  private listeners = new Set<SyncListener>();
  private noteListeners = new Set<(noteId: string) => void>();
  private downloadListeners = new Set<() => void>();
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

  subscribeDownloadComplete(listener: () => void): () => void {
    this.downloadListeners.add(listener);
    return () => {
      this.downloadListeners.delete(listener);
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
          error: undefined,
        });
        await this.afterQueueMutation(noteId);
        return;
      }

      const updatedAction = existing.action === 'create' ? 'create' : action;
      await db.syncQueue.update(existing.id, {
        action: updatedAction,
        payload,
        timestamp,
        error: undefined,
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
    await db.syncQueue.add({
      ...record,
      error: undefined,
    });
    await this.afterQueueMutation(noteId);
  }

  private async initialize(): Promise<void> {
    await ensureDbReady();
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.handleOnline);
      window.addEventListener('offline', this.handleOffline);
    }
    firebaseService.onAuthStateChanged(() => {
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
      const BATCH_SIZE = 5; // Обрабатываем по 5 записей одновременно

      while (this.online) {
        // Получаем следующую партию записей для обработки с учетом приоритетов
        const allRecords = await db.syncQueue.orderBy('timestamp').toArray();

        // Сортируем по приоритету, затем по времени
        const sortedRecords = allRecords
          .sort((a, b) => {
            const priorityDiff = SYNC_PRIORITIES[a.action] - SYNC_PRIORITIES[b.action];
            if (priorityDiff !== 0) return priorityDiff;
            return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
          })
          .slice(0, BATCH_SIZE);

        const batchRecords = sortedRecords;

        if (batchRecords.length === 0) {
          break;
        }

        // Обрабатываем партию параллельно
        const batchPromises = batchRecords.map(async (record) => {
          try {
            await firebaseService.syncNoteRecord(record);
            if (record.id) {
              await db.syncQueue.delete(record.id);
            }
            await this.markNoteSynced(record);
            this.notifyNoteChange(record.noteId);
            return { success: true, record };
          } catch (error) {
            const message =
              error instanceof Error ? error.message : 'Не удалось синхронизировать заметку.';
            if (record.id) {
              await db.syncQueue.update(record.id, { error: message });
            }
            this.lastError = message;
            this.notifyNoteChange(record.noteId);
            return { success: false, record, error: message };
          }
        });

        const results = await Promise.allSettled(batchPromises);

        // Если есть ошибки в партии, останавливаемся
        const hasErrors = results.some(
          (result) =>
            result.status === 'rejected' || (result.status === 'fulfilled' && !result.value.success)
        );

        if (hasErrors) {
          break;
        }

        await this.refreshQueueLength();
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

  private notifyDownloadComplete(): void {
    this.downloadListeners.forEach((listener) => listener());
  }

  /**
   * Загружает все заметки из Firebase и обновляет локальную базу данных
   * Вызывается после авторизации для синхронизации данных
   */
  async downloadFromFirebase(): Promise<void> {
    try {
      await this.ensureReady();
      console.warn('Downloading notes from Firebase...');

      // Загружаем все заметки из Firebase
      const firebaseNotes = await firebaseService.fetchNotes();

      // Обновляем локальную базу данных
      for (const firebaseNote of firebaseNotes) {
        const existingLocal = await db.notes.get(firebaseNote.id);

        if (!existingLocal) {
          // Новая заметка из Firebase
          const storedNote = {
            id: firebaseNote.id,
            title: firebaseNote.title,
            content: firebaseNote.content,
            createdAt: firebaseNote.createdAt,
            updatedAt: firebaseNote.updatedAt,
            synced: true,
          };
          await db.notes.add(storedNote);
        } else if (new Date(firebaseNote.updatedAt) > new Date(existingLocal.updatedAt)) {
          // Firebase версия новее
          await db.notes.update(firebaseNote.id, {
            title: firebaseNote.title,
            content: firebaseNote.content,
            updatedAt: firebaseNote.updatedAt,
            synced: true,
          });
        }
      }

      console.warn(`Downloaded ${firebaseNotes.length} notes from Firebase`);

      // Уведомляем подписчиков о завершении загрузки
      this.notifyDownloadComplete();
    } catch (error) {
      console.error('Failed to download from Firebase:', error);
      throw error;
    }
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
