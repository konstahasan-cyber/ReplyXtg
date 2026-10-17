// Playwright smoke test: every route × 4 viewports.
// Checks HTTP status, console errors, horizontal overflow, broken images, single <h1>.
// Usage: BASE=http://localhost:3000 node scripts/qa/smoke.mjs [--shots dir]
import { chromium } from "playwright";

const BASE = process.env.BASE || "http://localhost:3000";
const shotsIdx = process.argv.indexOf("--shots");
const SHOTS = shotsIdx > -1 ? process.argv[shotsIdx + 1] : null;
const routes = [
  "/", "/about", "/custom-home-building", "/design-build", "/home-designs",
  "/home-designs/riverstone-residence", "/home-designs/sierra-retreat", "/home-designs/oak-meadow-house",
  "/process", "/service-areas", "/service-areas/sacramento", "/service-areas/folsom", "/service-areas/elk-grove",
  "/contact", "/planner", "/privacy", "/terms",
];
const widths = [375, 768, 1024, 1440];

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
let failures = 0;
for (const width of widths) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  for (const route of routes) {
    const errors = [];
    page.removeAllListeners("console");
    page.removeAllListeners("pageerror");
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(String(e)));
    const res = await page.goto(BASE + route, { waitUntil: "networkidle" });
    // Scroll through so lazy images load.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
      window.scrollTo(0, 0);
    });
    await page.waitForLoadState("networkidle");
    const info = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      broken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && !i.src.startsWith("data:")).map((i) => i.getAttribute("src")),
      h1: document.querySelectorAll("h1").length,
    }));
    const problems = [];
    if (res.status() !== 200) problems.push(`status ${res.status()}`);
    if (info.overflow > 0) problems.push(`h-overflow ${info.overflow}px`);
    if (info.broken.length) problems.push(`broken images: ${[...new Set(info.broken)].slice(0, 3).join(", ")}`);
    if (info.h1 !== 1) problems.push(`${info.h1} h1 elements`);
    if (errors.length) problems.push(`console: ${errors.slice(0, 2).join(" | ").slice(0, 200)}`);
    if (problems.length) failures++;
    console.log(`${problems.length ? "✗" : "✓"} ${width}px ${route}${problems.length ? "  → " + problems.join("; ") : ""}`);
    if (SHOTS) await page.screenshot({ path: `${SHOTS}/${width}${route.replace(/\//g, "_") || "_home"}.png`, fullPage: true });
  }
  await ctx.close();
}
await browser.close();
console.log(failures ? `\n${failures} page/viewport combinations with problems` : "\nAll checks passed");
process.exit(failures ? 1 : 0);
