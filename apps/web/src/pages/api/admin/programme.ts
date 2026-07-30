import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";
import { getDb, schema } from "../../../lib/db";

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  const db = getDb(locals);
  const f = await request.formData();
  const programmeId = String(f.get("programmeId") ?? "");
  const accountId = String(f.get("accountId") ?? "");
  const str = (k: string) => {
    const v = f.get(k);
    return v == null ? undefined : String(v);
  };

  if (programmeId && str("programmeStatus")) {
    await db.update(schema.affiliatePrograms).set({ status: str("programmeStatus")! }).where(eq(schema.affiliatePrograms.id, programmeId));
  }
  if (accountId) {
    const set: Record<string, unknown> = { updatedAt: new Date() };
    if (str("stage")) set.applicationStage = str("stage");
    if (str("accountStatus")) set.status = str("accountStatus");
    set.currentBlocker = str("blocker") || null;
    set.nextAction = str("nextAction") || null;
    await db.update(schema.affiliateAccounts).set(set).where(eq(schema.affiliateAccounts.id, accountId));
  }
  return redirect("/admin/programmes?saved=1");
};
