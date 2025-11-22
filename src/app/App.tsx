import { Router } from './router';
import { AuthProvider } from '@/features/auth';
import { NotesProvider } from '@/features/notes-crud';
import { ViewEditorProvider } from '@/features/notes-view-editor';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

export const App = () => {
  return (
    <MantineProvider>
      <AuthProvider>
        <NotesProvider>
          <ViewEditorProvider>
            <Router />
          </ViewEditorProvider>
        </NotesProvider>
      </AuthProvider>
    </MantineProvider>
  );
};
