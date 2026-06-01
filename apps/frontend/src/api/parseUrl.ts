import type { ResourceType } from "./types";

export interface ParsedUrl {
  resource: ResourceType;
  id: string;
}

const SWAPI_URL_PATTERN = /\/(people|films|planets|species|vehicles|starships)\/(\d+)\/?$/;

export function parseUrl(url: string): ParsedUrl | null {
  const match = url.match(SWAPI_URL_PATTERN);
  if (!match) return null;
  return { resource: match[1] as ResourceType, id: match[2] as string };
}
