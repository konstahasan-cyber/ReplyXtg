// End-to-end flows: planner (mouse + keyboard, back/edit, validation) and two-stage consultation form.
// Usage: BASE=http://localhost:3000 node scripts/qa/flows.mjs
import { chromium } from "playwright";

const BASE = process.env.BASE || "http://localhost:3000";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
const ok = (cond, msg) => {
  console.log(`${cond ? "✓" : "✗"} ${msg}`);
  if (!cond) process.exitCode = 1;
};
const events = () => page.evaluate(() => (window.__agEvents || []).map((e) => e.event));

// ── Planner ──────────────────────────────────────────────
await page.goto(`${BASE}/planner`, { waitUntil: "networkidle" });
ok(await page.getByRole("heading", { name: "What are you planning?" }).isVisible(), "planner step 1 visible");

// Continue without choosing → validation error
await page.getByRole("button", { name: "Continue" }).click();
ok(await page.getByText("Please choose an option to continue.").isVisible(), "step validation error shown");

// Mouse: click an option → auto-advance
await page.getByText("Build a custom home").click();
await page.getByRole("heading", { name: "Do you already own land?" }).waitFor();
ok(true, "pointer selection auto-advances to step 2");

// Keyboard: focus the radio group, arrow to change, Enter to continue
await page.locator('input[name="landStatus"]').first().focus();
await page.keyboard.press("Space");
await page.keyboard.press("ArrowDown");
await page.keyboard.press("Enter");
await page.getByRole("heading", { name: "What size home do you have in mind?" }).waitFor();
ok(true, "keyboard selection + Enter advances to step 3");

// Back button keeps answers
await page.getByRole("button", { name: "← Back" }).click();
ok(await page.locator('input[name="landStatus"][value="no"]').isChecked(), "back preserves previous answer (No)");
await page.getByRole("button", { name: "Continue" }).click();

await page.getByText("3,000–4,500 sq ft").click();
await page.getByRole("heading", { name: /architectural style/ }).waitFor();
await page.getByText("California Modern").click();
await page.getByRole("heading", { name: /planning budget/ }).waitFor();
ok(await page.getByText(/not a quote or a promise/).isVisible(), "budget disclaimer visible");
await page.getByText("$750,000–$1.25M").click();
await page.getByRole("heading", { name: /When would you like to begin/ }).waitFor();
await page.getByText("6–12 months").click();
await page.getByRole("heading", { name: /Where should we send/ }).waitFor();
ok(true, "reached contact step");
ok((await events()).includes("planner_start"), "event planner_start");

// Persistence across reload
await page.reload({ waitUntil: "networkidle" });
ok(await page.getByRole("heading", { name: /Where should we send/ }).isVisible(), "progress restored after reload");

// Edit an earlier answer from the review, then return to contact
await page.getByRole("button", { name: "Edit Land" }).click();
await page.getByText("In the process of buying").click();
await page.getByRole("heading", { name: /Where should we send/ }).waitFor();
ok(await page.getByText("In the process of buying").first().isVisible(), "edited answer returns straight to contact step");

// Submit empty → client validation errors
await page.getByRole("button", { name: "See My Project Summary" }).click();
ok(await page.getByText("Please enter your name.").isVisible(), "name required error");
ok(await page.getByText(/valid email address/).isVisible(), "email error");
ok(await page.getByText("Please enter a 5-digit ZIP code.").isVisible(), "zip error");
ok(await page.getByText(/confirm you agree/).isVisible(), "consent error");

await page.getByRole("textbox", { name: "Name" }).fill("Jordan Avery");
await page.getByRole("textbox", { name: "Email" }).fill("jordan@example.com");
await page.getByLabel("ZIP code").fill("10001");
ok(await page.getByText(/outside our usual service region/).isVisible(), "out-of-area ZIP hint");
await page.getByLabel("ZIP code").fill("95630");
await page.getByText("Phone call").click();
await page.getByLabel(/I agree to be contacted/).check();
await page.waitForTimeout(2600); // honour the anti-bot time trap
await page.getByRole("button", { name: "See My Project Summary" }).click();
await page.getByText("Demo submission saved locally").waitFor();
ok(await page.getByRole("heading", { name: /Thank you, Jordan/ }).isVisible(), "personalised confirmation");
ok(await page.getByText("California Modern").first().isVisible(), "confirmation shows style");
await page.getByRole("button", { name: "View My Project Summary" }).click();
ok(await page.getByRole("dialog").isVisible(), "summary dialog opens");
await page.keyboard.press("Escape");
ok(!(await page.getByRole("dialog").isVisible()), "summary dialog closes with Esc");
const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("ag_demo_leads") || "[]").length);
ok(saved >= 1, `demo lead saved locally (${saved})`);
const ev = await events();
for (const e of ["page_view", "planner_step_complete", "planner_error", "planner_submit"]) ok(ev.includes(e), `event ${e}`);

// ── Consultation form ────────────────────────────────────
await page.goto(`${BASE}/contact`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Request a Consultation" }).click();
ok(await page.getByText(/at least 10 characters/).isVisible(), "message validation");
await page.getByRole("textbox", { name: "Name" }).fill("Sam Rivera");
await page.getByRole("textbox", { name: "Email" }).fill("sam@example.com");
await page.getByLabel(/What are you imagining/).fill("We have a lot in Elk Grove and want a modern farmhouse.");
await page.getByLabel(/I agree to be contacted/).check();
await page.waitForTimeout(2600);
await page.getByRole("button", { name: "Request a Consultation" }).click();
await page.getByRole("heading", { name: /your message is in/ }).waitFor();
ok(true, "stage 2 (optional qualification) shown after capture");
await page.getByText("Yes", { exact: true }).click();
await page.getByText("Within 6 months").click();
await page.getByRole("button", { name: "Add These Details" }).click();
await page.getByRole("heading", { name: /You're all set/ }).waitFor();
ok(true, "qualification submitted");
const ev2 = await events();
for (const e of ["consultation_form_start", "consultation_form_submit", "qualification_submit"]) ok(ev2.includes(e), `event ${e}`);

// ── Home teaser → planner prefill, FAQ, process tabs ────
await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
await page.evaluate(() => sessionStorage.clear());
await page.getByRole("button", { name: /Rebuild an existing home/ }).click();
await page.getByRole("heading", { name: "Do you already own land?" }).waitFor();
ok(true, "teaser answer opens planner at step 2");
await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
const faq = page.getByRole("button", { name: /Do I need to own land/ });
await faq.click();
ok((await faq.getAttribute("aria-expanded")) === "true", "FAQ accordion expands");
const tab = page.getByRole("tab", { name: /Design Development/ });
await tab.click();
ok((await tab.getAttribute("aria-selected")) === "true", "process tab selects");
await page.keyboard.press("ArrowRight");
ok((await page.getByRole("tab", { name: /Permits/ }).getAttribute("aria-selected")) === "true", "process tabs arrow-key navigation");

// ── Mobile menu ─────────────────────────────────────────
await page.setViewportSize({ width: 375, height: 800 });
await page.getByRole("button", { name: "Open menu" }).click();
ok(await page.locator("#mobile-menu").isVisible(), "mobile menu opens");
await page.keyboard.press("Escape");
ok(!(await page.locator("#mobile-menu").isVisible()), "mobile menu closes with Esc");

ok(errors.length === 0, `no page errors ${errors.join(" | ")}`);
await browser.close();
