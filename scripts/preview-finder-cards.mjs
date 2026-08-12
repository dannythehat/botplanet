/**
 * Render every Bot Finder card with its real button, without a network.
 *
 * WHY IT EXISTS. The button is HTML positioned over a rectangle drawn into the
 * artwork, and the only honest check that the two line up is looking at them.
 * This builds a throwaway page from the local WebP files, screenshots each
 * card at a wide and a narrow width, and prints the button's position as a
 * percentage of the card at both — which is the assertion that matters: if the
 * percentages differ between widths, the button drifts.
 *
 * It reads file:// paths deliberately. The container cannot reach the live
 * site through its proxy, and pointing this at production would make a layout
 * check depend on a deploy.
 *
 *   node scripts/preview-finder-cards.mjs
 */
import { chromium } from "playwright-core";
import { writeFileSync } from "node:fs";

/* Every card, its measured button box, and its label. */
const CARDS = [
  ["universal", "finder-universal.webp", 1122, 1402, "Find my perfect bot",  "91.80%", "54.5%", "6.6%"],
  ["pool",      "finder-pool.webp",      1122, 1402, "Find my pool bot",     "91.51%", "58%",   "6.3%"],
  ["window",    "finder-window.webp",    1122, 1402, "Find my window bot",   "89.48%", "64%",   "7.1%"],
  ["grill",     "finder-grill.webp",     1122, 1402, "Find my grill bot",    "91.65%", "66%",   "7.3%"],
  ["litter",    "finder-litter.webp",    1024, 1536, "Find my litter bot",   "87.56%", "74%",   "8.5%"],
  ["companion", "finder-companion.webp", 1024, 1536, "Find my companion",    "89.58%", "76%",   "6.9%"],
];

const css = `
  body{margin:0;background:#05070d;font-family:system-ui,-apple-system,"Segoe UI",sans-serif}
  .bp-finder{container-type:inline-size;position:relative;display:block;width:100%;margin-inline:auto;border-radius:14px;text-decoration:none}
  .bp-finder__img{display:block;width:100%;height:auto;border-radius:14px}
  .bp-finder__cta{position:absolute;left:50%;top:var(--cy);transform:translate(-50%,-50%);
    width:var(--cw);height:var(--ch);display:flex;align-items:center;justify-content:center;gap:.45em;
    border-radius:5px;background:rgba(3,6,16,.3);color:#fff;font-weight:800;letter-spacing:.09em;
    text-transform:uppercase;white-space:nowrap;font-size:clamp(.6rem,3.05cqw,1.3rem);line-height:1;
    text-shadow:0 1px 10px rgba(0,0,0,.6)}
  .bp-finder__chev{width:1.05em;height:1.05em;flex:none}
`;

const html = (w) => `<!doctype html><meta charset="utf-8"><style>${css}
  .wrap{width:${w}px;margin:0 auto;padding:0}</style><body>${CARDS.map(([k,f,iw,ih,label,cy,cw,ch]) => `
  <div class="wrap"><a class="bp-finder" href="#">
    <img class="bp-finder__img" src="file:///home/user/botplanet/apps/web/public/media/botmatch/${f}" width="${iw}" height="${ih}" alt="">
    <span class="bp-finder__cta" style="--cy:${cy};--cw:${cw};--ch:${ch}">
      <span>${label}</span>
      <svg class="bp-finder__chev" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </span></a></div>`).join("")}</body>`;

const D = "/tmp/claude-0/-home-user-botplanet/32861255-3f41-52a8-8beb-c21f7c7ea93f/scratchpad";
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
for (const [w, name] of [[560, "desktop"], [320, "narrow"]]) {
  writeFileSync(`${D}/preview-${name}.html`, html(w));
  const ctx = await browser.newContext({ viewport: { width: w + 40, height: 1000 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  await p.goto(`file://${D}/preview-${name}.html`, { waitUntil: "load" });
  await p.waitForTimeout(800);
  const cards = p.locator(".bp-finder");
  const n = await cards.count();
  for (let i = 0; i < n; i++) {
    const c = cards.nth(i);
    await c.scrollIntoViewIfNeeded();
    await p.waitForTimeout(150);
    const box = await c.boundingBox();
    const cta = await c.locator(".bp-finder__cta").boundingBox();
    console.log(`${CARDS[i][0].padEnd(10)} ${name.padEnd(8)} card ${Math.round(box.width)}×${Math.round(box.height)}  button ${Math.round(cta.width)}×${Math.round(cta.height)}px  left ${((cta.x-box.x)/box.width*100).toFixed(1)}%  top ${((cta.y-box.y)/box.height*100).toFixed(1)}%`);
    await c.screenshot({ path: `${D}/btn-${CARDS[i][0]}-${name}.png` });
  }
  await ctx.close();
}
await browser.close();
