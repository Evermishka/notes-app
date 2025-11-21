import { createContext } from 'react';
import type { NotesContextType } from './notes-types';

export const NotesContext = createContext<NotesContextType | undefined>(undefined);
