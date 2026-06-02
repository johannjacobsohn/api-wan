import { useParams, useSearch, useNavigate } from "@tanstack/react-router";
import { ResourceList } from "../components/ResourceList";
import { NotFound } from "../components/NotFound";
import type { ResourceType } from "../api/types";

const RESOURCE_TYPES = new Set<ResourceType>([
  "people",
  "films",
  "planets",
  "species",
  "vehicles",
  "starships",
]);

export function ResourceListPage() {
  const { resource } = useParams({ from: "/$resource" });
  const navigate = useNavigate();
  const search = useSearch({ from: "/$resource" });

  if (!RESOURCE_TYPES.has(resource as ResourceType)) {
    return <NotFound />;
  }

  return (
    <ResourceList
      resource={resource as ResourceType}
      page={search.page}
      searchQuery={search.search}
      onPageChange={(page) =>
        navigate({
          from: "/$resource",
          params: { resource },
          search: { ...search, page },
          replace: true,
        })
      }
      onSearchChange={(searchQuery) =>
        navigate({
          from: "/$resource",
          params: { resource },
          search: { page: 1, search: searchQuery },
          replace: true,
        })
      }
    />
  );
}
