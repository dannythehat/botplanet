/* ============================================================
   Screenshot a page, at a phone and at a desktop, optionally
   scrolled to one element.

     node scripts/shot.mjs <url> <outPrefix> [selector] [count]

   e.g.  node scripts/shot.mjs http://127.0.0.1:8183/preview/review/ \
           /tmp/rev ".bp-buy__cta"

   WHY THIS IS A FILE AND NOT A ONE-LINER EACH TIME. Every visual
   change on this site gets looked at before it is called done, and
   the sequence — launch Chromium at the right path, emulate a real
   phone, wait for webfonts, scroll the thing into view, shoot both
   breakpoints — is the same every time. Rewriting it per session
   is how the device profile quietly drifts and two screenshots
   stop being comparable.

   The viewport is 390x844 at DPR 3 (the profile scroll-profile.mjs
   uses, so a screenshot and a trace describe the same page) and
   1440x900 at DPR 2 for desktop.

   Chromium is pre-installed at /opt/pw-browsers/chromium. Do not
   run `playwright install`.
   ============================================================ */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

const [url, prefix, selector, countArg] = process.argv.slice(2);

if (!url || !prefix) {
  console.error("usage: node scripts/shot.mjs <url> <outPrefix> [selector] [count]");
  process.exit(1);
}

/** How many screens to walk down, when no selector is given. */
const count = Number(countArg ?? (selector ? 1 : 3));

mkdirSync(dirname(prefix), { recursive: true });

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const written = [];

for (const [width, height, dpr, tag] of [
  [390, 844, 3, "m"],
  [1440, 900, 2, "d"],
]) {
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: dpr,
    isMobile: tag === "m",
    hasTouch: tag === "m",
  });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "load", timeout: 60_000 });

  /* Webfonts land after load and reflow every heading on the page. Shooting
     before they arrive gives a screenshot of the fallback face, which looks
     like a bug that is not there. */
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForTimeout(600);

  if (selector) {
    const el = await page.$(selector);
    if (!el) {
      console.error(`  ${tag}: no element matches ${selector} — shooting the top of the page`);
    } else {
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(450);
    }
  }

  for (let i = 0; i < count; i++) {
    const path = `${prefix}-${tag}${count > 1 ? i + 1 : ""}.png`;
    await page.screenshot({ path });
    written.push(path);
    if (i + 1 < count) {
      await page.evaluate((vh) => window.scrollBy(0, vh * 0.92), height);
      await page.waitForTimeout(450);
    }
  }

  await ctx.close();
}

await browser.close();
console.log(written.join("\n"));
