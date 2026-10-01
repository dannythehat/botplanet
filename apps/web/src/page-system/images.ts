/**
 * Which pictures a page still needs, worked out from the page file and the media
 * registry rather than from anybody's memory.
 *
 * A page can be built before its pictures exist. Until they do, the template draws
 * a correctly sized BotPlanet placeholder (hero) or the generic robot silhouette
 * (products), so nothing breaks and nothing jumps when the real picture arrives.
 * The price of that freedom is the rule in test/page-system.test.ts: a page with a
 * picture still pending has to be noindex, so an unfinished page never reaches
 * search results.
 */
import { MEDIA_ASSETS } from "../content/media/assets";
import { PRODUCT_ID } from "../content/products";
import type { BestOfPage } from "./schema";
import { HERO_DESKTOP } from "./rules";

export interface ImageSlot {
  /** "hero" or "product:<slug>". */
  slot: string;
  ready: boolean;
  /** What to make, in words. */
  need: string;
  /** The file name to give it when dropping it in the inbox. */
  inboxName: string;
}

export function imageSlots(page: BestOfPage): ImageSlot[] {
  const slug = page.path.split("/").filter(Boolean).pop() ?? "page";
  const slots: ImageSlot[] = [
    {
      slot: "hero",
      ready: Boolean(page.hero.desktop && MEDIA_ASSETS.some((a) => a.src === page.hero.desktop)),
      need: `Hero for the top of the page, ${HERO_DESKTOP.width}x${HERO_DESKTOP.height} (16:9) or a wide panorama. The title goes on it, so leave room for words.`,
      inboxName: `${slug}-hero`,
    },
  ];
  for (const product of page.comparison) {
    const id = PRODUCT_ID[product];
    const has = MEDIA_ASSETS.some(
      (a) => a.productId === id && a.type === "product_hero" && a.kind === "depiction" && a.withdrawal === "active",
    );
    slots.push({
      slot: `product:${product}`,
      ready: has,
      need: `Picture of ${product}, wider than tall (about 4:3), used in the tables, cards and buy strip.`,
      inboxName: product,
    });
  }
  return slots;
}

export const pendingImageSlots = (page: BestOfPage): ImageSlot[] => imageSlots(page).filter((s) => !s.ready);
