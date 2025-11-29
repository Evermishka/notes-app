import type { Note } from './types';

export type NoteSyncMeta = {
  text: string;
  color: 'secondary' | 'primary' | 'danger';
};

export const getNoteSyncMeta = (note: Note): NoteSyncMeta => {
  const hasError = Boolean(note.syncError);
  const isSynced = note.synced !== false;

  if (hasError) {
    return { text: 'Ошибка синхронизации', color: 'danger' };
  }

  if (isSynced) {
    return { text: 'Синхронизировано', color: 'secondary' };
  }

  return { text: 'Ожидает синхронизации', color: 'primary' };
};
