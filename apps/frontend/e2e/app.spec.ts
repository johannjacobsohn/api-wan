import { test, expect, Page } from "@playwright/test";

const BASE = "https://swapi.info/api";

function makePerson(
  name: string,
  id: number,
  opts?: Partial<{
    height: string;
    mass: string;
    gender: string;
    birth_year: string;
  }>,
) {
  return {
    name,
    height: opts?.height ?? "172",
    mass: opts?.mass ?? "77",
    hair_color: "blond",
    skin_color: "fair",
    eye_color: "blue",
    birth_year: opts?.birth_year ?? "19BBY",
    gender: opts?.gender ?? "male",
    homeworld: `${BASE}/planets/1/`,
    films: [`${BASE}/films/1/`],
    species: [],
    vehicles: [],
    starships: [],
    url: `${BASE}/people/${id}/`,
  };
}

const PEOPLE_LIST = Array.from({ length: 12 }, (_, i) =>
  makePerson(`Person ${i + 1}`, i + 1, {
    height: String(150 + i),
    mass: String(70 + i),
  }),
);

const FILM_DETAIL = {
  title: "A New Hope",
  episode_id: 4,
  opening_crawl: "It is a period of civil war...",
  director: "George Lucas",
  producer: "Gary Kurtz, Rick McCallum",
  release_date: "1977-05-25",
  characters: [`${BASE}/people/1/`],
  planets: [],
  starships: [],
  vehicles: [],
  species: [],
  url: `${BASE}/films/1/`,
};

async function mockSwapi(page: Page) {
  await page.route("**/api/**", async (route) => {
    const url = route.request().url();
    if (url.includes("/people/") && !url.match(/\/people\/\d+\/$/)) {
      await route.fulfill({ json: PEOPLE_LIST });
    } else if (url.includes("/films/1/")) {
      await route.fulfill({ json: FILM_DETAIL });
    } else if (url.includes("/films/")) {
      await route.fulfill({ json: [FILM_DETAIL] });
    } else if (url.includes("/planets/")) {
      await route.fulfill({
        json: [
          {
            name: "Tatooine",
            climate: "arid",
            terrain: "desert",
            population: "200000",
            residents: [],
            films: [],
            url: `${BASE}/planets/1/`,
          },
        ],
      });
    } else {
      await route.fulfill({ json: [] });
    }
  });
}

test.describe("SWAPI browser app", () => {
  test.beforeEach(async ({ page }) => {
    await mockSwapi(page);
  });

  test("landing page shows resource nav", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /people/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /films/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /planets/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /species/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /vehicles/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /starships/i })).toBeVisible();
  });

  test("navigates to people list and shows data", async ({ page }) => {
    await page.goto("/people");
    await expect(page.getByText("Person 1", { exact: true })).toBeVisible({ timeout: 10000 });
  });

  test("search narrows results", async ({ page }) => {
    await page.goto("/people");
    const search = page.getByPlaceholder("Search...");
    await search.fill("Person 1");
    await expect(page.getByText("Person 1", { exact: true })).toBeVisible({ timeout: 10000 });
  });

  test("pagination shows next page", async ({ page }) => {
    await page.goto("/people");
    await expect(page.getByText("12 results")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Page 1 of 2")).toBeVisible();
    await page.getByRole("button", { name: /next/i }).click();
    await expect(page.getByText("Person 11")).toBeVisible();
    await expect(page.getByText("Page 2 of 2")).toBeVisible();
    await page.getByRole("button", { name: /previous/i }).click();
    await expect(page.getByText("Page 1 of 2")).toBeVisible();
  });

  test("error state renders on 500", async ({ page }) => {
    await page.route("**/api/**", async (route) => {
      await route.fulfill({ status: 500 });
    });
    await page.goto("/people");
    await expect(page.getByText("Error")).toBeVisible({ timeout: 10000 });
  });

  test("detail page shows film info and back link", async ({ page }) => {
    await page.goto("/films/1");
    await expect(page.getByRole("heading", { name: "A New Hope" })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("link", { name: /back to films/i })).toBeVisible();
  });

  test("404 page renders for unknown resource", async ({ page }) => {
    await page.goto("/unknown");
    await expect(page.getByText("Not Found")).toBeVisible();
  });

  test("theme toggle exists on landing page", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: /theme/i });
    await expect(toggle).toBeVisible();
  });
});
