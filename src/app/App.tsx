import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

export function App() {
  return (
    <MantineProvider>
      <h1>Hello World</h1>
    </MantineProvider>
  );
}