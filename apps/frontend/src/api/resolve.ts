import { fetchUrl } from "./client";
import { parseUrl } from "./parseUrl";
import type { ResourceType, SwapiResource } from "./types";

export interface ResolvedLink {
  id: string;
  label: string;
  resource: ResourceType;
  url: string;
}

const DISPLAY_FIELD = new Map<ResourceType, "name" | "title">([
  ["films", "title"],
  ["people", "name"],
  ["planets", "name"],
  ["species", "name"],
  ["vehicles", "name"],
  ["starships", "name"],
]);

export async function resolveUrl(url: string): Promise<ResolvedLink | null> {
  const parsed = parseUrl(url);
  if (!parsed) return null;
  try {
    const obj = await fetchUrl<SwapiResource>(url);
    const displayField = DISPLAY_FIELD.get(parsed.resource) ?? "name";
    const label = (obj as Record<string, string>)[displayField] ?? parsed.id;
    return { ...parsed, label, url };
  } catch {
    return { ...parsed, label: parsed.id, url };
  }
}

export async function resolveUrls(urls: string[]): Promise<(ResolvedLink | null)[]> {
  return Promise.all(urls.map(resolveUrl));
}
