import React from 'react';
import { Navigate } from 'react-router-dom';
import { Center, Loader } from '@mantine/core';
import { useAuth } from '@/features/auth';
import { ROUTES } from '@/shared/config';
interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute = ({
  children,
  fallback,
  redirectTo = ROUTES.LOGIN,
}: ProtectedRouteProps) => {
  const { state } = useAuth();
  const { isAuthenticated, isLoading, error } = state;

  if (isLoading) {
    return (
      fallback || (
        <Center h="100vh">
          <Loader size="lg" />
        </Center>
      )
    );
  }

  if (error) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};
