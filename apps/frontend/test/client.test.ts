import { describe, it, expect } from "vitest";
import { fetchList, fetchDetail, fetchUrl, SwapiError } from "../src/api/client";
import type { Person, Film, Planet } from "../src/api/types";

describe("SWAPI client", () => {
  describe("fetchList", () => {
    it("fetches people list (page 1)", async () => {
      const result = await fetchList<Person>("people", { page: 1 });
      expect(result.count).toBeGreaterThan(0);
      expect(result.results.length).toBeGreaterThan(0);
      expect(result.results[0]?.name).toBeDefined();
    });

    it("supports pagination", async () => {
      const result = await fetchList("people", { page: 2 });
      expect(result).toBeDefined();
    });

    it("supports search", async () => {
      const result = await fetchList<Person>("people", { search: "Luke" });
      expect(result.results.length).toBeGreaterThan(0);
      expect(result.results[0]?.name).toContain("Luke");
    });

    it("returns empty results for unmatched search", async () => {
      const result = await fetchList("people", { search: "nonexistent" });
      expect(result.count).toBe(0);
      expect(result.results).toHaveLength(0);
    });

    it("fetches films list", async () => {
      const result = await fetchList<Film>("films");
      expect(result.count).toBeGreaterThan(0);
      expect(result.results[0]?.title).toBeDefined();
    });
  });

  describe("fetchDetail", () => {
    it("fetches a person by ID", async () => {
      const result = await fetchDetail<Person>("people", 1);
      expect(result.name).toBeDefined();
      expect(result.url).toBeDefined();
    });

    it("fetches a film by ID", async () => {
      const result = await fetchDetail<Film>("films", 1);
      expect(result.title).toBeDefined();
    });
  });

  describe("fetchUrl", () => {
    it("fetches a resource by full URL", async () => {
      const result = await fetchUrl<Planet>("https://swapi.info/api/planets/1/");
      expect(result.name).toBeDefined();
      expect(result.climate).toBeDefined();
    });
  });

  describe("error handling", () => {
    it("throws SwapiError on 404", async () => {
      await expect(fetchUrl("https://swapi.info/api/nonexistent/")).rejects.toThrow(SwapiError);
    });

    it("throws SwapiError on 500", async () => {
      await expect(fetchUrl("https://swapi.info/api/error/")).rejects.toThrow(SwapiError);
    });
  });
});
