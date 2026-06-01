import { describe, it, expect } from "vitest";
import { fetchList, fetchDetail, fetchUrl, SwapiError } from "../src/api/client";

describe("SWAPI client", () => {
  describe("fetchList", () => {
    it("fetches people list (page 1)", async () => {
      const result = await fetchList("people", { page: 1 });
      expect(result.count).toBeGreaterThan(0);
      expect(result.results.length).toBeGreaterThan(0);
      expect(result.results[0]).toHaveProperty("name");
    });

    it("supports pagination", async () => {
      const result = await fetchList("people", { page: 2 });
      expect(result).toBeDefined();
    });

    it("supports search", async () => {
      const result = await fetchList("people", { search: "Luke" });
      expect(result.results.length).toBeGreaterThan(0);
      expect(result.results[0]!.name).toContain("Luke");
    });

    it("returns empty results for unmatched search", async () => {
      const result = await fetchList("people", { search: "nonexistent" });
      expect(result.count).toBe(0);
      expect(result.results).toHaveLength(0);
    });

    it("fetches films list", async () => {
      const result = await fetchList("films");
      expect(result.count).toBeGreaterThan(0);
      expect(result.results[0]).toHaveProperty("title");
    });
  });

  describe("fetchDetail", () => {
    it("fetches a person by ID", async () => {
      const result = await fetchDetail("people", 1);
      expect(result).toHaveProperty("name");
      expect(result).toHaveProperty("url");
    });

    it("fetches a film by ID", async () => {
      const result = await fetchDetail("films", 1);
      expect(result).toHaveProperty("title");
    });
  });

  describe("fetchUrl", () => {
    it("fetches a resource by full URL", async () => {
      const result = await fetchUrl("https://swapi.dev/api/planets/1/");
      expect(result).toHaveProperty("name");
      expect(result).toHaveProperty("climate");
    });
  });

  describe("error handling", () => {
    it("throws SwapiError on 404", async () => {
      await expect(fetchUrl("https://swapi.dev/api/nonexistent/")).rejects.toThrow(
        SwapiError,
      );
    });

    it("throws SwapiError on 500", async () => {
      await expect(fetchUrl("https://swapi.dev/api/error/")).rejects.toThrow(
        SwapiError,
      );
    });
  });
});
