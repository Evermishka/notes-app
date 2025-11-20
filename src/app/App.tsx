import { Router } from './router';
import { AuthProvider } from '@/features';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

export function App() {
  return (
    <MantineProvider>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </MantineProvider>
  );
}
