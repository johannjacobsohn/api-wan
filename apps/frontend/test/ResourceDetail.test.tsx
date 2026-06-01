import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import { ResourceDetail } from "../src/components/ResourceDetail";

vi.mock("@tanstack/react-router", async () => {
  const actual = await vi.importActual("@tanstack/react-router");
  return {
    ...actual,
    Link: ({
      children,
      to,
      params,
    }: {
      children: React.ReactNode;
      to: string;
      params?: Record<string, string>;
    }) => (
      <a href={to} data-params={JSON.stringify(params)}>
        {children}
      </a>
    ),
  };
});

describe("ResourceDetail", () => {
  it("renders loading state initially", () => {
    renderWithProviders(<ResourceDetail resource="people" id="1" />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders person detail after fetch", async () => {
    renderWithProviders(<ResourceDetail resource="people" id="1" />);

    await waitFor(() => {
      expect(screen.getAllByText("Luke Skywalker").length).toBeGreaterThanOrEqual(1);
    });

    expect(screen.getByText("Height")).toBeInTheDocument();
    expect(screen.getByText("172")).toBeInTheDocument();
    expect(screen.getByText("Mass")).toBeInTheDocument();
    expect(screen.getByText("77")).toBeInTheDocument();
  });

  it("renders link fields with labels", async () => {
    renderWithProviders(<ResourceDetail resource="people" id="1" />);

    await waitFor(() => {
      expect(screen.getByText("Homeworld")).toBeInTheDocument();
    });

    expect(screen.getByText("Films")).toBeInTheDocument();
    expect(screen.getByText("Starships")).toBeInTheDocument();
  });

  it("renders film detail after fetch", async () => {
    renderWithProviders(<ResourceDetail resource="films" id="1" />);

    await waitFor(() => {
      expect(screen.getAllByText("A New Hope").length).toBeGreaterThanOrEqual(1);
    });

    expect(screen.getByText("Director")).toBeInTheDocument();
    expect(screen.getByText("George Lucas")).toBeInTheDocument();
  });

  it("renders back link", async () => {
    renderWithProviders(<ResourceDetail resource="people" id="1" />);

    await waitFor(() => {
      expect(screen.getAllByText("Luke Skywalker").length).toBeGreaterThanOrEqual(1);
    });

    const backLink = screen.getByText("← Back to People");
    expect(backLink).toBeInTheDocument();
    expect(backLink.closest("a")).toHaveAttribute("href", "/$resource");
  });

  it("renders error state on network failure", async () => {
    renderWithProviders(<ResourceDetail resource="people" id="999" />);

    await waitFor(() => {
      expect(screen.getByText("Error")).toBeInTheDocument();
    });
  });
});
