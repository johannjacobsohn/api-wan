import { type ReactElement } from "react";
import { render, type RenderOptions, cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

afterEach(() => {
  cleanup();
});

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  });
}

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  const queryClient = createTestQueryClient();
  function TestWrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }
  return render(ui, { wrapper: TestWrapper, ...options });
}
