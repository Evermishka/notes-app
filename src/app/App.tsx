import { Router } from './router';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

export function App() {
  return (
    <MantineProvider>
      <Router />
    </MantineProvider>
  );
}
