import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage, MainPage, NotFoundPage } from '@/pages';
import { ROUTES } from '@/shared';

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.MAIN} element={<MainPage />} />
        <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
