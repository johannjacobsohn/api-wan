import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import { ResourceList } from "../src/components/ResourceList";

vi.mock("@tanstack/react-router", async () => {
  const actual = await vi.importActual("@tanstack/react-router");
  return {
    ...actual,
    Link: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

const mockNavigate = () => {};

describe("ResourceList", () => {
  it("renders loading state initially", () => {
    renderWithProviders(
      <ResourceList
        resource="people"
        page={1}
        searchQuery=""
        onPageChange={mockNavigate}
        onSearchChange={mockNavigate}
      />,
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders character names after fetch", async () => {
    renderWithProviders(
      <ResourceList
        resource="people"
        page={1}
        searchQuery=""
        onPageChange={mockNavigate}
        onSearchChange={mockNavigate}
      />,
    );

    const items = await screen.findAllByText("Luke Skywalker");
    expect(items.length).toBeGreaterThanOrEqual(1);
  });

  it("renders result count", async () => {
    renderWithProviders(
      <ResourceList
        resource="people"
        page={1}
        searchQuery=""
        onPageChange={mockNavigate}
        onSearchChange={mockNavigate}
      />,
    );

    const items = await screen.findAllByText(/2 results/);
    expect(items.length).toBeGreaterThanOrEqual(1);
  });

  it("renders search input", async () => {
    renderWithProviders(
      <ResourceList
        resource="people"
        page={1}
        searchQuery=""
        onPageChange={mockNavigate}
        onSearchChange={mockNavigate}
      />,
    );

    const items = await screen.findAllByPlaceholderText("Search...");
    expect(items.length).toBeGreaterThanOrEqual(1);
  });
});
