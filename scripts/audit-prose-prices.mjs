/* A prose price is only a defect when it restates the price the buy box owns.
   A subscription fee, an accessory, a rival's price are all legitimate. */
import { readFileSync, writeFileSync } from "node:fs";
const S = "/tmp/claude-0/-home-user-botplanet/fed94c4f-09af-5ded-89e4-8168580b1656/scratchpad";
const rows = JSON.parse(readFileSync(`${S}/sweep.json`, "utf8"));
const strip = (s) => s.replace(/<script[\s\S]*?<\/script>/g,"").replace(/<style[\s\S]*?<\/style>/g,"");
const text = (s) => strip(s).replace(/<[^>]+>/g," ").replace(/&nbsp;/g," ").replace(/\s+/g," ");
const num = (s) => Number(s.replace(/[$,]/g,""));

const out = [];
for (const r of rows.filter((x) => x.defects.some((d) => d.startsWith("PROSE_PRICE")))) {
  const html = await (await fetch(`https://botplanet.io${r.u}`)).text();
  const main = (html.match(/<main[^>]*>([\s\S]*?)<\/main>/) || [,""])[1];
  // The buy box price: the figure beside a /go/ link.
  const buySeg = main.match(/[\s\S]{0,900}href="\/go\/[^"]*"[\s\S]{0,400}/);
  const buy = buySeg ? [...new Set((text(buySeg[0]).match(/\$[0-9][0-9,]*(\.[0-9]{2})?/g)||[]))].map(num) : [];
  const prose = text(main.replace(/[\s\S]{0,900}href="\/go\/[^"]*"[\s\S]{0,400}/g,"").replace(/<table[\s\S]*?<\/table>/g,""));
  const found = [...new Set(prose.match(/\$[0-9][0-9,]*(\.[0-9]{2})?/g) || [])].map(num);
  // Restates the buy box when within 12% of it — covers list-vs-sale drift.
  const restates = found.filter((f) => buy.some((b) => b > 0 && Math.abs(f - b) / b < 0.12));
  if (restates.length) out.push({ u: r.u, buy, restates });
  process.stderr.write(".");
}
writeFileSync(`${S}/prices.json`, JSON.stringify(out, null, 1));
process.stderr.write("\n");
console.log(`pages whose prose restates the buy box price: ${out.length}`);
for (const o of out.slice(0, 12)) console.log(`  ${o.u}  buybox=${o.buy.join("/")}  prose=${o.restates.join(", ")}`);
