import { createContext } from 'react';
import type { ViewEditorContextType } from './view-editor-types';

export const ViewEditorContext = createContext<ViewEditorContextType | undefined>(undefined);
