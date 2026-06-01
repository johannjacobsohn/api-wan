import { useQuery } from "@tanstack/react-query";
import { fetchDetail, fetchUrl } from "../api/client";
import { queryKeys } from "./queryKeys";
import type { ResourceType, SwapiResource } from "../api/types";

export function useResourceDetail<T extends SwapiResource>(
  resource: ResourceType,
  id: string | number,
) {
  return useQuery({
    queryKey: queryKeys.resourceDetail(resource, id),
    queryFn: () => fetchDetail<T>(resource, id),
  });
}

export function useUrl<T extends SwapiResource>(url: string | null) {
  return useQuery({
    queryKey: queryKeys.url(url ?? ""),
    queryFn: () => fetchUrl<T>(url!),
    enabled: !!url,
  });
}
