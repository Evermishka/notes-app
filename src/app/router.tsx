import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ProtectedRoute } from './ui';
import { ROUTES } from '@/shared/config';

// Lazy loading страниц для code splitting
const LoginPage = lazy(() => import('@/pages').then((module) => ({ default: module.LoginPage })));
const MainPage = lazy(() => import('@/pages').then((module) => ({ default: module.MainPage })));
const NotFoundPage = lazy(() =>
  import('@/pages').then((module) => ({ default: module.NotFoundPage }))
);

const LoadingFallback = () => <div>Загрузка...</div>;

export const Router = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
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
      </Suspense>
    </BrowserRouter>
  );
};
