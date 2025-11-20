export type User = {
  id: string;
  email: string;
  username: string; // username (производная от email на этапе auth)
  createdAt: string; // ISO 8601 string (2025-11-20T15:30:00Z)
};
