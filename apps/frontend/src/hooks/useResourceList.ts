import { useQuery } from "@tanstack/react-query";
import { fetchList } from "../api/client";
import { queryKeys } from "./queryKeys";
import type { ResourceType, SwapiResource } from "../api/types";

export function useResourceList<T extends SwapiResource>(
  resource: ResourceType,
  page: number,
  search: string,
) {
  return useQuery({
    queryKey: queryKeys.resourceList(resource, page, search),
    queryFn: () => fetchList<T>(resource, { page, search }),
  });
}
