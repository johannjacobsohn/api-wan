import { describe, it, expect } from "vitest";
import { fetchList, fetchDetail, fetchUrl } from "../../src/api/client";
import { parseUrl } from "../../src/api/parseUrl";
import type { Person, Film } from "../../src/api/types";

const RESOURCES = ["people", "films", "planets", "species", "vehicles", "starships"] as const;

describe("SWAPI live smoke tests", () => {
  for (const resource of RESOURCES) {
    it(`fetches ${resource} list`, async () => {
      const result = await fetchList(resource);
      expect(result.count).toBeGreaterThan(0);
      expect(result.results.length).toBeGreaterThan(0);
    });
  }

  it("fetches a person detail and resolves a related link", async () => {
    const person = await fetchDetail<Person>("people", 1);
    expect(person.name).toBeDefined();
    expect(person.homeworld).toBeDefined();

    if (person.homeworld) {
      const planet = await fetchUrl(person.homeworld);
      expect(planet).toHaveProperty("name");
    }
  });

  it("fetches a film and checks title field", async () => {
    const film = await fetchDetail<Film>("films", 1);
    expect(film.title).toBeDefined();
    expect(typeof film.title).toBe("string");
  });

  it("parses SWAPI URLs correctly", () => {
    const result = parseUrl("https://swapi.info/api/people/1/");
    expect(result).toEqual({ resource: "people", id: "1" });
  });
});
