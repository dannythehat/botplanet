import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";
import { getDb, schema } from "../../../lib/db";

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  const db = getDb(locals);
  const f = await request.formData();
  const offerId = String(f.get("offerId") ?? "");
  const redirectKey = f.get("redirectKey") ? String(f.get("redirectKey")) : null;
  if (!offerId) return redirect("/admin/offers");

  const destination = String(f.get("destination") ?? "").trim();
  await db
    .update(schema.offers)
    .set({
      offerStatus: String(f.get("offerStatus") ?? "active"),
      affiliateProgramId: f.get("programmeId") ? String(f.get("programmeId")) : null,
      affiliateDestinationUrl: destination || null, // blank = use automatic route
      updatedAt: new Date(),
    })
    .where(eq(schema.offers.id, offerId));

  if (redirectKey) {
    await db
      .update(schema.redirectLinks)
      .set({ active: f.get("linkActive") != null })
      .where(eq(schema.redirectLinks.key, redirectKey));
  }
  return redirect("/admin/offers?saved=1");
};
