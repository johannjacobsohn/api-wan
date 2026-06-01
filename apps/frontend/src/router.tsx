import {
  createRootRoute,
  createRoute,
  createRouter,
  Link,
  Outlet,
  useParams,
  useSearch,
  useNavigate,
} from "@tanstack/react-router";
import { ResourceNav } from "./components/ResourceNav";
import { GiEnergySword } from "react-icons/gi";
import { ThemeToggle } from "./components/ThemeToggle";
import { ResourceList } from "./components/ResourceList";
import { ResourceDetail } from "./components/ResourceDetail";
import { NotFound } from "./components/NotFound";
import { APP_NAME } from "./constants";
import type { ResourceType } from "./api/types";

const RESOURCE_TYPES = new Set<ResourceType>([
  "people",
  "films",
  "planets",
  "species",
  "vehicles",
  "starships",
]);

function RootLayout() {
  return (
    <>
      <header>
        <div className="header-bar">
          <Link to="/" className="app-name">
            <span className="rainbow-icon">
              <GiEnergySword />
            </span>
            <span className="app-name-text">{APP_NAME}</span>
          </Link>
          <ThemeToggle />
        </div>
        <ResourceNav />
      </header>
      <main className="container">
        <Outlet />
      </main>
    </>
  );
}

function NotFoundFallback() {
  return <NotFound />;
}

function IndexPage() {
  return (
    <article>
      <h2>Welcome to {APP_NAME}</h2>
      <p>Select a resource type above to browse Star Wars data.</p>
    </article>
  );
}

function ResourceListPage() {
  const { resource } = useParams({ from: resourceListRoute.id });
  const navigate = useNavigate();
  const search = useSearch({ from: resourceListRoute.id });

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
          from: resourceListRoute.id,
          params: { resource },
          search: { ...search, page },
          replace: true,
        })
      }
      onSearchChange={(searchQuery) =>
        navigate({
          from: resourceListRoute.id,
          params: { resource },
          search: { page: 1, search: searchQuery },
          replace: true,
        })
      }
    />
  );
}

function ResourceDetailPage() {
  const { resource, id } = useParams({ from: resourceDetailRoute.id });

  if (!RESOURCE_TYPES.has(resource as ResourceType)) {
    return <NotFound />;
  }

  return <ResourceDetail resource={resource as ResourceType} id={id} />;
}

const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundFallback,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: IndexPage,
});

const resourceListRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "$resource",
  validateSearch: (search: Record<string, unknown>) => ({
    page: Number(search.page ?? 1),
    search: String(search.search ?? ""),
  }),
  component: ResourceListPage,
});

const resourceDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "$resource/$id",
  component: ResourceDetailPage,
});

const routeTree = rootRoute.addChildren([indexRoute, resourceListRoute, resourceDetailRoute]);

export const router = createRouter({ routeTree, defaultNotFoundComponent: NotFound });
