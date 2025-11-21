import { Container, Center, Box } from '@mantine/core';
import { Header } from '@/widgets/header';
import { LoginForm } from '@/features/auth'; // Предполагаем, что LoginForm уже есть

export const LoginPage = () => {
  return (
    <Box
      component="div"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'var(--mantine-color-gray-0)',
      }}
    >
      {/* Header на всю ширину вверху */}
      <Header />

      {/* Основной контент — центрирован */}
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
    </Box>
  );
};
