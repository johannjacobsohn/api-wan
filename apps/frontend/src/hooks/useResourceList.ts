import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAll, PAGE_SIZE } from "../api/client";
import { queryKeys } from "./queryKeys";
import type { ResourceType, SwapiResource, Page } from "../api/types";

export function useResourceList<T extends SwapiResource>(
  resource: ResourceType,
  page: number,
  search: string,
) {
  const query = useQuery({
    queryKey: queryKeys.resourceList(resource),
    queryFn: () => fetchAll<T>(resource),
  });

  const pageData = useMemo<Page<T> | undefined>(() => {
    const data = query.data;
    if (!data) return undefined;

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
  }, [query.data, page, search]);

  return { ...query, data: pageData };
}
