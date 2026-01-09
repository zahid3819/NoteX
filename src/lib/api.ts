import type { PaginatedNotes, Note, User } from "./types";

type ApiErrorShape = { message?: string; issues?: Array<{ path?: Array<string | number>; message?: string }> };

const toErrorMessage = async (res: Response) => {
  try {
    const data = (await res.json()) as ApiErrorShape;

    if (Array.isArray(data?.issues) && data.issues.length > 0) {
      const first = data.issues[0];
      const path = Array.isArray(first?.path) ? first.path.join('.') : '';
      const msg = first?.message || data?.message;
      return path ? `${path}: ${msg || 'Validation error'}` : msg || 'Validation error';
    }

    return data?.message || "Request failed";
  } catch {
    return "Request failed";
  }
};

const apiFetch = async (path: string, init?: RequestInit) => {
  const res = await fetch(path, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    throw new Error(await toErrorMessage(res));
  }

  return res;
};

export const api = {
  me: async (): Promise<User> => {
    const res = await apiFetch("/api/auth/me");
    const data = (await res.json()) as { user: User };
    return data.user;
  },
  login: async (payload: { email: string; password: string }): Promise<User> => {
    const res = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data = (await res.json()) as { user: User };
    return data.user;
  },
  register: async (payload: { name: string; email: string; password: string }): Promise<User> => {
    const res = await apiFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data = (await res.json()) as { user: User };
    return data.user;
  },
  logout: async (): Promise<void> => {
    await apiFetch("/api/auth/logout", { method: "POST" });
  },
  listNotes: async (params: {
    page?: number;
    limit?: number;
    q?: string;
    tag?: string;
    favorite?: boolean;
    archived?: boolean;
  }): Promise<PaginatedNotes> => {
    const qs = new URLSearchParams();
    if (params.page) qs.set("page", String(params.page));
    if (params.limit) qs.set("limit", String(params.limit));
    if (params.q) qs.set("q", params.q);
    if (params.tag) qs.set("tag", params.tag);
    if (typeof params.favorite === "boolean") qs.set("favorite", String(params.favorite));
    if (typeof params.archived === "boolean") qs.set("archived", String(params.archived));

    const res = await apiFetch(`/api/notes?${qs.toString()}`);
    return (await res.json()) as PaginatedNotes;
  },
  createNote: async (payload: { title: string; content?: string; tags?: string[] }): Promise<Note> => {
    const res = await apiFetch("/api/notes", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data = (await res.json()) as { note: Note };
    return data.note;
  },
  getNote: async (id: string): Promise<Note> => {
    const res = await apiFetch(`/api/notes/${id}`);
    const data = (await res.json()) as { note: Note };
    return data.note;
  },
  updateNote: async (id: string, payload: Partial<Pick<Note, "title" | "content" | "tags" | "isFavorite" | "isArchived">>): Promise<Note> => {
    const res = await apiFetch(`/api/notes/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    const data = (await res.json()) as { note: Note };
    return data.note;
  },
  deleteNote: async (id: string): Promise<void> => {
    await apiFetch(`/api/notes/${id}`, { method: "DELETE" });
  },
};
