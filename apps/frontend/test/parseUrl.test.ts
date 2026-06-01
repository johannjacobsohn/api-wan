import { describe, it, expect } from "vitest";
import { parseUrl } from "../src/api/parseUrl";

describe("parseUrl", () => {
  it("extracts resource and id from a SWAPI URL", () => {
    const result = parseUrl("https://swapi.dev/api/people/1/");
    expect(result).toEqual({ resource: "people", id: "1" });
  });

  it("handles URL without trailing slash", () => {
    const result = parseUrl("https://swapi.dev/api/planets/5");
    expect(result).toEqual({ resource: "planets", id: "5" });
  });

  it("returns null for non-SWAPI URLs", () => {
    expect(parseUrl("https://example.com/foo")).toBeNull();
  });

  it("returns null for invalid paths", () => {
    expect(parseUrl("not-a-url")).toBeNull();
  });

  it("parses films resource correctly", () => {
    const result = parseUrl("https://swapi.dev/api/films/1/");
    expect(result).toEqual({ resource: "films", id: "1" });
  });
});
