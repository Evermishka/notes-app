import { VIEW_EDITOR_ACTIONS } from './view-editor-actions.const';

export type ViewMode = 'view' | 'edit';

export type ViewEditorState = {
  mode: ViewMode;
  isDeleteModalOpen: boolean;
};

export type ViewEditorContextType = ViewEditorState & {
  setMode: (mode: ViewMode) => void;
  openDeleteModal: () => void;
  closeDeleteModal: () => void;
};

export type ViewEditorAction =
  | { type: typeof VIEW_EDITOR_ACTIONS.SET_MODE; payload: ViewMode }
  | { type: typeof VIEW_EDITOR_ACTIONS.OPEN_DELETE_MODAL }
  | { type: typeof VIEW_EDITOR_ACTIONS.CLOSE_DELETE_MODAL };
