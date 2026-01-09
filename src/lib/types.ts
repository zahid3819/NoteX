export type User = {
  id: string;
  name: string;
  email: string;
};

export type Note = {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  isFavorite: boolean;
  isArchived: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type PaginatedNotes = {
  items: Note[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
