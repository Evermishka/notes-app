import { Container, Title, Text, Box } from '@mantine/core';

export const LoginPage = () => {
  return (
    <Container size="sm" py={40}>
      <Box ta="center">
        <Title order={1}>Вход в систему</Title>
        <Text c="dimmed" mt="md">
          Компонент LoginPage — здесь будет форма авторизации
        </Text>
      </Box>
    </Container>
  );
};
