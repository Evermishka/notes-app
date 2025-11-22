import { AuthProvider } from '@/features/auth';
import { NotesProvider } from '@/features/notes-crud';
import { ViewEditorProvider } from '@/features/notes-view-editor';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <MantineProvider>
      <AuthProvider>
        <NotesProvider>
          <ViewEditorProvider>{children}</ViewEditorProvider>
        </NotesProvider>
      </AuthProvider>
    </MantineProvider>
  );
};
