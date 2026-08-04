/* ============================================================
   Scroll-performance harness.

   Drives a scripted 10-second scroll on a throttled mid-range
   Android profile and records what actually costs time: long
   tasks, layout shifts, dropped frames, and the paint/layout/
   raster totals from a real CDP trace.

     node scripts/scroll-profile.mjs <url> <label> [outDir]

   WHY IT EXISTS. "The page feels slow" and "the page IS slow"
   are different claims, and only one of them can be fixed. This
   turns the first into the second. The rule that goes with it is
   simple and not negotiable: record a trace BEFORE changing
   anything, and a second one AFTER, and quote both. A performance
   fix with only one number attached is a guess wearing a number.

   MEASURE LIKE FOR LIKE. Serve the same page from two builds and
   point this at each — anything else compares two pages rather
   than two versions of one. `npm run -w apps/web build` writes a
   prerendered /preview/review/, which is what makes that possible
   without a database or a worker runtime.

   The device profile is Lighthouse's own mobile one: 390x844 at
   DPR 3, 4x CPU throttle. A laptop with the throttle off will
   report that everything is fine, always.
   ============================================================ */
import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "node:fs";

const url = process.argv[2];
const label = process.argv[3] ?? "run";
const OUT = process.argv[4] ?? "perf";

if (!url) {
  console.error("usage: node scripts/scroll-profile.mjs <url> <label> [outDir]");
  process.exit(1);
}
mkdirSync(OUT, { recursive: true });

const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const ctx = await b.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
});
const p = await ctx.newPage();
const cdp = await ctx.newCDPSession(p);

// Mid-range Android: 4x CPU slowdown is Lighthouse's own mobile multiplier.
await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });

await p.goto(url, { waitUntil: "load", timeout: 60000 });
await p.waitForTimeout(1200);

// Web vitals + long tasks, collected in-page.
await p.evaluate(() => {
  window.__m = { longTasks: [], cls: 0, shifts: 0, lcp: 0 };
  new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__m.longTasks.push(Math.round(e.duration)); })
    .observe({ type: "longtask", buffered: true });
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) if (!e.hadRecentInput) { window.__m.cls += e.value; window.__m.shifts++; }
  }).observe({ type: "layout-shift", buffered: true });
  new PerformanceObserver((l) => { const es = l.getEntries(); window.__m.lcp = Math.round(es[es.length - 1].startTime); })
    .observe({ type: "largest-contentful-paint", buffered: true });
});

await cdp.send("Tracing.start", {
  categories: "devtools.timeline,disabled-by-default-devtools.timeline,blink.user_timing",
  transferMode: "ReturnAsStream",
});

// Ten seconds of continuous scrolling, in real steps rather than one jump.
const height = await p.evaluate(() => document.body.scrollHeight);
const t0 = Date.now();
const frames = [];
await p.evaluate(() => {
  window.__f = [];
  let last = performance.now();
  const tick = (t) => { window.__f.push(t - last); last = t; requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
});
while (Date.now() - t0 < 10000) {
  await p.mouse.wheel(0, 320);
  await p.waitForTimeout(55);
}

const chunks = [];
const done = new Promise((r) => cdp.on("Tracing.tracingComplete", r));
await cdp.send("Tracing.end");
const ev = await done;
if (ev.stream) {
  for (;;) {
    const c = await cdp.send("IO.read", { handle: ev.stream });
    chunks.push(c.data);
    if (c.eof) break;
  }
  await cdp.send("IO.close", { handle: ev.stream });
}

const trace = JSON.parse(chunks.join(""));
const totals = {};
for (const e of trace.traceEvents ?? []) {
  if (e.ph !== "X" || !e.dur) continue;
  const n = e.name;
  if (/^(Layout|UpdateLayoutTree|Paint|PaintImage|RasterTask|CompositeLayers|DecodeImage|ParseHTML|FunctionCall|EventDispatch|HitTest|PrePaint|Commit)$/.test(n)) {
    totals[n] = (totals[n] ?? 0) + e.dur / 1000;
  }
}

const m = await p.evaluate(() => ({ ...window.__m, frames: window.__f }));
const fr = m.frames.filter((f) => f > 0);
const long = fr.filter((f) => f > 32).length;      // missed two 60fps frames
const jank = fr.filter((f) => f > 50).length;      // visibly janky

const report = {
  label,
  url,
  scrollHeightPx: height,
  frames: fr.length,
  medianFrameMs: +fr.sort((a, z) => a - z)[Math.floor(fr.length / 2)].toFixed(1),
  p95FrameMs: +fr[Math.floor(fr.length * 0.95)].toFixed(1),
  framesOver32ms: long,
  framesOver50ms: jank,
  jankPercent: +((jank / fr.length) * 100).toFixed(1),
  longTasks: m.longTasks.length,
  longestTaskMs: m.longTasks.length ? Math.max(...m.longTasks) : 0,
  cls: +m.cls.toFixed(4),
  layoutShifts: m.shifts,
  lcpMs: m.lcp,
  traceTotalsMs: Object.fromEntries(Object.entries(totals).map(([k, v]) => [k, +v.toFixed(1)]).sort((a, z) => z[1] - a[1])),
};

writeFileSync(`${OUT}/${label}.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
await b.close();
