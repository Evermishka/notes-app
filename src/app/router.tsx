import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage, MainPage, NotFoundPage } from '@/pages';
import { ROUTES } from '@/shared';
import { ProtectedRoute } from './ui';

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={ROUTES.MAIN}
          element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          }
        />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
