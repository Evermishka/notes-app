import { Router } from './router';
import { AuthProvider, NotesProvider } from '@/features';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

export const App = () => {
  return (
    <MantineProvider>
      <AuthProvider>
        <NotesProvider>
          <Router />
        </NotesProvider>
      </AuthProvider>
    </MantineProvider>
  );
};
