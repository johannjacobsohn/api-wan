import type { ResourceType } from "../api/types";

export const queryKeys = {
  all: ["swapi"] as const,
  resourceList: (resource: ResourceType) => [...queryKeys.all, "list", resource] as const,
  resourceDetail: (resource: ResourceType, id: string | number) =>
    [...queryKeys.all, "detail", resource, String(id)] as const,
  url: (url: string) => [...queryKeys.all, "url", url] as const,
};
