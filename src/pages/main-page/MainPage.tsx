import { Container, Title, Text, Box } from '@mantine/core';

export const MainPage = () => {
  return (
    <Container size="xl" py={40}>
      <Box>
        <Title order={1}>Главная</Title>
        <Text c="dimmed" mt="md">
          Компонент MainPage — здесь будет работа с заметками (Sidebar + Workspace)
        </Text>
      </Box>
    </Container>
  );
};
