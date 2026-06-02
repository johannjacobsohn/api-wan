import { test, expect } from "@playwright/test";

// Guards against the custom web fonts silently reverting to the system fallback
// — e.g. the Google Fonts `@import` getting dropped/reordered during the build,
// or the heading font-family being unwired. The landing page uses Orbitron
// (headings + logo) and Exo 2 (body) and makes no API calls, so no mocking.
test.describe("Web fonts", () => {
  test("headings are wired to Orbitron and the fonts actually load", async ({ page }) => {
    await page.goto("/");

    // CSS wiring: a heading must resolve to the custom display font, not a fallback.
    const headingFont = await page
      .locator("h2")
      .first()
      .evaluate((el) => getComputedStyle(el).fontFamily);
    expect(headingFont).toContain("Orbitron");

    // Actual loading: the @font-face files must download, not silently fall back.
    // document.fonts.load() resolves once the matching face is fetched (or yields
    // nothing if unavailable), and check() then reports whether it is usable.
    const loaded = await page.evaluate(async () => {
      await Promise.all([
        document.fonts.load('700 1rem "Orbitron"'),
        document.fonts.load('400 1rem "Exo 2"'),
      ]);
      return {
        orbitron: document.fonts.check('700 1rem "Orbitron"'),
        exo2: document.fonts.check('400 1rem "Exo 2"'),
      };
    });

    expect(loaded.orbitron, "Orbitron should be loaded").toBe(true);
    expect(loaded.exo2, "Exo 2 should be loaded").toBe(true);
  });
});
