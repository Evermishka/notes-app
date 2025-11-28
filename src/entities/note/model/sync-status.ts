import type { Note } from './types';

export type NoteSyncMeta = {
  text: string;
  color: 'teal' | 'orange' | 'red';
};

export const getNoteSyncMeta = (note: Note): NoteSyncMeta => {
  const hasError = Boolean(note.syncError);
  const isSynced = note.synced !== false;

  if (hasError) {
    return { text: 'Ошибка синхронизации', color: 'red' };
  }

  if (isSynced) {
    return { text: 'Синхронизировано', color: 'teal' };
  }

  return { text: 'Ожидает синхронизации', color: 'orange' };
};
