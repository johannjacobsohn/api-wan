import { useParams } from "@tanstack/react-router";
import { ResourceDetail } from "../components/ResourceDetail";
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

export function ResourceDetailPage() {
  const { resource, id } = useParams({ from: "/$resource/$id" });

  if (!RESOURCE_TYPES.has(resource as ResourceType)) {
    return <NotFound />;
  }

  return <ResourceDetail resource={resource as ResourceType} id={id} />;
}
