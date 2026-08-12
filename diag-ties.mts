/* Why the tying categories tie: score every product and print the components. */
const rows = (await import("/tmp/claude-0/-home-user-botplanet/32861255-3f41-52a8-8beb-c21f7c7ea93f/scratchpad/attrs.json", { with: { type: "json" } })).default as any[];
const products = (rows as any)[0].results as any[];
const { questionsFor, MATCHER_DEFAULTS } = await import("./apps/web/src/content/matcher-questions.ts");

for (const cat of ["companion-robots", "self-cleaning-litter-boxes", "pet-camera-robots", "robotic-lawn-mowers"]) {
  const list = products.filter((p) => p.cat === cat);
  const qs = questionsFor(cat) ?? [];
  let answers: any = { ...((MATCHER_DEFAULTS as any)?.[cat] ?? {}) };
  for (const q of qs) { const o = (q.options ?? [])[0]; if (o?.scores) answers = { ...answers, ...o.scores }; }

  console.log(`\n=== ${cat} ===`);
  console.log(`   reader asked for: desired_cleans=${JSON.stringify(answers.desired_cleans)} budget=${answers.budget_tier} env=${answers.environment}`);
  for (const p of list) {
    const cleans = JSON.parse(p.cleans);
    const want: string[] = answers.desired_cleans ?? [];
    const covered = want.filter((w) => cleans.includes(w)).length;
    console.log(
      `   ${p.slug.padEnd(30)} tier=${String(p.price_tier).padEnd(10)} ` +
      `covers ${covered}/${want.length || 0}  cleans=${cleans.join("|")}`,
    );
  }
}
