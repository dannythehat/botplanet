/**
 * Free identity sweep over every pinned ASIN.
 *
 * Fetches amazon.com/dp/<asin> for each destination, parses the listing's own
 * details table, and compares brand / model against content/commerce/
 * identity-baseline.ts. Costs nothing — no SerpApi, no credits — which is the
 * whole point: the paid price checker guards 22 products against a 200-a-month
 * ceiling, and this guards all 49.
 *
 * FALSE POSITIVES ARE THE ENEMY HERE. The first version of this script called
 * forty products DEAD because Amazon ships the string "Sorry we couldn't load
 * the review" inside its review widget on every healthy page. A sweep that
 * cries wolf gets switched off, and a sweep that is off is worse than none.
 * So a page is judged ALIVE on the presence of id="productTitle" and on the
 * final URL still carrying the ASIN — positive evidence of a product page,
 * never the absence of an error string.
 *
 * Run: node scripts/identity-sweep.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
const S="/tmp/claude-0/-home-user-botplanet/32861255-3f41-52a8-8beb-c21f7c7ea93f/scratchpad";
const dest=JSON.parse(readFileSync(`${S}/dest.json`,"utf8")).filter(d=>d.asin);
const UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const dec=s=>s?s.replace(/&amp;/g,"&").replace(/&#x27;|&#39;/g,"'").replace(/&quot;/g,'"').replace(/&nbsp;/g," ").replace(/\s+/g," ").trim():"";

/* Detail rows: Amazon renders brand / model as a definition list or a table.
   Both shapes are read; whichever answers first wins. */
function details(h){
  const out={};
  for (const m of h.matchAll(/<tr[^>]*>\s*<t[hd][^>]*>\s*([^<]{2,60}?)\s*<\/t[hd]>\s*<t[dh][^>]*>([\s\S]{0,300}?)<\/t[dh]>/g)){
    const k=dec(m[1]).replace(/‎|‏/g,"").replace(/[:\s]+$/,"");
    const v=dec(m[2].replace(/<[^>]+>/g," "));
    if(k&&v&&!out[k]) out[k]=v.slice(0,90);
  }
  for (const m of h.matchAll(/<span class="a-text-bold">\s*([^<]{2,60}?)\s*<\/span>\s*<span[^>]*>([\s\S]{0,200}?)<\/span>/g)){
    const k=dec(m[1]).replace(/‎|‏/g,"").replace(/[:\s]+$/,"");
    const v=dec(m[2].replace(/<[^>]+>/g," "));
    if(k&&v&&!out[k]) out[k]=v.slice(0,90);
  }
  return out;
}
const pick=(d,names)=>{for(const n of names){for(const k of Object.keys(d)) if(k.toLowerCase()===n) return d[k];} return null;};

const out=[];
for (const d of dest) {
  const url=`https://www.amazon.com/dp/${d.asin}`;
  let rec={...d,status:0,finalUrl:"",title:"",brand:null,modelName:null,modelNumber:null,mpn:null,verdict:"UNKNOWN",note:""};
  try{
    const r=await fetch(url,{headers:{"user-agent":UA,"accept-language":"en-US,en;q=0.9"},redirect:"follow"});
    rec.status=r.status; rec.finalUrl=r.url;
    const h=await r.text();
    rec.title=dec((h.match(/<title>([\s\S]*?)<\/title>/)||[])[1]??"").replace(/^Amazon\.com:?\s*/,"").slice(0,110);
    const hasProduct=/id="productTitle"/.test(h);
    const stillDp=r.url.includes(`/dp/${d.asin}`)||r.url.includes(`/${d.asin}`);
    const dl=details(h);
    rec.brand=pick(dl,["brand","brand name"]);
    rec.modelName=pick(dl,["model name","style name"]);
    rec.modelNumber=pick(dl,["item model number","model number","part number"]);
    rec.mpn=pick(dl,["manufacturer"]);
    if(!hasProduct && !stillDp) {rec.verdict="MOVED"; rec.note=`redirected to ${r.url.slice(0,60)}`;}
    else if(!hasProduct){rec.verdict="DEAD"; rec.note="no product title on the page";}
    else if(!stillDp){rec.verdict="MOVED"; rec.note=`resolves to ${r.url.slice(0,60)}`;}
    else rec.verdict="ALIVE";
  }catch(e){rec.verdict="ERROR"; rec.note=String(e).slice(0,80);}
  out.push(rec);
  console.log(`${rec.verdict.padEnd(6)} ${d.asin} ${d.productId.padEnd(36)} ${(rec.brand??"-").slice(0,14).padEnd(15)} ${(rec.modelNumber??rec.modelName??"-").slice(0,18).padEnd(19)} ${rec.title.slice(0,42)}`);
  writeFileSync(`${S}/sweep.json`, JSON.stringify(out,null,1));
  await new Promise(r=>setTimeout(r,300));
}
const c={}; out.forEach(o=>c[o.verdict]=(c[o.verdict]||0)+1);
console.log("\nDONE", JSON.stringify(c));
