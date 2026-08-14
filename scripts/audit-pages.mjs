/* Per-page defect sweep. One detector per defect class the audits found,
   run against every live page rather than the three somebody had time to read. */
import { readFileSync, writeFileSync } from "node:fs";
const S = "/tmp/claude-0/-home-user-botplanet/fed94c4f-09af-5ded-89e4-8168580b1656/scratchpad";
const urls = readFileSync(`${S}/urls.txt`, "utf8").split("\n").filter(Boolean);

const typeOf = (p) => {
  if (p === "/") return "home";
  if (/^\/robots\/[^/]+\/[^/]+\/$/.test(p)) return "review";
  if (/^\/robots\/[^/]+\/$/.test(p)) return "hub";
  if (["/robots/","/compare/","/guides/","/best-robots/"].includes(p)) return "index";
  if (p.startsWith("/best-robots/")) return "best-of";
  if (p.startsWith("/compare/")) return "compare";
  if (p.startsWith("/guides/")) return "guide";
  if (p.startsWith("/botmatch/")) return "botmatch";
  if (p.startsWith("/authors/")) return "author";
  return "core";
};
const strip = (s) => s.replace(/<script[\s\S]*?<\/script>/g,"").replace(/<style[\s\S]*?<\/style>/g,"");
const text  = (s) => strip(s).replace(/<[^>]+>/g," ").replace(/&#(\d+);/g,(_,d)=>String.fromCharCode(d))
  .replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#x27;|&#39;/g,"'").replace(/&nbsp;/g," ")
  .replace(/&mdash;/g,"—").replace(/\s+/g," ");

const rows = [];
for (const u of urls) {
  const r = await fetch(`https://botplanet.io${u}`, { redirect: "manual" });
  const html = await r.text();
  const main = (html.match(/<main[^>]*>([\s\S]*?)<\/main>/) || [,""])[1];
  const body = text(main);
  const d = [];

  // Buy path
  const go = new Set([...html.matchAll(/href="(\/go\/[^"]*)"/g)].map(m=>m[1]));
  const namesProducts = /^\/robots\/[^/]+\/[^/]+\/$/.test(u) ||
    new Set([...main.matchAll(/href="(\/robots\/[^/]+\/[^/]+\/)"/g)].map(m=>m[1])).size > 0;
  if (go.size === 0 && namesProducts) d.push("NO_BUY_PATH: names products, no /go/ link anywhere");

  // Bare dash where a value belongs
  if (/>\s*—\s*</.test(main.replace(/class="price[^"]*">—</g,"PRICEDASH"))) {
    const n = (main.match(/>\s*—\s*</g)||[]).length;
    if (n > 2) d.push(`BARE_DASHES: ${n} cells render a lone em-dash`);
  }

  // Prose that prints a price (reviews/guides/best-of only; buy box owns price)
  if (["review","guide","best-of"].includes(typeOf(u))) {
    const proseOnly = text(main.replace(/<[^>]*bp-buy[\s\S]*?<\/section>/g,"")
      .replace(/<table[\s\S]*?<\/table>/g,""));
    const prices = [...new Set(proseOnly.match(/\$[0-9][0-9,]*(\.[0-9]{2})?/g) || [])];
    if (prices.length) d.push(`PROSE_PRICE: ${prices.slice(0,4).join(", ")}${prices.length>4?" …":""}`);
  }

  // Alternatives picker: bare power-type rationale, repeated product
  if (/shares the same power type/i.test(body)) d.push("PICKER_MECHANICAL: 'shares the same power type' caption");
  const alt = main.match(/(Readers also compared|Also compared|What to look at instead)[\s\S]{0,3000}/i);
  if (alt) {
    const links = [...alt[0].matchAll(/href="(\/robots\/[^/]+\/[^/]+\/)"/g)].map(m=>m[1]);
    const dup = links.filter((l,i)=>links.indexOf(l)!==i);
    if (dup.length) d.push(`PICKER_REPEAT: ${[...new Set(dup)].join(", ")} listed twice in one block`);
  }

  // Video block poster consistency
  const hasVideo = /<iframe|youtube|bp-video/i.test(main);
  const hasPoster = /poster=|bp-video__poster/i.test(main);
  if (hasVideo && !hasPoster) d.push("VIDEO_NO_POSTER: video block without a poster image");

  // Hub prose links
  if (typeOf(u) === "hub") {
    const prose = main.replace(/<table[\s\S]*?<\/table>/g,"").replace(/<div class="grid grid--products[\s\S]*$/,"");
    const pl = new Set([...prose.matchAll(/href="(\/robots\/[^/]+\/[^/]+\/)"/g)].map(m=>m[1]));
    if (pl.size === 0) d.push("HUB_PROSE_NO_LINKS: no product link anywhere in the body copy");
  }

  // Thin
  const words = body.split(" ").filter(w=>/[a-z]/i.test(w)).length;
  if (words < 300 && !["index","core","author","botmatch"].includes(typeOf(u))) {
    d.push(`THIN: ${words} words`);
  }

  rows.push({ u, type: typeOf(u), status: r.status, words, go: go.size, defects: d });
  process.stderr.write(d.length ? "!" : ".");
}
writeFileSync(`${S}/sweep.json`, JSON.stringify(rows, null, 1));
process.stderr.write("\n");
const withD = rows.filter(r=>r.defects.length);
console.log(`pages ${rows.length} | pages with at least one defect ${withD.length} | total defects ${rows.reduce((a,r)=>a+r.defects.length,0)}`);
