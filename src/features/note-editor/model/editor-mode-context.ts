import { createContext, type Dispatch, type SetStateAction } from 'react';

export type ViewMode = 'view' | 'edit';

export interface EditorModeContextValue {
  mode: ViewMode;
  setMode: Dispatch<SetStateAction<ViewMode>>;
  toggleMode: () => void;
  setViewMode: () => void;
  setEditMode: () => void;
}

export const EditorModeContext = createContext<EditorModeContextValue | undefined>(undefined);
