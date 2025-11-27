import { createContext, useContext } from 'react';
import type { NoteState, NoteAction } from './note-store';

export type NoteStoreContextType = {
  state: NoteState;
  dispatch: React.Dispatch<NoteAction>;
};

export const NoteStoreContext = createContext<NoteStoreContextType | undefined>(undefined);

export const useNoteStore = () => {
  const context = useContext(NoteStoreContext);
  if (!context) {
    throw new Error('useNoteStore должен использоваться внутри NoteProvider');
  }
  return context;
};
