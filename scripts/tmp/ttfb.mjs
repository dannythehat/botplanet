const HOST = "https://botplanet.io";
const NC = { cache: "no-store", headers: { "cache-control": "no-cache", pragma: "no-cache" } };
const sm = await (await fetch(`${HOST}/sitemap.xml`, NC)).text();
const paths = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(HOST, ""));
const rows = [];
for (const p of paths) {
  const t0 = performance.now();
  const r = await fetch(HOST + p, NC);
  const ttfb = performance.now() - t0;
  const body = await r.text();
  rows.push({ p, ttfb: Math.round(ttfb), total: Math.round(performance.now() - t0), kb: Math.round(body.length / 1024), cf: r.headers.get("cf-cache-status") ?? "-" });
  process.stderr.write(`\r${rows.length}/${paths.length}`);
}
process.stderr.write("\n");
rows.sort((a, b) => b.ttfb - a.ttfb);
console.log("SLOWEST SERVER RESPONSES (cold, cache bypassed)\n");
console.log("ttfb    total   html   cf-cache      page");
for (const r of rows.slice(0, 20)) console.log(`${(r.ttfb+"ms").padEnd(7)} ${(r.total+"ms").padEnd(7)} ${(r.kb+"KB").padEnd(6)} ${r.cf.padEnd(13)} ${r.p}`);
const t = rows.map((r) => r.ttfb).sort((a, b) => a - b);
console.log(`\n${rows.length} pages.  median ${t[Math.floor(t.length/2)]}ms   p90 ${t[Math.floor(t.length*0.9)]}ms   max ${t.at(-1)}ms`);
console.log(`over 1s: ${rows.filter(r=>r.ttfb>1000).length}   over 500ms: ${rows.filter(r=>r.ttfb>500).length}`);
