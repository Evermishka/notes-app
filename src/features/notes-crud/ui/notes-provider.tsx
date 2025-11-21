import { type ReactNode, useMemo, useReducer } from 'react';
import {
  initialState,
  NotesContext,
  notesReducer,
  useNotesActions,
  type NotesContextType,
} from '../model';

interface NotesProviderProps {
  children: ReactNode;
}

export const NotesProvider = ({ children }: NotesProviderProps) => {
  const [state, dispatch] = useReducer(notesReducer, initialState);

  const actions = useNotesActions(dispatch);

  const value: NotesContextType = useMemo(
    () => ({
      ...state,
      ...actions,
    }),
    [state, actions]
  );

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
};
