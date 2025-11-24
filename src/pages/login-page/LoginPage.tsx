import { Container, Center, AppShell } from '@mantine/core';
import { Header } from '@/widgets/header';
import { LoginForm } from '@/features/auth';
import { SIZES } from '@/shared/config';

export const LoginPage = () => {
  return (
    <AppShell padding="md" header={{ height: SIZES.headerHeight }}>
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Main>
        {' '}
        <Center
          component="main"
          style={{
            flex: 1,
            width: '100%',
            padding: 'var(--mantine-spacing-md)',
          }}
        >
          <Container w="100%">
            <LoginForm />
          </Container>
        </Center>
      </AppShell.Main>
    </AppShell>
  );
};
