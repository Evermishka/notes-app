import { useMemo, useState, useCallback, type ReactNode } from 'react';
import {
  ViewEditorContext,
  type ViewEditorContextType,
  type ViewEditorState,
  type ViewMode,
} from '../model';

interface ViewEditorProviderProps {
  children: ReactNode;
}

const initialState: ViewEditorState = {
  mode: 'view',
  isDeleteModalOpen: false,
};

export const ViewEditorProvider = ({ children }: ViewEditorProviderProps) => {
  const [state, setState] = useState(initialState);

  const setMode = useCallback((mode: ViewMode) => {
    setState((prev) => ({ ...prev, mode }));
  }, []);

  const openDeleteModal = useCallback(() => {
    setState((prev) => ({ ...prev, isDeleteModalOpen: true }));
  }, []);

  const closeDeleteModal = useCallback(() => {
    setState((prev) => ({ ...prev, isDeleteModalOpen: false }));
  }, []);

  const value: ViewEditorContextType = useMemo(
    () => ({
      ...state,
      setMode,
      openDeleteModal,
      closeDeleteModal,
    }),
    [state, setMode, openDeleteModal, closeDeleteModal]
  );

  return <ViewEditorContext.Provider value={value}>{children}</ViewEditorContext.Provider>;
};
