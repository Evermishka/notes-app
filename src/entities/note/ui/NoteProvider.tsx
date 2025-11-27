import { type ReactNode } from 'react';
import { NoteStateContext, NoteDispatchContext, useNoteContext } from '../model/use-note-store';

interface NoteProviderProps {
  children: ReactNode;
}

export const NoteProvider = ({ children }: NoteProviderProps) => {
  const { state, dispatchValue } = useNoteContext();

  return (
    <NoteStateContext.Provider value={state}>
      <NoteDispatchContext.Provider value={dispatchValue}>{children}</NoteDispatchContext.Provider>
    </NoteStateContext.Provider>
  );
};
