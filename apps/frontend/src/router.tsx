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

const rootRoute = createRootRoute({
  component: () => (
    <>
      <header>
        <nav>
          <ul>
            <li>
              <strong>
                <Link to="/">{APP_NAME}</Link>
              </strong>
            </li>
          </ul>
          <ResourceNav />
          <ul>
            <li>
              <ThemeToggle />
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  ),
  notFoundComponent: () => <NotFound />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <article>
      <h2>Welcome to {APP_NAME}</h2>
      <p>Select a resource type above to browse Star Wars data.</p>
    </article>
  ),
});

const resourceListRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "$resource",
  validateSearch: (search: Record<string, unknown>) => ({
    page: Number(search.page ?? 1),
    search: String(search.search ?? ""),
  }),
  component: () => {
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
  },
});

const resourceDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "$resource/$id",
  component: () => {
    const { resource, id } = useParams({ from: resourceDetailRoute.id });

    if (!RESOURCE_TYPES.has(resource as ResourceType)) {
      return <NotFound />;
    }

    return <ResourceDetail resource={resource as ResourceType} id={id} />;
  },
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  resourceListRoute,
  resourceDetailRoute,
]);

export const router = createRouter({ routeTree, defaultNotFoundComponent: NotFound });
