import { useNavigate } from 'react-router-dom';
import { Container, Title, Box, Button, Group } from '@mantine/core';
import { ROUTES } from '@/shared/config';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Container size="sm" py={40}>
      <Box ta="center">
        <Title order={1} c="danger">
          404 — Страница не найдена
        </Title>
        <Group justify="center" mt={30}>
          <Button onClick={() => navigate(ROUTES.MAIN)}>На главную</Button>
        </Group>
      </Box>
    </Container>
  );
};
