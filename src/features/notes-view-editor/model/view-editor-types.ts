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
