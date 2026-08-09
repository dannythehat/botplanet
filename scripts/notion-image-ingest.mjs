/**
 * Download every image in the target sections of a fresh Notion dump.
 *
 * THE URLS EXPIRE IN 300 SECONDS (X-Amz-Expires=300), so this has to run
 * immediately after the fetch. It names each file <section-key>__<nn>__<orig>
 * so position under the heading survives into the filename — position is the
 * only key this round, because the uploads carry no slot words.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const file = process.argv[2];
const raw = readFileSync(file, "utf8").replace(/\\n/g, "\n");
const lines = raw.split("\n");

const IMG = /!\[[^\]]*\]\((https:\/\/prod-files-secure\.s3[^)]+)\)/;
const SLOT = /`([a-z][a-z0-9-]{1,30})`/;

const TARGETS = [
  ["grill-hub", "Grill-cleaning robots hub — 5 of 8"],
  ["petcam-hub", "Pet camera robots hub — 0 of 8"],
  ["moflin", "Moflin — "],
  ["miko-3", "Miko 3 · 4 images"],
  ["vector-2", "Vector 2.0 · 4 images"],
  ["eilik", "Eilik · 4 images"],
  ["loona", "Loona · 4 images"],
  ["emo", "EMO · 4 images"],
  ["ropet", "Ropet KAMOMO"],
  ["joy-for-all", "Joy For All — 1 image"],
  ["ebo-air-2", "Enabot EBO Air 2 · 4 images"],
  ["ebo-se", "Enabot EBO SE · 4 images"],
  ["rola-petpal", "Enabot ROLA PetPal · 4 images"],
  ["enabot-range", "Enabot range page · 2 images"],
];

let cur = null;
const found = [];
for (const line of lines) {
  const h = /^#{1,4}\s+(.*)$/.exec(line);
  if (h) {
    const title = h[1].trim();
    const t = TARGETS.find(([, needle]) => title.includes(needle));
    cur = t ? { key: t[0], title, seq: 0, items: [] } : null;
    if (cur) found.push(cur);
    continue;
  }
  if (!cur) continue;
  const im = IMG.exec(line);
  if (im) {
    cur.seq += 1;
    cur.items.push({ kind: "image", seq: cur.seq, url: im[1], orig: decodeURIComponent(im[1].split("?")[0].split("/").pop()) });
    continue;
  }
  const sl = SLOT.exec(line);
  if (sl) cur.items.push({ kind: "slot", name: sl[1], caption: line.replace(/[*`]/g, "").replace(/^\s*-\s*/, "").trim().slice(0, 200) });
}

const DIR = new URL("./notion-dl/", import.meta.url);
mkdirSync(DIR, { recursive: true });

let ok = 0, fail = 0;
const manifest = [];
for (const s of found) {
  for (const it of s.items) {
    if (it.kind !== "image") continue;
    const name = `${s.key}__${String(it.seq).padStart(2, "0")}__${it.orig}`;
    try {
      const r = await fetch(it.url);
      if (!r.ok) { console.log(`FAIL ${r.status} ${name}`); fail++; continue; }
      const buf = Buffer.from(await r.arrayBuffer());
      writeFileSync(new URL(name, DIR), buf);
      manifest.push({ section: s.key, title: s.title, seq: it.seq, orig: it.orig, saved: name, bytes: buf.length });
      ok++;
      console.log(`ok ${name} ${Math.round(buf.length / 1024)}KB`);
    } catch (e) {
      console.log(`ERR ${name} ${e.message}`);
      fail++;
    }
  }
}
writeFileSync(new URL("./dl-manifest.json", import.meta.url), JSON.stringify({ sections: found.map((s) => ({ key: s.key, title: s.title, items: s.items.map((i) => (i.kind === "slot" ? { slot: i.name, caption: i.caption } : { seq: i.seq, orig: i.orig })) })), files: manifest }, null, 2));
console.log(`\n${ok} downloaded, ${fail} failed, ${found.length} sections`);
