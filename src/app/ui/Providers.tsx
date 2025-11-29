import { AuthProvider } from '@/features/auth';
import { NoteProvider } from '@/entities/note';
import { MantineProvider } from '@mantine/core';
import { theme } from '@/shared/config/ui';
import '@mantine/core/styles.css';
import '@/shared/config/ui/global.css';

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <MantineProvider theme={theme}>
      <AuthProvider>
        <NoteProvider>{children}</NoteProvider>
      </AuthProvider>
    </MantineProvider>
  );
};
