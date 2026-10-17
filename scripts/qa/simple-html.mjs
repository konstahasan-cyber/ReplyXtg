// Tests the plain-HTML build opened directly from disk (file://), as a user double-clicking index.html would.
import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";

const dir = path.resolve("site");
const url = (f) => "file://" + path.join(dir, f);
const pages = fs.readdirSync(dir).filter((f) => f.endsWith(".html"));
const browser = await chromium.launch();
let fail = 0;
const ok = (c, m) => { console.log(`${c ? "✓" : "✗"} ${m}`); if (!c) fail++; };

for (const width of [375, 768, 1024, 1440]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  for (const f of pages) {
    const errors = [];
    page.removeAllListeners("pageerror"); page.removeAllListeners("console");
    page.on("pageerror", (e) => errors.push(String(e)));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    await page.goto(url(f), { waitUntil: "load" });
    const H = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < H; y += 800) { await page.mouse.wheel(0, 800); await page.waitForTimeout(30); }
    await page.waitForTimeout(200);
    const info = await page.evaluate(() => ({
      bg: getComputedStyle(document.body).backgroundColor,
      font: getComputedStyle(document.querySelector("h1") || document.body).fontFamily,
      overflow: document.documentElement.scrollWidth - innerWidth,
      broken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.getAttribute("src")),
      hidden: [...document.querySelectorAll("[data-reveal]")].filter((e) => e.offsetParent !== null && !e.classList.contains("is-visible")).length,
    }));
    const probs = [];
    if (info.bg !== "rgb(247, 245, 240)") probs.push("styles not applied " + info.bg);
    if (!/Cormorant/.test(info.font)) probs.push("font " + info.font);
    if (info.overflow > 0) probs.push("overflow " + info.overflow);
    if (info.broken.length) probs.push("broken " + info.broken.slice(0, 2));
    if (info.hidden) probs.push(info.hidden + " unrevealed");
    if (errors.length) probs.push("errors " + errors.slice(0, 2).join(" | "));
    ok(!probs.length, `${width}px ${f} ${probs.join("; ")}`);
  }
  await page.close();
}

// Interactions
const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errs = []; p.on("pageerror", (e) => errs.push(String(e)));
await p.goto(url("index.html"));
await p.mouse.wheel(0, 300); await p.waitForTimeout(200);
ok(await p.evaluate(() => document.querySelector(".site-header").classList.contains("is-solid")), "header turns solid on scroll");
const faq = p.getByRole("button", { name: /Do I need to own land/ });
await faq.click(); ok((await faq.getAttribute("aria-expanded")) === "true", "FAQ opens");
await p.getByRole("tab", { name: /Design Development/ }).click();
ok((await p.getByRole("tab", { name: /Design Development/ }).getAttribute("aria-selected")) === "true", "process tab");
await p.keyboard.press("ArrowRight");
ok((await p.getByRole("tab", { name: /Permits/ }).getAttribute("aria-selected")) === "true", "process arrow keys");
await p.getByRole("button", { name: /Rebuild an existing home/ }).click();
await p.getByRole("heading", { name: "Do you already own land?" }).waitFor();
ok(true, "teaser → planner step 2");
await p.evaluate(() => localStorage.clear());

await p.goto(url("planner.html"));
await p.getByRole("button", { name: "Continue" }).click();
ok(await p.getByText("Please choose an option to continue.").isVisible(), "planner step validation");
await p.getByText("Build a custom home").click();
await p.getByRole("heading", { name: "Do you already own land?" }).waitFor();
await p.locator('input[name="landStatus"]').first().focus();
await p.keyboard.press("Space"); await p.keyboard.press("ArrowDown"); await p.keyboard.press("Enter");
await p.getByRole("heading", { name: /What size home/ }).waitFor();
ok(true, "keyboard planner navigation");
for (const [t, h] of [["3,000–4,500 sq ft", /architectural style/], ["California Modern", /planning budget/], ["$750,000–$1.25M", /When would you like/], ["6–12 months", /Where should we send/]]) {
  await p.getByText(t, { exact: true }).click(); await p.getByRole("heading", { name: h }).waitFor();
}
await p.reload(); ok(await p.getByRole("heading", { name: /Where should we send/ }).isVisible(), "planner progress persists after reload");
await p.getByRole("button", { name: "Edit Land" }).click();
await p.getByText("In the process of buying").click();
await p.getByRole("heading", { name: /Where should we send/ }).waitFor(); ok(true, "edit returns to contact");
await p.getByRole("button", { name: "See My Project Summary" }).click();
ok(await p.getByText("Please enter your name.").isVisible(), "contact validation");
await p.getByRole("textbox", { name: "Name" }).fill("Jordan Avery");
await p.getByRole("textbox", { name: "Email" }).fill("jordan@example.com");
await p.getByRole("textbox", { name: "ZIP code" }).fill("95630");
await p.getByLabel(/I agree/).check();
await p.getByRole("button", { name: "See My Project Summary" }).click();
await p.getByText("Demo submission saved locally").waitFor();
ok(await p.getByRole("heading", { name: /Thank you, Jordan/ }).isVisible(), "planner confirmation");
await p.getByRole("button", { name: "View My Project Summary" }).click();
ok(await p.getByRole("dialog").isVisible(), "summary dialog");
await p.keyboard.press("Escape");

await p.goto(url("contact.html"));
await p.getByRole("button", { name: "Request a Consultation" }).click();
ok(await p.getByText(/at least 10 characters/).isVisible(), "contact form validation");
await p.getByRole("textbox", { name: "Name" }).fill("Sam Rivera");
await p.getByRole("textbox", { name: "Email" }).fill("sam@example.com");
await p.getByLabel(/What are you imagining/).fill("We have a lot in Elk Grove and want a modern farmhouse.");
await p.getByLabel(/I agree/).check();
await p.getByRole("button", { name: "Request a Consultation" }).click();
await p.getByRole("heading", { name: /your message is in/ }).waitFor();
await p.getByText("Yes", { exact: true }).click();
await p.getByRole("button", { name: "Add These Details" }).click();
await p.getByRole("heading", { name: /all set/ }).waitFor(); ok(true, "two-stage contact form");

await p.goto(url("sierra-retreat.html"));
await p.getByRole("button", { name: /Open image 2/ }).click();
ok(await p.getByRole("dialog").isVisible(), "gallery lightbox opens");
await p.keyboard.press("ArrowRight"); ok(await p.getByText("3 / 4").isVisible(), "gallery next");
await p.keyboard.press("Escape");

await p.setViewportSize({ width: 375, height: 800 });
await p.goto(url("index.html"));
await p.getByRole("button", { name: "Open menu" }).click();
ok(await p.locator("#mobile-menu").isVisible(), "mobile menu");
await p.getByRole("link", { name: /About/ }).first().click();
await p.waitForURL(/about\.html/); ok(true, "navigation between pages works from disk");
ok(!errs.length, "no JS errors " + errs.join(" | "));
await browser.close();
console.log(fail ? `\n${fail} failures` : "\nAll checks passed");
process.exit(fail ? 1 : 0);
