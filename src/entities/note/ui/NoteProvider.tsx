import { type ReactNode } from 'react';
import {
  NoteStateContext,
  NoteDispatchContext,
  SelectedNoteContext,
  NotesListContext,
  LoadingContext,
  ErrorContext,
  useNoteContext,
} from '../model/use-note-store';

interface NoteProviderProps {
  children: ReactNode;
}

export const NoteProvider = ({ children }: NoteProviderProps) => {
  const { state, dispatchValue, selectedNote, notes, loading, error } = useNoteContext();

  return (
    <NoteStateContext.Provider value={state}>
      <NoteDispatchContext.Provider value={dispatchValue}>
        <SelectedNoteContext.Provider value={selectedNote}>
          <NotesListContext.Provider value={notes}>
            <LoadingContext.Provider value={loading}>
              <ErrorContext.Provider value={error}>{children}</ErrorContext.Provider>
            </LoadingContext.Provider>
          </NotesListContext.Provider>
        </SelectedNoteContext.Provider>
      </NoteDispatchContext.Provider>
    </NoteStateContext.Provider>
  );
};
