import { test, expect, Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const BASE = "https://swapi.info/api";

const PEOPLE_LIST = [
  {
    name: "Luke Skywalker",
    height: "172",
    mass: "77",
    hair_color: "blond",
    skin_color: "fair",
    eye_color: "blue",
    birth_year: "19BBY",
    gender: "male",
    homeworld: `${BASE}/planets/1/`,
    films: [`${BASE}/films/1/`],
    species: [],
    vehicles: [],
    starships: [],
    url: `${BASE}/people/1/`,
  },
];

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

test.describe("Accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await mockSwapi(page);
  });

  test("landing page has no critical a11y violations", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /people/i })).toBeVisible();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test("list page has no critical a11y violations", async ({ page }) => {
    await page.goto("/people");
    await expect(page.getByText("Luke Skywalker")).toBeVisible({ timeout: 10000 });
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test("detail page has no critical a11y violations", async ({ page }) => {
    await page.goto("/films/1");
    await expect(page.getByText("A New Hope")).toBeVisible({ timeout: 10000 });
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
