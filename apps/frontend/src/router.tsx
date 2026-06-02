import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import { RootLayout, NotFoundFallback } from "./routes/RootLayout";
import { IndexPage } from "./routes/IndexPage";
import { ResourceListPage } from "./routes/ResourceListPage";
import { ResourceDetailPage } from "./routes/ResourceDetailPage";
import { NotFound } from "./components/NotFound";

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
    page: Math.max(1, Math.floor(Number(search.page ?? 1)) || 1),
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
