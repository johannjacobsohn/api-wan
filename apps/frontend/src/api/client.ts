import type { ResourceType, SwapiResource, Page } from "./types";

const BASE_URL = import.meta.env.VITE_SWAPI_BASE_URL ?? "https://swapi.info/api";

export class SwapiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "SwapiError";
    this.status = status;
  }
}

export const PAGE_SIZE = 10;

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

function normalizePageResponse<T extends SwapiResource>(
  data: T[],
  page: number,
  search: string,
): Page<T> {
  let results = data;
  if (search) {
    const q = search.toLowerCase();
    results = data.filter((item) => {
      const r = item as unknown as Record<string, unknown>;
      const display = r.name ?? r.title ?? "";
      return String(display).toLowerCase().includes(q);
    });
  }
  const start = (page - 1) * PAGE_SIZE;
  return {
    count: results.length,
    results: results.slice(start, start + PAGE_SIZE),
    hasNext: start + PAGE_SIZE < results.length,
    hasPrevious: page > 1,
  };
}

export function fetchAll<T extends SwapiResource>(resource: ResourceType): Promise<T[]> {
  return request<T[]>(`${BASE_URL}/${resource}/`);
}

export function fetchList<T extends SwapiResource>(
  resource: ResourceType,
  { page = 1, search = "" }: { page?: number; search?: string } = {},
): Promise<Page<T>> {
  const url = `${BASE_URL}/${resource}/`;
  return request<T[]>(url).then((data) => normalizePageResponse(data, page, search));
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
