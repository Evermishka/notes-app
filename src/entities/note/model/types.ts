export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string; // ISO 8601 string (2025-11-20T15:30:00Z)
  updatedAt: string; // ISO 8601 string (2025-11-20T15:30:00Z)
};

export type CreateNoteDTO = {
  title: string;
  content: string;
};

export type UpdateNoteDTO = {
  title?: string;
  content?: string;
};
