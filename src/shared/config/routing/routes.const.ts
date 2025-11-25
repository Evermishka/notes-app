export const ROUTES = {
  LOGIN: '/login',
  MAIN: '/',
  NOT_FOUND: '/not_found-page',
} as const;

export type RouteKey = keyof typeof ROUTES;
