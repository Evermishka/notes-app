import { AuthProvider } from '@/features/auth';
import { NoteProvider } from '@/entities/note';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <MantineProvider>
      <AuthProvider>
        <NoteProvider>{children}</NoteProvider>
      </AuthProvider>
    </MantineProvider>
  );
};
