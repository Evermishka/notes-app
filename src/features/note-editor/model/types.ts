export type ViewMode = 'view' | 'edit';

export type EditorModeState = {
  mode: ViewMode;
};

export type EditorModeContextType = {
  state: EditorModeState;
  setMode: (mode: ViewMode) => void;
  toggleMode: () => void;
  setViewMode: () => void;
  setEditMode: () => void;
};
