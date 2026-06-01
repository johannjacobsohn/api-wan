import type { ResourceType, SwapiResource, Page } from "./types";

const BASE_URL = import.meta.env.VITE_SWAPI_BASE_URL ?? "https://swapi.dev/api";

export class SwapiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "SwapiError";
    this.status = status;
  }
}

async function request<T>(url: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url);
  } catch {
    throw new SwapiError("Network failure");
  }
  if (!res.ok) {
    throw new SwapiError(`HTTP ${res.status}: ${res.statusText}`, res.status);
  }
  return res.json() as Promise<T>;
}

export function fetchList<T extends SwapiResource>(
  resource: ResourceType,
  { page = 1, search = "" }: { page?: number; search?: string } = {},
): Promise<Page<T>> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  if (search) params.set("search", search);
  return request<Page<T>>(`${BASE_URL}/${resource}/?${params.toString()}`);
}

export function fetchDetail<T extends SwapiResource>(
  resource: ResourceType,
  id: string | number,
): Promise<T> {
  return request<T>(`${BASE_URL}/${resource}/${id}/`);
}

export function fetchUrl<T extends SwapiResource>(url: string): Promise<T> {
  return request<T>(url);
}
