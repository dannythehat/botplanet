const HOST = "https://botplanet.io";
const NC = { cache: "no-store", headers: { "cache-control": "no-cache", pragma: "no-cache" } };
const sizes = new Map();
async function bytesOf(u) {
  if (sizes.has(u)) return sizes.get(u);
  const p = (async () => { try { const r = await fetch(u, NC); const n = Number(r.headers.get("content-length") ?? 0); try { await r.body?.cancel(); } catch {} return r.ok ? n : 0; } catch { return 0; } })();
  sizes.set(u, p); return p;
}
const sm = await (await fetch(`${HOST}/sitemap.xml`, NC)).text();
const paths = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(HOST, ""));
const attr = (t, n) => (new RegExp(`\\b${n}="([^"]*)"`, "i").exec(t) ?? [])[1] ?? null;

async function page(path) {
  const html = await (await fetch(HOST + path, NC)).text();
  const rows = [];
  for (const tag of html.match(/<img\b[^>]*>/gi) ?? []) {
    const src = attr(tag, "src"); if (!src || src.startsWith("data:")) continue;
    const srcset = attr(tag, "srcset");
    const abs = (s) => (s.startsWith("http") ? s : HOST + s);
    let bytes = await bytesOf(abs(src));
    if (srcset) {
      const c = srcset.split(",").map((x) => x.trim().split(/\s+/)).filter((x) => x.length === 2)
        .map(([u, w]) => ({ u, w: parseInt(w) })).sort((a, b) => a.w - b.w);
      const pick = c.find((x) => x.w >= 360) ?? c.at(-1);
      if (pick) bytes = await bytesOf(abs(pick.u));
    }
    rows.push({ src, srcset: !!srcset, bytes, lazy: /loading="lazy"/i.test(tag),
      dims: !!(attr(tag, "width") && attr(tag, "height")), prio: /fetchpriority="high"/i.test(tag) });
  }
  return { path, htmlKB: Math.round(html.length / 1024), rows };
}
const out = [];
for (let i = 0; i < paths.length; i += 8) { out.push(...await Promise.all(paths.slice(i, i + 8).map(page))); process.stderr.write(`\r${out.length}/${paths.length}`); }
process.stderr.write("\n");
const kb = (b) => Math.round(b / 1024);
const eager = (p) => p.rows.filter((r) => !r.lazy).reduce((s, r) => s + r.bytes, 0);
out.sort((a, b) => eager(b) - eager(a));
console.log("EAGER IMAGE WEIGHT — what a phone downloads before it scrolls\n");
console.log("eager   lazy    html   imgs  eagerN  nodims  prio  page");
for (const p of out.slice(0, 15)) {
  const l = p.rows.filter((r) => r.lazy).reduce((s, r) => s + r.bytes, 0);
  console.log(`${(kb(eager(p))+"KB").padEnd(7)} ${(kb(l)+"KB").padEnd(7)} ${(p.htmlKB+"KB").padEnd(6)} ${String(p.rows.length).padEnd(5)} ${String(p.rows.filter(r=>!r.lazy).length).padEnd(7)} ${String(p.rows.filter(r=>!r.dims).length).padEnd(7)} ${(p.rows.some(r=>r.prio)?"yes":"NO").padEnd(5)} ${p.path}`);
}
const all = out.flatMap((p) => p.rows.map((r) => ({ ...r, path: p.path })));
console.log(`\nNO width/height (layout shift): ${all.filter((r) => !r.dims).length} tags across ${new Set(all.filter(r=>!r.dims).map(r=>r.path)).size} pages`);
const byImg = new Map();
for (const r of all.filter((r) => !r.dims)) byImg.set(r.src, (byImg.get(r.src) ?? 0) + 1);
for (const [s, n] of [...byImg].sort((a,b)=>b[1]-a[1]).slice(0, 12)) console.log(`  ${String(n).padStart(3)}×  ${s}`);
console.log(`\nPages with NO fetchpriority on any image: ${out.filter((p)=>p.rows.length && !p.rows.some(r=>r.prio)).length}/${out.length}`);
console.log(`Total eager across site: ${kb(out.reduce((s,p)=>s+eager(p),0))}KB   median eager: ${kb(out.map(eager).sort((a,b)=>a-b)[Math.floor(out.length/2)])}KB`);
