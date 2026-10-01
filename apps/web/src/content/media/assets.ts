/**
 * The asset inventory. One record per image the site can render.
 *
 * A record exists so a surface knows what the file is, how big it is, what it
 * says to a screen reader, and which slots it may fill. Checksums and
 * dimensions for generated art come from the generator manifest, so an edited
 * source that is not regenerated fails a test rather than shipping stale
 * dimensions and shifting the layout.
 *
 * `kind` is the one distinction that changes behaviour: a `placeholder` names
 * a model and depicts nothing, so it stays out of Product structured data
 * where a consumer would read it as a photograph of the machine.
 */
import { VERIFICATIONS } from "../evidence/verification";
import { PRODUCT_ID } from "../products";
import MANIFEST from "../../../../../scripts/placeholder-manifest.json";
import DERIVATIVES_JSON from "../../../../../scripts/derivative-manifest.json";
import type { AssetKind, MediaAssetRecord, Placement, SchemaEligibility } from "./types";

const AUTHORED = "2026-07-31";

/** A placeholder names a model and shows nothing, so Product schema is shut. */
const PLACEHOLDER_SCHEMA: SchemaEligibility = {
  productImage: false,
  imageObject: true,
  articleImage: true,
  openGraph: true,
  twitter: true,
  reason: "a placeholder names the model and depicts nothing; Product schema would present it as a photograph of the machine",
};

/** Artwork illustrating a concept rather than one specific machine. */
const ORIGINAL_SCHEMA: SchemaEligibility = {
  productImage: false,
  imageObject: true,
  articleImage: true,
  openGraph: true,
  twitter: true,
  reason: "illustrates a concept rather than a specific machine, so it supports an article or a social preview but does not stand as that machine's Product image",
};

/** Anything that actually shows the machine. Open everywhere. */
const DEPICTION_SCHEMA: SchemaEligibility = {
  productImage: true,
  imageObject: true,
  articleImage: true,
  openGraph: true,
  twitter: true,
  reason: null,
};

const EVERYWHERE: Placement[] = [
  "product_page", "category_page", "listing_card", "comparison",
  "homepage", "guide", "open_graph", "structured_data", "email",
];

/** Fields every record shares. Anything image-specific is set at the record. */
const base = (id: string, kind: AssetKind = "illustration") => ({
  id,
  kind,
  sourceProvider: "BotPlanet",
  allowedPlacements: EVERYWHERE,
  addedDate: AUTHORED,
  withdrawal: "active" as const,
  withdrawalDate: null,
  withdrawalReason: null,
});

/* ------------------------------------------------------------------ */
/* Original BotPlanet artwork                                          */
/* ------------------------------------------------------------------ */

/* @extension-point per-product | required | Every image on the site needs a
   record here stating who made it and on what asset record. An image without
   one fails media.test.ts and does not ship — deliberately, because publishing
   a picture we cannot prove we may use is the one mistake that costs money
   rather than traffic. */
export const ORIGINAL_ASSETS: MediaAssetRecord[] = [
  /* Category hub artwork, 8 August 2026. Seven hubs, three jobs per hub.

     A `hero` is a wide cinematic scene. A `card` is a situation the reader is
     meant to recognise as their own house. A `row` is a tight detail shot that
     has to survive being rendered at 96px — a scene shrunk that far is a grey
     smudge, which is why the three are shot differently and not
     interchangeable. None depicts a specific machine. */
  {
    ...base("hub-vacuums-hero", "illustration"),
    productId: null,
    purpose: "vacuums hub — hero",
    exactModel: null,
    type: "category_hero",
    checksum: "sha256:84bf605be5db42f2e8bef4646f78cbabb421b81fc56c44621e3ddb44d7d0dec2",
    width: 1672,
    height: 941,
    src: "/media/hubs/vacuums/hero.webp",
    altText:
      "A round black robot vacuum crossing a sunlit open-plan living room, shot low at skirting height with a sofa and dining table behind.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-vacuums-card-hard-floor", "illustration"),
    productId: null,
    purpose: "vacuums hub — card-hard-floor",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:4e4cb309259c86eb6e36f3497e27e3096d9ed7c586fbe15186c51aa6b71b367d",
    width: 1536,
    height: 1024,
    src: "/media/hubs/vacuums/card-hard-floor.webp",
    altText:
      "A wide expanse of pale oak flooring running to garden doors, no rug anywhere in the room.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-vacuums-card-mixed", "illustration"),
    productId: null,
    purpose: "vacuums hub — card-mixed",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:8c567d1cc4b492ea87981eb1c5af23c0be6a9e25728b68a4b0aa0efe2ed513ad",
    width: 1536,
    height: 1024,
    src: "/media/hubs/vacuums/card-mixed.webp",
    altText:
      "The boundary where oak flooring meets a large flat-weave rug, both surfaces in frame.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-vacuums-card-shag", "illustration"),
    productId: null,
    purpose: "vacuums hub — card-shag",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:9065da95d0119000816ae49418e3274de86a2261734e95131f26fb6e3771ecb7",
    width: 1536,
    height: 1024,
    src: "/media/hubs/vacuums/card-shag.webp",
    altText:
      "Deep cream shag pile close up, the fibres catching low sunlight.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-vacuums-row-crumbs", "illustration"),
    productId: null,
    purpose: "vacuums hub — row-crumbs",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:be68b1dfcc17abef8ec30e43ce4f9d0d5b8152b491633fb892657213b69774f7",
    width: 1536,
    height: 1024,
    src: "/media/hubs/vacuums/row-crumbs.webp",
    altText:
      "Crumbs and grit scattered across a hard floor in raking light.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-vacuums-row-dock", "illustration"),
    productId: null,
    purpose: "vacuums hub — row-dock",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:2a1d721a68387900f67dd8ce5a071a6bd0ea0721d5b0e0a3a56344093d07ea19",
    width: 1448,
    height: 1086,
    src: "/media/hubs/vacuums/row-dock.webp",
    altText:
      "A robot vacuum reversing onto its dock against the wall of an otherwise empty room.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-vacuums-row-corner", "illustration"),
    productId: null,
    purpose: "vacuums hub — row-corner",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:ca5ee52783f77eb574d8e771a94e21855ae805d523753f3d654c7294f5de10f4",
    width: 1536,
    height: 1024,
    src: "/media/hubs/vacuums/row-corner.webp",
    altText:
      "The corner where two skirting boards meet, clean and empty.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-vacuums-lead-mopped", "illustration"),
    productId: null,
    purpose: "vacuums hub — lead-mopped",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:6277db13c0a6d6d62601cd0a8683155d3e1e9edde18b999f3e6d52ee6c32db3b",
    width: 1536,
    height: 1024,
    src: "/media/hubs/vacuums/lead-mopped.webp",
    altText:
      "A damp mopped stripe drying across pale tile.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-lawn-hero", "illustration"),
    productId: null,
    purpose: "lawn hub — hero",
    exactModel: null,
    type: "category_hero",
    checksum: "sha256:d1efb0977f4aa6b61cae090af9498b38f2554d24074ec583433352be5dc95c2e",
    width: 1672,
    height: 941,
    src: "/media/hubs/lawn/hero.webp",
    altText:
      "A robot mower on a striped lawn at sunset with a lit stone house behind it.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-lawn-card-small", "illustration"),
    productId: null,
    purpose: "lawn hub — card-small",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:056fff22b1d9e120531499b441f2f3fe9993f2a32977a2fae286e55f8923ed8c",
    width: 1536,
    height: 1024,
    src: "/media/hubs/lawn/card-small.webp",
    altText:
      "A small enclosed suburban back lawn between fences, with a patio along one side.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-lawn-card-medium", "illustration"),
    productId: null,
    purpose: "lawn hub — card-medium",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:aea843b3b889c15ce268b697a694fb443e5ed7801106df4e76a96d9a219f48fb",
    width: 1536,
    height: 1024,
    src: "/media/hubs/lawn/card-medium.webp",
    altText:
      "A larger garden lawn with curved planted borders and mature trees.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-lawn-card-large", "illustration"),
    productId: null,
    purpose: "lawn hub — card-large",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:ca09c1dab76e3183dbcdde8ce76ba9df48969ea2f7dcbea755f6d1ec9a41d026",
    width: 1536,
    height: 1024,
    src: "/media/hubs/lawn/card-large.webp",
    altText:
      "A wide open expanse of mown grass running to a treeline.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-lawn-row-cut", "illustration"),
    productId: null,
    purpose: "lawn hub — row-cut",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:4700e6adddda55df7e5c63213dcdb237e406050d46dd3f3d7eaf5e837593c29d",
    width: 1536,
    height: 1024,
    src: "/media/hubs/lawn/row-cut.webp",
    altText:
      "Freshly cut lawn seen close up, the blade tips even across the frame.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-lawn-row-dew", "illustration"),
    productId: null,
    purpose: "lawn hub — row-dew",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:707db6f41345b9a3a4143349006d1de65add37c21b08f873fcdf5c1bbf779cb6",
    width: 1536,
    height: 1024,
    src: "/media/hubs/lawn/row-dew.webp",
    altText:
      "Long grass heavy with dew in low morning sun.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-lawn-row-border", "illustration"),
    productId: null,
    purpose: "lawn hub — row-border",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:9267c5b81d69bf5032374b29ce760a2a8d6cc94fdec15b600489595e3dadde82",
    width: 1536,
    height: 1024,
    src: "/media/hubs/lawn/row-border.webp",
    altText:
      "The edge where a lawn meets a planted border and a paved path.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-litter-hero", "illustration"),
    productId: null,
    purpose: "litter hub — hero",
    exactModel: null,
    type: "category_hero",
    checksum: "sha256:4a2230abd057a2bad20a0a8b171b9e8d0a810be96bedb9f496bc14b020956bf3",
    width: 1672,
    height: 941,
    src: "/media/hubs/litter/hero.webp",
    altText:
      "A self-cleaning litter box in the corner of a clean utility room, a long-haired cat walking away from it.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-litter-card-average", "illustration"),
    productId: null,
    purpose: "litter hub — card-average",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:c6c8eafc5e52224f83fce8dc1984bbe1fdd3ea5a1b6abdf0cc75b0f2e0cca778",
    width: 1536,
    height: 1024,
    src: "/media/hubs/litter/card-average.webp",
    altText:
      "An average adult tabby standing side on beside a self-cleaning litter box.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-litter-card-large", "illustration"),
    productId: null,
    purpose: "litter hub — card-large",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:2bdf646dbc7084025ae5eb201bbfc3d150bea644ac1698bbc774ac36c740ecff",
    width: 1536,
    height: 1024,
    src: "/media/hubs/litter/card-large.webp",
    altText:
      "A large long-bodied Maine Coon type cat standing side on against a plain wall for scale.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-litter-card-kitten", "illustration"),
    productId: null,
    purpose: "litter hub — card-kitten",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:9e9121acb61ecab44726f16583e7c95805e29444f8cb8daec6cede05cc3d3247",
    width: 1536,
    height: 1024,
    src: "/media/hubs/litter/card-kitten.webp",
    altText:
      "A small tabby kitten sitting alone on a wide floor, tiny against the door frame beside it.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-litter-row-scoop", "illustration"),
    productId: null,
    purpose: "litter hub — row-scoop",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:cc1302ac540be07b912e1665f700f17df351b334e1de15e3dfc1bc48d8ec1872",
    width: 1536,
    height: 1024,
    src: "/media/hubs/litter/row-scoop.webp",
    altText:
      "A plastic scoop resting on the rim of an open litter tray.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-litter-row-two-cats", "illustration"),
    productId: null,
    purpose: "litter hub — row-two-cats",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:d87976829a0c5085c3ffff6a1da0b1ee8ad934c08d12e64d271b95e0af90d7c5",
    width: 1536,
    height: 1024,
    src: "/media/hubs/litter/row-two-cats.webp",
    altText:
      "Two cats in the same room, one lying on a mat and one walking, neither at the litter box behind them.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-litter-row-stretch", "illustration"),
    productId: null,
    purpose: "litter hub — row-stretch",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:3e693b7b31e293263d31e765ad3f275621d8199ed7a3b034a3df931603f6e696",
    width: 1536,
    height: 1024,
    src: "/media/hubs/litter/row-stretch.webp",
    altText:
      "A tabby cat mid-stretch on a tiled floor, alert and well, a litter box behind.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-litter-lead-drawer", "illustration"),
    productId: null,
    purpose: "litter hub — lead-drawer",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:1f2a9bd71ced177bae0a27bce6140919f5e022db6502cc36126b8799ca2c3f75",
    width: 1536,
    height: 1024,
    src: "/media/hubs/litter/lead-drawer.webp",
    altText:
      "The closed waste drawer of a self-cleaning litter box, sealed shut.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  /* ------------------------------------------------------------------
     HOMEPAGE DIRECTORY TILES — supplied by the owner on 8 August 2026.

     These six are photographs of real machines, which is what separates them
     from the rest of this file: everything else under /media/hubs/ is BotPlanet
     artwork illustrating a category. Four of them show a product BotPlanet
     sells, so they name it. Two show a machine that is not in the catalogue at
     all, and they say so rather than being filed as generic artwork — a
     category tile is allowed to show a machine we do not list, but the register
     has to know which is which or the next person to reach for one of these
     will use it as a product photo.

     None of them is Product-schema eligible even where the model is named,
     because a tile on the homepage is not that product's photograph.
     ------------------------------------------------------------------ */
  {
    ...base("hub-petcam-hero", "depiction"),
    productId: "prod-enabot-rola-petpal",
    purpose: "pet camera hub — homepage tile and hub hero",
    exactModel: "Enabot ROLA PetPal",
    type: "category_hero",
    checksum: "sha256:77bdb4d00af3ca346dc1c6ae4b7d50e37ecf98f3095ecd940746ff7428a57957",
    width: 1490,
    height: 1434,
    src: "/media/hubs/petcam/hero.webp",
    altText:
      "The Enabot ROLA PetPal pet camera robot beside its charging dock, with a phone showing the live view of a kitten.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: true,
  },
  {
    /* The same photograph cropped to the tile. The master is nearly square and
       includes a phone showing the live view; a 3:2 window centred on it cuts
       the phone in half, which reads as a rendering fault rather than a crop.
       This one keeps the robot, both wheels and the dock, and drops the phone
       cleanly. The master stays for surfaces wide enough to show all of it. */
    ...base("hub-petcam-tile", "depiction"),
    productId: "prod-enabot-rola-petpal",
    purpose: "pet camera hub — homepage tile",
    exactModel: "Enabot ROLA PetPal",
    type: "category_hero",
    checksum: "sha256:8f2143365ca76569b50e6632e51de0d922c67378aee1f52172948502edaadb55",
    width: 1401,
    height: 934,
    src: "/media/hubs/petcam/tile.webp",
    altText:
      "The Enabot ROLA PetPal pet camera robot on its wheels beside its white charging dock.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: true,
  },
  {
    ...base("hub-pool-tile", "depiction"),
    /* NOT IN THE CATALOGUE. The machine in this frame is an InverX-badged
       tracked cleaner and BotPlanet lists no InverX. It illustrates the
       category and must never be attached to one of the ten pool products. */
    productId: null,
    purpose: "pool hub — homepage tile",
    exactModel: "InverX tracked pool cleaner (not a BotPlanet catalogue model)",
    type: "category_hero",
    checksum: "sha256:69137944a21ab1ed96cfda187bc0d916879d8c6f483b30c7d36e1ebeffca8094",
    width: 2048,
    height: 1368,
    src: "/media/hubs/pool/tile.webp",
    altText:
      "A tracked robotic pool cleaner resting on a white cover at the edge of a sunlit blue pool.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: true,
  },
  {
    ...base("hub-companion-tile", "illustration"),
    productId: null,
    purpose: "companion hub — homepage tile",
    exactModel: null,
    type: "category_hero",
    checksum: "sha256:81cdc6400370b9841a8f6ca7b933d2ba3b713c2dacf2a89afa4615e1c13eddfb",
    width: 1200,
    height: 900,
    src: "/media/hubs/companion/tile.webp",
    altText:
      "Four rendered companion robots standing together against a pale background, including a robot dog.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-grill-tile", "depiction"),
    /* NOT IN THE CATALOGUE either — the grill category has no published
       products yet, so there is nothing for this to be attached to. */
    productId: null,
    purpose: "grill hub — homepage tile",
    exactModel: "Grillbot automatic grill brush (not a BotPlanet catalogue model)",
    type: "category_hero",
    checksum: "sha256:fa002513051f5cc5c9f773ae6ad65466a2178f1a660ba853a06bb9da8dd1ea01",
    width: 730,
    height: 409,
    src: "/media/hubs/grill/tile.webp",
    altText:
      "A red grill-cleaning robot sitting on stainless steel grill grates between a pair of tongs and a spatula.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: true,
  },
  {
    ...base("hub-companion-hero", "illustration"),
    productId: null,
    purpose: "companion hub — hero",
    exactModel: null,
    type: "category_hero",
    checksum: "sha256:fc6fbaadbf49846fa91cd5abac1d4d3a0348c04573e881de89a677cb29a58fd1",
    width: 1672,
    height: 941,
    src: "/media/hubs/companion/hero.webp",
    altText:
      "A small white companion robot on a side table in a warm lamp-lit living room in the evening.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-companion-card-desk", "illustration"),
    productId: null,
    purpose: "companion hub — card-desk",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:ec3aefc36e568a33d17a90e98cba3c265254e7d53c0c3c4f638b818d034cf2c1",
    width: 1536,
    height: 1024,
    src: "/media/hubs/companion/card-desk.webp",
    altText:
      "A companion robot beside the keyboard on an adult's home desk, a monitor and lamp behind.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-companion-card-child", "illustration"),
    productId: null,
    purpose: "companion hub — card-child",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:c407aae4bd0db6fa618ef044690896d70682996d279277a78cd29d13f0016e58",
    width: 1672,
    height: 941,
    src: "/media/hubs/companion/card-child.webp",
    altText:
      "A companion robot on a child's bedroom rug at child height, wooden blocks scattered around it.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-companion-card-older", "illustration"),
    productId: null,
    purpose: "companion hub — card-older",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:e15a6b6d51834591154a3b1b93a300c60fa5cf8ee64ec05a792d00d2c7391e29",
    width: 1536,
    height: 1024,
    src: "/media/hubs/companion/card-older.webp",
    altText:
      "A companion robot on the side table beside a wing-backed armchair in a warm traditional sitting room.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-companion-row-alone", "illustration"),
    productId: null,
    purpose: "companion hub — row-alone",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:8b93f22bc9e31d44eb2d41d9b8d048f63b9b7b6a7521fe544e1af2350b3a2d7d",
    width: 1536,
    height: 1024,
    src: "/media/hubs/companion/row-alone.webp",
    altText:
      "A companion robot alone on a wooden floor in a quiet lit room.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-companion-row-shelf", "illustration"),
    productId: null,
    purpose: "companion hub — row-shelf",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:375aef9809cfa9335e10656f0e7a683eba42507818e11d204b1eaeb4b5d0afde",
    width: 1536,
    height: 1024,
    src: "/media/hubs/companion/row-shelf.webp",
    altText:
      "A companion robot settled on a bookshelf among books and a framed picture.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-companion-row-speech", "illustration"),
    productId: null,
    purpose: "companion hub — row-speech",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:184a0909f24e08843ed6336ef4331ddd30bdf0dd1bda561d468acaab0984ae46",
    width: 1536,
    height: 1024,
    src: "/media/hubs/companion/row-speech.webp",
    altText:
      "A companion robot with its light ring active and a speech bubble beside it.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-companion-lead-lap", "illustration"),
    productId: null,
    purpose: "companion hub — lead-lap",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:812b6d4e508ccaf457f7d0099edb1f50d9a8af73890f5a036526001b9f21823c",
    width: 1536,
    height: 1024,
    src: "/media/hubs/companion/lead-lap.webp",
    altText:
      "An older person's hands resting on a companion robot held in their lap.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-coding-hero", "illustration"),
    productId: null,
    purpose: "coding hub — hero",
    exactModel: null,
    type: "category_hero",
    checksum: "sha256:5d54464c6922db0dd044148ac7a1263dd4c8f367bf62c4dd49e477cb65451f4d",
    width: 1672,
    height: 941,
    src: "/media/hubs/coding/hero.webp",
    altText:
      "A small coding robot on a kitchen table with a child's hands reaching towards it in daylight.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-coding-card-young", "illustration"),
    productId: null,
    purpose: "coding hub — card-young",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:25db6fea688aa3bec2b98e1c70953564f3b4a0cdb0940ea60ddfb3d8d2e6dd11",
    width: 1448,
    height: 1086,
    src: "/media/hubs/coding/card-young.webp",
    altText:
      "A chunky button-driven toy robot on a table with big directional controls and a set of arrow cards.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-coding-card-middle", "illustration"),
    productId: null,
    purpose: "coding hub — card-middle",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:f21dbf9f7d44e7040fb7a3e8ffa36ef1e03cd6eecb5df967e4f3b033b472bc43",
    width: 1536,
    height: 1024,
    src: "/media/hubs/coding/card-middle.webp",
    altText:
      "A child pressing the top of a small coding robot beside a set of arrow cards, a printed track and two coding books.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-coding-card-teen", "illustration"),
    productId: null,
    purpose: "coding hub — card-teen",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:b7a0968c06943186b548cea78399d3726ec3d8882f76c91416d2c07706171b6b",
    width: 1448,
    height: 1086,
    src: "/media/hubs/coding/card-teen.webp",
    altText:
      "An exposed circuit-board robot kit with jumper wires being assembled at a desk beside a breadboard and laptop.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-coding-row-code", "illustration"),
    productId: null,
    purpose: "coding hub — row-code",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:758f0719b9ddd292d88860ca55f205f1648181471f0817624e0dfabf78c15dc5",
    width: 1536,
    height: 1024,
    src: "/media/hubs/coding/row-code.webp",
    altText:
      "A laptop showing real typed Python beside the coding robot it controls.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-coding-row-shelf", "illustration"),
    productId: null,
    purpose: "coding hub — row-shelf",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:b516dc5729ab81317a7ad6f131211de641061751a237ea853507697d44f827e9",
    width: 1536,
    height: 1024,
    src: "/media/hubs/coding/row-shelf.webp",
    altText:
      "A part-used coding robot on a shelf beside its closed box.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-coding-row-button", "illustration"),
    productId: null,
    purpose: "coding hub — row-button",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:68202ef7150e274311cf61610640b36f9ca621fc421304585564c104f925f7f3",
    width: 1536,
    height: 1024,
    src: "/media/hubs/coding/row-button.webp",
    altText:
      "A child's hand pressing the single large button on a coding robot.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-coding-lead-track", "illustration"),
    productId: null,
    purpose: "coding hub — lead-track",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:e1ea4f7da369b7f8dd8384daa4be3d0360af3a7c190c7abd71eb139f143a2337",
    width: 1536,
    height: 1024,
    src: "/media/hubs/coding/lead-track.webp",
    altText:
      "A coding robot part-way along a black line printed on a paper track.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-grill-hero", "illustration"),
    productId: null,
    purpose: "grill hub — hero",
    exactModel: null,
    type: "category_hero",
    checksum: "sha256:b3cd4f982a91e4a1d00980c64a4cee7ffe50de6f4202591bddb8f4df57ace073",
    width: 1672,
    height: 941,
    src: "/media/hubs/grill/hero.webp",
    altText:
      "A grill-cleaning robot working across the bars of an open barbecue on a patio at dusk, smoke rising around it.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-grill-card-porcelain", "illustration"),
    productId: null,
    purpose: "grill hub — card-porcelain",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:8b44fcf5d2422d11bba747663135aec8889f57f655d5eb16f889cffe6545ed52",
    width: 1448,
    height: 1086,
    src: "/media/hubs/grill/card-porcelain.webp",
    altText:
      "Porcelain-coated grill grates close up, the enamel glossy and dark.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-grill-card-cast-iron", "illustration"),
    productId: null,
    purpose: "grill hub — card-cast-iron",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:23c23d60b8757052de463289d7398aa0e10aaa16a7f48d3c4f6a0b2803a2f683",
    width: 1448,
    height: 1086,
    src: "/media/hubs/grill/card-cast-iron.webp",
    altText:
      "Bare cast iron grill grates close up, matte black and seasoned.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-grill-card-stainless", "illustration"),
    productId: null,
    purpose: "grill hub — card-stainless",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:599df3b01cc9157cf031a3034d9fcadbf377509c8052c42d565967e46eb0ad71",
    width: 1448,
    height: 1086,
    src: "/media/hubs/grill/card-stainless.webp",
    altText:
      "Stainless steel grill bars close up, bright and reflective.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-grill-lead-clean-bars", "illustration"),
    productId: null,
    purpose: "grill hub — lead-clean-bars",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:2cadc5b89f166a047c10ed3da949e5fc5259f643240fd67514abc8d5c1afae35",
    width: 1536,
    height: 1024,
    src: "/media/hubs/grill/lead-clean-bars.webp",
    altText:
      "The clean top surface of a set of grill bars, evenly lit.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },

  /* Editorial page heroes, 8 August 2026. One per best-of and guide.

     These are SCENES, not product shots, and that is the whole point of them:
     a best-of page's hero shows the job the reader wants doing rather than a
     machine the page is about to rank. Nothing here depicts a specific model,
     so none of them enters Product schema. */
  {
    ...base("hero-editorial-best-robotic-pool-cleaners", "illustration"),
    productId: null,
    purpose: "Best robotic pool cleaners page hero",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:66bb0120fe367561c6cd13b428450ad410e77998fc9c46b99d9fbc2c2d294ef1",
    width: 1536,
    height: 1024,
    src: "/media/editorial/best-robotic-pool-cleaners.webp",
    altText:
      "A tracked robotic pool cleaner working the floor of a large lit in-ground pool at dusk, a modern house glowing behind it.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("hero-editorial-best-cordless-pool-cleaners", "illustration"),
    productId: null,
    purpose: "Best cordless robotic pool cleaners page hero",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:333edf0e824763633cd5d68b72603e5f4253c2e8df84ec717828e8dbf1126f23",
    width: 1672,
    height: 941,
    src: "/media/editorial/best-cordless-pool-cleaners.webp",
    altText:
      "A hand lifting a tracked pool cleaner clear of a lit pool at night, water streaming off it and no cable anywhere in the frame.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("hero-editorial-above-ground-pool-cleaners", "illustration"),
    productId: null,
    purpose: "Robotic pool cleaners for above-ground pools page hero",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:41bc95085631de1fc836e13c19bf11989e1edb562c470e6e23d773c945b30ce1",
    width: 1672,
    height: 941,
    src: "/media/editorial/above-ground-pool-cleaners.webp",
    altText:
      "A white pool cleaner at the foot of the curved vinyl-liner wall of an above-ground pool in afternoon light, garden furniture behind.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("hero-editorial-pool-cleaner-comparison", "illustration"),
    productId: null,
    purpose: "Pool cleaner comparison page hero",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:f70e68e4f4d2ff2803ac986a6dbeb994adcc43c519397fbfb475f8a2d93b29b0",
    width: 1672,
    height: 941,
    src: "/media/editorial/pool-cleaner-comparison.webp",
    altText:
      "Two unbranded robotic pool cleaners side by side on wet poolside stone at sunset, evenly lit with neither favoured.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("hero-editorial-are-pool-cleaners-worth-it", "illustration"),
    productId: null,
    purpose: "Are robotic pool cleaners worth it? page hero",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:8bd3033072c7d71a19e7afca42665528c788b80191467924f6d93383e1abe8d6",
    width: 1672,
    height: 941,
    src: "/media/editorial/are-pool-cleaners-worth-it.webp",
    altText:
      "A still, spotless infinity pool at sunrise with a robotic cleaner at rest on the step, the job already done.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("hero-editorial-wire-free-mowers", "illustration"),
    productId: null,
    purpose: "Wire-free robot lawn mowers page hero",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:02521697030d9e7884e93d8932252bf173dca70ba623d230184e948712abd401",
    width: 1672,
    height: 941,
    src: "/media/editorial/wire-free-mowers.webp",
    altText:
      "A robot mower at the edge of a flower bed on unmarked lawn with no boundary wire visible anywhere, an antenna on a post behind.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("hero-editorial-cheap-mowers", "illustration"),
    productId: null,
    purpose: "Cheap robot lawn mowers page hero",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:8bcc7f67ac56c9e10e7e2fed14524d77f4cd2f50f38214697d396d0f3f872578",
    width: 1672,
    height: 941,
    src: "/media/editorial/cheap-mowers.webp",
    altText:
      "A small plain robot mower on an ordinary suburban back lawn beside a pebbledashed house and a wooden bench, deliberately unglamorous.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("hero-editorial-mowers-for-hills", "illustration"),
    productId: null,
    purpose: "Robot lawn mowers for hills page hero",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:b066ccca07dee9b3969bc64b881781702713a4dd2f1ccef50fa8b5088faeabe4",
    width: 1672,
    height: 941,
    src: "/media/editorial/mowers-for-hills.webp",
    altText:
      "A robot mower part-way up a visibly steep grass bank shot from below so the gradient reads, a house at the top and woodland beyond.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("hero-editorial-robotic-pets-for-elderly", "illustration"),
    productId: null,
    purpose: "Robotic pets for elderly relatives page hero",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:6d628e8b65a6cf95487e30c793548f18ab1c9c7fbe9a33eb64668b89eba5d9dd",
    width: 1672,
    height: 941,
    src: "/media/editorial/robotic-pets-for-elderly.webp",
    altText:
      "An older person's hands resting on a white robotic cat curled in their lap in a warm lamp-lit sitting room, no face in frame.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("hero-editorial-best-window-robots", "illustration"),
    productId: null,
    purpose: "Best window cleaning robots page hero",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:15fe6fec178252181eb0391d07faf2f5f9a6708c1938784f2408a0a0be81ad41",
    width: 1672,
    height: 941,
    src: "/media/editorial/best-window-robots.webp",
    altText:
      "A window cleaning robot part-way down a tall pane with its safety tether running up out of frame, a city skyline and river beyond.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    /* THE ONE SLOT THE 11 AUGUST DROP LEFT EMPTY, filled the same day.
       Until this landed, /best-robots/robotic-lawn-mowers/ was rendering the
       lawn HUB's hero — two different pages showing one picture, which is the
       single thing artwork is not supposed to do.

       IT IS NIGHT, AND THE BRIEF ASKED FOR LATE MORNING. The rule the brief
       was actually enforcing was "not the hub's light", because the hub owns a
       flat lawn at golden hour and the two had to stop looking alike. Night on
       a mountainside above a lake differentiates harder than daylight would
       have, and robot mowers genuinely do run after dark — quietly, which is
       half their argument. Kept as supplied.

       THE SLOPE IS THE POINT. This page rules machines out on two numbers, and
       gradient is the one that eliminates four of the six. A hero showing a
       machine holding a bank steep enough to think twice about says what the
       page says before a word is read.

       GENERIC ON PURPOSE, and this is why it is `illustration` rather than a
       depiction: the page ranks six mowers, so a recognisable machine at the
       top would be one brand's photograph heading a page about its rivals. The
       machine here carries no badge and no model lettering, and nothing but
       our own wordmark is set into the pixels — no year, no price, no claim. */
    ...base("hero-editorial-best-lawn-mowers", "illustration"),
    productId: null,
    purpose: "Best robot lawn mowers page hero",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:ffefe8c417ad3ec7a58823303a7b7b82a95c5ca68b2a6ff433096b73e016aa5b",
    width: 1671,
    height: 941,
    src: "/media/editorial/best-lawn-mowers.webp",
    altText:
      "An unbadged silver robot mower working across a steep grass bank at " +
      "night with its headlamps on, the slope falling away to a lit lakeside " +
      "town and mountains far below, and a modern glass house above it.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("hero-editorial-do-window-robots-work", "illustration"),
    productId: null,
    purpose: "Do window cleaning robots work? page hero",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:f11f917bd012ab9e0f2fb552b8d6d7e0407a3a7c56259101aa36c63973e5223f",
    width: 1672,
    height: 941,
    src: "/media/editorial/do-window-robots-work.webp",
    altText:
      "A wide window half cleaned, the left side still hazy with rain marks and dust and the right side clear onto a city skyline, the robot sitting on the boundary between them.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },

  {
    ...base("og-botplanet-default"),
    productId: null,
    purpose: "Site-wide Open Graph and Twitter card",
    exactModel: null,
    type: "open_graph",
    // Verified against the committed file; a silent edit changes this hash and
    // fails the checksum test rather than shipping with a stale asset record.
    checksum: "sha256:352afbf36c62cbd236ced8fa31c14e07fe6df4e0c9a22232cff5cfbf38f7cf96",
    width: 1200,
    height: 630,
    src: "/og/botplanet-default.png",
    altText: "BotPlanet — shop real-world robots with clearer comparisons and evidence",
    altTextStatus: "approved",
    schema: { ...ORIGINAL_SCHEMA, reason: "brand card, not a product photograph" },
    depictsRealProduct: false,
    notes: "An SVG source (/og/botplanet-default.svg) is versioned alongside the PNG that social platforms require.",
  },
  {
    ...base("hero-category-pool"),
    productId: null,
    purpose: "Robotic pool cleaners category hero",
    exactModel: null,
    type: "category_hero",
    checksum: null,
    width: null,
    height: null,
    src: "components/diagrams/CategoryHero.astro",
    altText: "",
    altTextStatus: "decorative",
    schema: { ...ORIGINAL_SCHEMA, productImage: false, reason: "decorative brand artwork rendered as inline SVG; it illustrates the category and depicts no product" },
    depictsRealProduct: false,
    notes: "Rendered as an inline Astro component, so it has no intrinsic file dimensions and needs no responsive derivatives.",
  },
  ...(
    [
      ["hero-home-desktop", "/media/home/hero-desktop.webp", 1672, 941, "sha256:ce8f54daae0b0f6f71a1eb087a47b22e2b128846cd95dcd58d77af2374728f28"],
      ["hero-home-mobile", "/media/home/hero-mobile.webp", 941, 1672, "sha256:fed2c212c664eb81cdacd759cf827d48fd9b521a60b3f18d6b3a5c97a0449ae6"],
    ] as const
  ).map(([id, src, width, height, checksum]): MediaAssetRecord => ({
    ...base(id),
    productId: null,
    purpose: "Homepage hero",
    exactModel: null,
    type: "category_hero",
    checksum,
    width,
    height,
    src,
    altText:
      "A night-time home where six kinds of robot are working at once: a pool cleaner in the water, a window cleaner on the glass, a mower on the lawn, a vacuum on the terrace, a four-legged patrol robot and a companion robot at the door, beneath the BotPlanet logo and the Earth.",
    altTextStatus: "approved",
    // The machines in the frame are rendered generics, not catalogue models, so
    // this illustrates the category set without depicting any product we sell.
    schema: {
      ...ORIGINAL_SCHEMA,
      reason:
        "original brand artwork showing generic machines of each category; it may illustrate the page and preview socially, but depicts no product in the catalogue and is never a Product image",
    },
    depictsRealProduct: false,
    presentation: "bleed",
    notes: "Owner-created, supplied 3 August 2026. Both are authored compositions, not crops — the portrait version is recomposed so all six machines survive on a phone, which a centre crop of the wide file could not do.",
  })),
  ...(
    [
      ["botmatch-explainer-desktop", "/media/botmatch/explainer-desktop.webp", 1672, 941, "sha256:0d914ba007ccd6197e5be035a2cc68d81e4206af5e6bcec13a8116e20ca83674"],
      ["botmatch-explainer-mobile", "/media/botmatch/explainer-mobile.webp", 941, 1672, "sha256:491cc7596cc3902713eb180e662e839a9c505bed917ffdd37b24ec0380ad98fe"],
    ] as const
  ).map(([id, src, width, height, checksum]): MediaAssetRecord => ({
    ...base(id),
    productId: null,
    purpose: "BotMatch explainer on the homepage",
    exactModel: null,
    type: "promotional_panel",
    checksum,
    width,
    height,
    src,
    altText:
      "A BotMatch panel at the centre of six linked category tiles — pool cleaning, window cleaning, floor care, lawn and garden, security, and companion and service — showing a best-match result being confirmed.",
    altTextStatus: "approved",
    schema: {
      ...ORIGINAL_SCHEMA,
      imageObject: false,
      articleImage: false,
      reason:
        "an interface illustration of BotPlanet's own tool, not editorial content about a product; it may preview socially but must not be emitted as an ImageObject supporting the article",
    },
    depictsRealProduct: false,
    presentation: "bleed",
    notes:
      "Owner-created, supplied 3 August 2026 as a composed desktop/mobile pair. It shows all six categories linked to the matcher; only pool cleaners is live, so the copy beside it must keep saying so — see the section note on the homepage.",
  })),
  /* Homepage category feature artwork. Every one of these is decorative: the
     section's headline, body and buttons are real HTML beside the picture, so
     described alt text would be the same fact told twice. Each file is composed
     with one side dark and empty for the copy — the note records which. */
  ...(
    [
      [
        "feature-pool-category-desktop",
        "/media/pool-category/feature-desktop.webp",
        1672,
        941,
        "sha256:d7e557392590cb1330b44fb75a3a77bde5a39cbe39b480916877d4cfb2df9688",
        "Robotic pool cleaners",
        "Composed with the left third dark and empty. The robot is a rendered generic, deliberately not any brand's model.",
      ],
      [
        "feature-pool-category-mobile",
        "/media/pool-category/feature-mobile.webp",
        857,
        1588,
        "sha256:7802a1cb1b9ba5556fce972a15d4f197418f1993b5e9810b1415515b39a4fcba",
        "Robotic pool cleaners",
        "The portrait companion to the desktop file, supplied later than the rest. Composed for the phone layout: empty upper half for the copy, the machine in the lower half. Inset 42px on every edge from the supplied file, which carried a drawn silver frame a few pixels in from the border — that would have shown as a broken hairline once the picture reaches the plate's edge. Nothing else is altered.",
      ],
      [
        "feature-window-category-desktop",
        "/media/window-category/feature-desktop.webp",
        1672,
        941,
        "sha256:bfcff7b089dd84af0fce770d37a4a5aceb788c47296ebf5ebac75a548463c034",
        "Window-cleaning robots",
        "Composed with the right side open sky, so the copy sits there. The machine is a rendered generic, deliberately not any brand's model.",
      ],
      [
        "feature-window-category-mobile",
        "/media/window-category/feature-mobile.webp",
        857,
        1588,
        "sha256:629d66d2a6d0ea3f848e1edbc5f56da2e04cbc6049371760401009b1e21bc425",
        "Window-cleaning robots",
        "Replaced 3 August 2026 with a version composed for the phone layout: empty upper half, the machine in the lower half so it survives the crop. Inset 42px on every edge from the supplied file, which carried a drawn silver frame a few pixels in from the border. Nothing else is altered.",
      ],
      [
        "feature-lawn-category-desktop",
        "/media/lawn-category/feature-desktop.webp",
        1672,
        941,
        "sha256:7d85dcab488132d6bf5ca8cc7a3db7e6813cbadbe5cf182cb44c177ac93efb26",
        "Lawn and garden robots",
        "Composed with the left third falling to black, so the copy sits there. The mower is a rendered generic, deliberately not any brand's model.",
      ],
      [
        "feature-lawn-category-mobile",
        "/media/lawn-category/feature-mobile.webp",
        857,
        1588,
        "sha256:4060220ccf0869be9ee8f57db1b0ed6fd948635e1f58b0c6c71913538977e8db",
        "Lawn and garden robots",
        "Replaced 3 August 2026 with a version composed for the phone layout: empty upper half, the mower and the lit garden in the lower half so they survive the crop. Inset 42px on every edge from the supplied file, which carried a drawn silver frame a few pixels in from the border. Nothing else is altered.",
      ],
      [
        "feature-floor-category-desktop",
        "/media/floor-category/feature-desktop.webp",
        1672,
        941,
        "sha256:3648b46b2142cbcb99c9a884e95a08f3ba548c1dcca0ef6763369316a2e55abc",
        "Robotic floor cleaners",
        "Composed with the right side an unlit wall, so the copy sits there. The vacuum is a rendered generic, deliberately not any brand's model.",
      ],
      [
        "feature-floor-category-mobile",
        "/media/floor-category/feature-mobile.webp",
        857,
        1588,
        "sha256:f60926001531dcb8967099fb8596a21d26ad57acdfe6a54fa6ef4fb5594f0da4",
        "Robotic floor cleaners",
        "Replaced 3 August 2026 with a version composed for the phone layout: empty upper half, the machine and the lit room in the lower half so they survive the crop. Inset 42px on every edge from the supplied file, which carried a drawn silver frame a few pixels in from the border. Nothing else is altered.",
      ],
      [
        "feature-security-category-desktop",
        "/media/security-category/feature-desktop.webp",
        1672,
        941,
        "sha256:7a23406ed918620f7f49e8f72d470ca7fea6c59dee5de9bfb1cc7c95c9e01c3e",
        "Security robots",
        "Composed with the left half falling to black, so the copy sits there. The patrol robot is a rendered generic, deliberately not any brand's model.",
      ],
      [
        "feature-security-category-mobile",
        "/media/security-category/feature-mobile.webp",
        857,
        1588,
        "sha256:6c0db37f462a87b84684ac4c6a87b689df07eb73cf082f727257ed92426a7b86",
        "Security robots",
        "Replaced 3 August 2026 with a version composed for the phone layout: empty upper half, the patrol robot and the lit approach in the lower half so they survive the crop. Inset 42px on every edge from the supplied file, which carried a drawn silver frame about eight pixels in from the border. Nothing else is altered.",
      ],
      [
        "feature-companion-category-desktop",
        "/media/companion-category/feature-desktop.webp",
        1612,
        881,
        "sha256:06aeafc3a716c0863e733e8b71c43d0f78a154bd9bcf5fd33b71a2fc90dc9400",
        "Companion and service robots",
        "Composed with the left half falling to black, so the copy sits there. Inset 30px on every edge from the supplied file: the original carried a thin blue frame drawn a few pixels in from the border, which would have shown as a broken hairline once the picture bleeds to the section edges. Nothing else is altered and the aspect ratio is untouched beyond that inset.",
      ],
      [
        "feature-companion-category-mobile",
        "/media/companion-category/feature-mobile.webp",
        857,
        1588,
        "sha256:7d7c2853c0ad501b5fdf83a81d23587c3e784969798372063fa39f9a93d7d52c",
        "Companion and service robots",
        "Replaced 3 August 2026 with a version composed for the phone layout: empty upper half, the robot and the lit room in the lower half so they survive the crop. Inset 42px on every edge from the supplied file, which carried a drawn silver frame a few pixels in from the border. Verified clean by scripts/check-drawn-frame.mjs. Nothing else is altered.",
      ],
    ] as const
  ).map(([id, src, width, height, checksum, category, note]): MediaAssetRecord => ({
    ...base(id),
    productId: null,
    purpose: `${category} feature section on the homepage`,
    exactModel: null,
    type: "category_hero",
    checksum,
    width,
    height,
    src,
    altText: "",
    altTextStatus: "decorative",
    schema: {
      ...ORIGINAL_SCHEMA,
      productImage: false,
      reason:
        "decorative section artwork showing a generic machine; it illustrates the category and depicts no product in the catalogue",
    },
    depictsRealProduct: false,
    presentation: "bleed",
    notes: `Owner-created, supplied 3 August 2026. ${note}`,
  })),
  {
    ...base("promo-botmatch-pool"),
    productId: null,
    purpose: "BotMatch promotional panel on the robotic pool cleaners category page",
    exactModel: null,
    type: "promotional_panel",
    checksum: "sha256:8624684735bcdf34705ee45c7289987780897e0fd5d9b6127207384eada19485",
    width: 941,
    height: 1672,
    src: "/media/matcher/pool-bot-matcher.webp",
    altText:
      "Find your perfect pool bot. Tell us your budget, pool size or priorities like fast shipping, and in 30 seconds we will match you with the right robotic pool cleaner. Start the 30-second match.",
    altTextStatus: "approved",
    // The robot in the frame is a rendered generic machine, not a model we
    // sell, so this panel makes no claim about any product in the catalogue.
    schema: {
      ...ORIGINAL_SCHEMA,
      imageObject: false,
      articleImage: false,
      reason:
        "a promotional panel is advertising, not editorial illustration; it may serve as a social preview but must not be emitted as an ImageObject supporting the article's content",
    },
    depictsRealProduct: false,
    presentation: "bleed",
    notes:
      "Owner-created, supplied 3 August 2026 as a 941×1672 PNG and converted to WebP with no crop or recolour. RETIRED FROM RENDER on 3 August 2026: the headline, body copy and button are drawn into the artwork, which makes every word of the offer invisible to search and turns the button into a picture of a button. The BotMatch panel now renders real copy and a real link beside text-free artwork. The record is kept because the file is BotPlanet's own work and may be reused as a social card, where baked-in type is the right choice.",
  },
  {
    ...base("silhouette-generic-robot", "placeholder"),
    productId: null,
    purpose: "Generic robot silhouette used inside product-card media stages",
    exactModel: null,
    type: "branded_placeholder",
    checksum: null,
    width: null,
    height: null,
    src: "components/RobotSilhouette.astro",
    altText: "",
    altTextStatus: "decorative",
    schema: PLACEHOLDER_SCHEMA,
    depictsRealProduct: false,
    notes: "Deliberately generic geometry. It is never described as a photograph and never attached to a single model.",
  },
  ...(
    [
      /* dgm-pool-zones (components/PoolDiagram.astro) WAS HERE and was removed
         on 9 August 2026 with the component. It drew the same pool cross-section
         as dgm-coverage below, less well and with its styling inlined instead of
         using the shared .dgm idiom — two records for one idea, and the older of
         the two rendered on no page. Keeping a registry entry for a picture the
         site does not publish makes MEDIA_ASSETS lie about what BotPlanet shows,
         which is the one thing this file is for. */
      ["dgm-coverage", "components/diagrams/CoverageZones.astro", "Pool cross-section highlighting floor, wall and waterline cleaning zones"],
      ["dgm-corded-cordless", "components/diagrams/CordedVsCordless.astro", "Diagram comparing corded and cordless robotic pool cleaners"],
      ["dgm-size-shape", "components/diagrams/PoolSizeShape.astro", "Diagram showing how pool size and shape affect robot suitability"],
      ["dgm-botmatch", "components/diagrams/BotMatchExplainer.astro", "Diagram of how BotMatch produces a deterministic suitability result"],
      /* Added 9 August 2026, the day the four above were found rendering on no
         page at all. Every entry in this block now has exactly one home, and
         test/diagrams.test.ts fails if a new one is registered without one. */
      ["dgm-slope", "components/diagrams/SlopePercentDegrees.astro", "Right-angled triangle showing that a slope rated at 45 percent is about 24 degrees, with the equivalent degrees for the ratings mowers are sold on"],
      ["dgm-window-adhesion", "components/diagrams/WindowAdhesion.astro", "Cross-section of a window-cleaning robot on glass showing the vacuum seal, the battery backup and the safety line, in the order they hold it up"],
      ["dgm-boundary", "components/diagrams/BoundaryMethods.astro", "The same garden bounded three ways — buried wire, satellite RTK and camera vision — with what each method needs and where each one fails"],
      ["dgm-window-edges", "components/diagrams/WindowEdgeReach.astro", "A window pane showing the centre a robot cleans well, the border band that gets least contact because the machine turns before the frame, and the corners that get least of all"],
      ["dgm-mowing-cadence", "components/diagrams/MowingCadence.astro", "Two weeks of grass height compared: one long cut on one day against a short cut on most days, showing that a mower's area rating is a weekly figure"],
      ["dgm-litter-cycle", "components/diagrams/LitterCycleSafety.astro", "The interlock cycle of an automatic litter box, with the two failure modes marked: a cat below the sensor's minimum, and a cat detected perfectly that still does not fit the chamber"],
    ] as const
  ).map(([id, src, alt]): MediaAssetRecord => ({
    ...base(id),
    productId: null,
    purpose: "Educational diagram",
    exactModel: null,
    type: "educational_diagram",
    checksum: null,
    width: null,
    height: null,
    src,
    altText: alt,
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    notes: "Inline SVG component: no file, no derivatives, no layout shift.",
  })),
];

/* ------------------------------------------------------------------ */
/* Owner-created product creatives                                     */
/* ------------------------------------------------------------------ */

/**
 * Danny's own artwork for five pool robots, supplied 3 August 2026.
 *
 * These are NOT placeholders and NOT product photography. Each is a finished
 * BotPlanet composition: the robot in a scene, with BotPlanet branding and
 * headline text set into the image. That distinction drives three decisions:
 *
 *  - `depictsRealProduct` is true, so the "MEDIA PENDING" treatment that hides
 *    placeholders does not apply and the card renders the artwork;
 *  - `productImage` is false, because a search engine reading Product schema
 *  - `presentation` is "bleed", because the composition is the whole frame.
 *    Cropping one to a 4:3 card would cut the model name off the top.
 *
 * The claims printed inside the artwork ("up to 2.5 hours of runtime", "3µm
 * MicroMesh filter") are brand copy. They carry no evidence weight here: any
 * specification that appears as body copy still needs its own evidence record,
 * exactly as it would if the artwork did not exist.
 *
 */
const OWNER_ARTWORK_SCHEMA: SchemaEligibility = DEPICTION_SCHEMA;

interface OwnerArtwork {
  slug: string;
  file: string;
  checksum: string;
  width: number;
  height: number;
  /** What the composition actually shows, beyond the robot itself. */
  scene: string;
}

const OWNER_ARTWORK: OwnerArtwork[] = [
  {
    slug: "dolphin-nautilus-cc-plus",
    file: "dolphin-nautilus-cc-plus.webp",
    checksum: "sha256:4bf32f1eb3d1918a24ca79b85edd80c58a08e9b4e32976de0cfb86ecd39855fe",
    width: 1122,
    height: 1402,
    scene:
      "the black and blue cleaner lifting out of dark water beside a phone showing the Dolphin app, over icons for Wi-Fi control, wall climbing and top-load filter access",
  },
  {
    slug: "polaris-freedom",
    file: "polaris-freedom.webp",
    checksum: "sha256:a224297287dffbe25f8b55206705dc2a1eb062083d48fcf2c7a5fa4675b0ea4b",
    width: 1200,
    height: 1200,
    scene:
      "the blue tracked cordless cleaner in shallow water beside a phone showing the Polaris app, with callouts for cordless running, four cleaning modes, navigation and the top-load filter",
  },
  {
    slug: "betta-se-plus",
    file: "betta-se-plus.webp",
    checksum: "sha256:eb452fb8b81bec8339ccd0b8a99d19daf82eb7886141e56a10cdf068a632b890",
    width: 1200,
    height: 1200,
    scene:
      "the solar-panelled surface skimmer floating on a leaf-strewn pool in a sunlit garden, with callouts for continuous surface cleaning, solar charging, dual charging and shallow-water safeguarding",
  },
  {
    slug: "dolphin-proteus-dx4-plus",
    file: "dolphin-proteus-dx4-plus.webp",
    checksum: "sha256:1fe618cc48b9c5f80eb025f1fc81176646415fb563d6d7a85d650da5a5353052",
    width: 1200,
    height: 1200,
    scene:
      "the grey and blue tracked cleaner resting on stone coping beside a curved pool at dusk, with callouts for navigation, wall and waterline cleaning and top-load filtration",
  },
  {
    slug: "aiper-scuba-s1",
    file: "aiper-scuba-s1.webp",
    checksum: "sha256:147316cbcc6b17b06f23b0f71ff8399b6492973a9b399d1a95ad77184f15ee05",
    width: 1402,
    height: 1122,
    scene:
      "the grey and black tracked cleaner on wet paving beside a lit pool at night, with a phone showing the Aiper app mid-cycle and callouts for navigation, suction, waterline cleaning, filtration and battery life",
  },
  {
    // The file name follows the product ID, as every file here does. What it
    // DEPICTS is the BuBlue that this record now holds — see product-names.ts.
    slug: "dolphin-premier",
    file: "dolphin-premier.webp",
    checksum: "sha256:d423972cffdbc682bf25b7818e173edd33271322930f1022b8c0f18cbca06c56",
    width: 1402,
    height: 1122,
    scene:
      "the grey corded cleaner on its caddy at the poolside at night, lit blue along its front edge, with a phone showing the BuBlue app and callouts for suction, navigation, runtime, filtration and app control",
  },
  {
    slug: "aiper-scuba-x1",
    file: "aiper-scuba-x1.webp",
    checksum: "sha256:b61a0d6a69177adb170f8550f7f21a9c6ba10857f6c7f61b943c3f0de44ec496",
    width: 1402,
    height: 1122,
    scene:
      "the grey and black cleaner on its dock at the poolside at night, 'SCUBA X1 Pro Max' printed on its front, with a phone showing the Aiper app and callouts for suction, surface skimming, navigation, filtration and runtime",
  },
  {
    slug: "aiper-seagull-se",
    file: "aiper-seagull-se.webp",
    checksum: "sha256:8a2ea0d26ab0dc08090cb46927106f189c210fc8111fd62347ab53dcd8142f2d",
    width: 1254,
    height: 1254,
    scene:
      "the compact grey cleaner on poolside paving next to its retrieval hook, 'SEAGULL SE' on the carry handle, with callouts for cordless running, self-parking, easy retrieval and a compact build",
  },
  {
    slug: "beatbot-aquasense-2-ultra",
    file: "beatbot-aquasense-2-ultra.webp",
    checksum: "sha256:ed6e41162f96875cda3a335032630e6bf24fa2a5fec5fb32094c681edd8aaa6f",
    width: 1254,
    height: 1254,
    scene:
      "the dark grey cleaner tilted on its dock beside a lit infinity pool at dusk, with a phone showing the AquaSense 2 Ultra app mid-cycle and callouts for app control, floor, wall and waterline cleaning, cordless running and navigation",
  },
  {
    slug: "wybot-c1",
    file: "wybot-c1.webp",
    checksum: "sha256:c6fcc066410578e897e331420bd6eb82e5eaeab4970d97167aa578b5fab71b0b",
    width: 1254,
    height: 1254,
    scene:
      "the black and silver tracked cleaner on stone paving beside a lit pool at dusk, with a phone showing the WYBOT app and callouts for app control, floor, wall and waterline cleaning, cordless running and navigation",
  },
  {
    slug: "aiper-scuba-v3-ai-vision",
    file: "aiper-scuba-v3-ai-vision.webp",
    checksum: "sha256:e32fc4d8cd4bab2736e61c45800795c191d054015c108af0a8e0a362ec723c19",
    width: 1200,
    height: 1200,
    scene:
      "the black cordless cleaner on its charging dock beside a lit resort pool, with callouts for camera navigation, wireless charging, weight, filtration and floor, wall and waterline cleaning",
  },
  {
    /* THE FIRST WINDOW CREATIVE, 7 August 2026, and the first artwork on this
       site for a product outside the pool catalogue.

       PROVENANCE, RECORDED AS IT WAS GIVEN. Supplied by the owner through the
       Notion image-request page and confirmed by the owner as their own work
       when I queried it. Two of the four files in that batch carry ECOVACS
       branding and typography rather than BotPlanet's; the owner's answer was
       that all four are theirs, and the registry records what the owner
       states. This note exists so the basis of that claim is legible later
       rather than inferred from a tier name. */
    slug: "ecovacs-winbot-w2-pro-omni",
    file: "ecovacs-winbot-w2-pro-omni.webp",
    checksum: "sha256:edaa447e38423f59ad0b7dd991d7c3a334fe44ca82dbdba6870dd8d98baf8fc5",
    width: 1254,
    height: 1254,
    scene:
      "the white square robot on a floor-to-ceiling window above a lit terrace at dusk, its cable running down to the portable station on the floor, with callouts for intelligent window cleaning, the power station, the safety tether and edge detection",
  },
  /* The remaining seven window products, 8 August 2026. Every one of these is
     the card slot only — the figures that go inside each review are in
     REVIEW_FIGURES below. Two of the seven print a number this site does not
     accept: the W2 PRO card says twelve-stage protection where ECOVACS gives
     this model ten, and the Cop Rose card says app control on a machine our
     review describes as remote-only. Both are corrected where a reader meets
     them, in the review prose and in the figure captions, rather than by
     dropping the artwork. */
  {
    /* UNMERGED 8 August 2026. These six files were set aside on the first pass
       because the W3 Omni 301'd to the W2 PRO Omni and artwork naming a product
       with no page cannot be published. The product has its page back, so the
       artwork is back with it. */
    slug: "ecovacs-winbot-w3-omni",
    file: "ecovacs-winbot-w3-omni.webp",
    checksum: "sha256:008a91e00b4f369d14cdff6d608985e87abb51769533709d59a631f9a21f0e5d",
    width: 1254,
    height: 1254,
    scene:
      "the white square robot on a floor-to-ceiling window at dusk with its cable running down to the round-doored station on the floor, beside callouts for the three-nozzle spray, water pressure, spray coverage, the safety system and path planning",
  },
  {
    slug: "ecovacs-winbot-w2-pro",
    file: "ecovacs-winbot-w2-pro.webp",
    checksum: "sha256:89a4278a350b924a7963af5718ba6f790cdd93ea0fea7ba18681b593df42e8b0",
    width: 1122,
    height: 1402,
    scene:
      "the white square robot high on a city window at dusk with spray leaving its side, beside callouts for thorough cleaning, a twelve-stage safety system, intelligent navigation, quiet running and app control",
  },
  {
    slug: "ecovacs-winbot-w1-pro",
    file: "ecovacs-winbot-w1-pro.webp",
    checksum: "sha256:eaa1d90ec06849b50370ab4713c8fee10a9a061c6125873f22077b724b9a03d9",
    width: 1122,
    height: 1402,
    scene:
      "the white and tan robot stood on a dark plinth with its twin cables hanging, beside callouts for safety, efficiency, innovation and quality and a strip naming the tether, suction, path planning and edge detection",
  },
  {
    slug: "hobot-2s",
    file: "hobot-2s.webp",
    checksum: "sha256:1bf7399c4de19153b220b3b49ce839c5d396daeee4fcde5b2999ab2482b5bbf7",
    width: 1122,
    height: 1402,
    scene:
      "a person reaching up to press the button on the white robot held to a floor-to-ceiling window at night, spray leaving both sides, above callouts for one-touch start, dual spray and simple controls",
  },
  {
    slug: "hobot-298",
    file: "hobot-298.webp",
    checksum: "sha256:f9f0d81b886b0e9f9a63c3a385168b2133ee494046657f6bc4fd43e306272859",
    width: 1448,
    height: 1086,
    scene:
      "the white robot with its blue-capped tank held to a tall window at night above a lit city, in a dark room with a sofa behind",
  },
  {
    slug: "hutt-s55-pro",
    file: "hutt-s55-pro.webp",
    checksum: "sha256:22c120b75a7ea193ae7ec3186e7817eade5d14c844d1cda8664a4a2f98350524",
    width: 1448,
    height: 1086,
    scene:
      "the white peanut-shaped robot with a blue water tank held to a night window, its remote control and three spare pad sets beside it, above badges reading 3800Pa and an 80ml tank",
  },
  {
    slug: "mamibot-w120-dp",
    file: "mamibot-w120-dp.webp",
    checksum: "sha256:05ab496196958adac627bf4329c5caac2eb8019bdbf29d7ae849ca090593d81d",
    width: 1254,
    height: 1254,
    scene:
      "the white robot with an orange handle strap held to a floor-to-ceiling window with spray leaving both sides, beside callouts for spray coverage, 55N suction, path planning and streak-free results",
  },
  {
    slug: "cop-rose-x5s",
    file: "cop-rose-x5s.webp",
    checksum: "sha256:7761480e6a7b2f032605aa2078b3c807bf43dc66715957d083de5443423a85a7",
    width: 1254,
    height: 1254,
    scene:
      "the white and green robot angled against a night city window with spray beneath it, its remote control and a phone running the app alongside, beside callouts for app and remote control, spray, edge-to-edge cleaning and suction",
  },
];

/**
 * The exact model an asset depicts.
 *
 * The verification ledger is the first source and stays the first source: a
 * model name taken from a file name can quietly move artwork onto a sibling
 * product, which is the failure this lookup was written to prevent.
 *
 * THE FALLBACK EXISTS BECAUSE THE LEDGER IS POOL-ONLY. Window products are
 * verified through reviews.ts instead, so every window asset resolved to
 * `null` and would have shipped alt text reading "BotPlanet artwork for the
 * null". Caught on 7 August 2026 when the first window creatives arrived.
 * The catalogue name is a weaker source than a verification record and it is
 * used only when there is no verification record at all.
 */
const modelFor = (productId: string, slug: string): string | null =>
  VERIFICATIONS.find((v) => v.productId === productId)?.identity.canonicalName ??
  CATALOGUE_NAMES[slug] ??
  null;

/**
 * Names for products whose editorial lives in reviews.ts rather than in the
 * verification ledger. Kept explicit rather than derived from a review title,
 * because a title is copy and copy gets rewritten.
 */
const CATALOGUE_NAMES: Record<string, string> = {
  "ecovacs-winbot-w2-pro-omni": "ECOVACS WINBOT W2 PRO Omni",
  "ecovacs-winbot-w3-omni": "ECOVACS WINBOT W3 Omni",
  "ecovacs-winbot-w2-pro": "ECOVACS WINBOT W2 PRO",
  "ecovacs-winbot-w2s": "ECOVACS WINBOT W2S",
  "ecovacs-winbot-w1-pro": "ECOVACS WINBOT W1 PRO",
  "ecovacs-winbot-mini": "ECOVACS WINBOT Mini",
  "hobot-2s": "HOBOT-2S",
  "hobot-298": "HOBOT-298",
  "hutt-s55-pro": "HUTT S55 Pro",
  "mamibot-w120-dp": "Mamibot W120-DP",
  "cop-rose-x5s": "Cop Rose X5S",
};

export const OWNER_PRODUCT_ARTWORK: MediaAssetRecord[] = OWNER_ARTWORK.map((a): MediaAssetRecord => {
  const productId = PRODUCT_ID[a.slug] ?? `prod-${a.slug}`;
  // The model name comes from the verification record, never from the file
  // name, so a renamed file can never quietly move artwork onto a sibling model.
  const model = modelFor(productId, a.slug);
  return {
    ...base(`art-${a.slug}`, "depiction"),
    productId,
    purpose: null,
    exactModel: model,
    type: "product_hero",
    checksum: a.checksum,
    width: a.width,
    height: a.height,
    src: `/media/products/${a.file}`,
    // The alt text describes what is in the frame and names the model. It does
    // not repeat the sales claims printed in the artwork, because a screen
    // reader user should get the picture, not the pitch.
    altText: `BotPlanet artwork for the ${model}: ${a.scene}.`,
    altTextStatus: "approved",
    schema: OWNER_ARTWORK_SCHEMA,
    depictsRealProduct: true,
    presentation: "bleed",
    notes:
      "Owner-created creative, optimised from a PNG master to WebP with no crop, recolour or removal of in-image text. Not Amazon Program Content — see public/media/products/RIGHTS.md.",
  };
});

/* ------------------------------------------------------------------ */
/* Review article figures                                             */
/* ------------------------------------------------------------------ */

/**
 * Owner-created figures that illustrate a review, keyed to the section they
 * belong beside.
 *
 * THE RULE, AS THE OWNER SET IT ON 4 AUGUST 2026. These creatives carry
 * headline text set into the image, and that text makes claims. Where a claim
 * does not match the manufacturer's own sources, THE DEFAULT IS TO PUBLISH THE
 * FIGURE AND STATE THE CORRECTION IN ITS CAPTION — not to withhold it. A
 * reader who sees a docking station and reads "no dock is included" underneath
 * has been told the truth and kept the picture. A reader who sees neither has
 * been given less.
 *
 * BRANDING IS NOT A REASON TO WITHHOLD, AND NEVER WAS. These are BotPlanet
 * creatives. The BotPlanet mark appearing on the machine in them is the
 * owner's own design decision about the owner's own artwork, and an earlier
 * version of this file treated it as a misrepresentation. That was wrong and
 * the objection is deleted rather than softened.
 *
 * REVIEW_FIGURES_WITHHELD is now only for a creative whose headline directly
 * contradicts the review's central finding — where publishing it would state
 * in pixels the opposite of what the page states in words, and no caption can
 * hold both. That is a narrow case, and it is meant to stay narrow.
 *
 * Like the product creatives, the claims printed inside carry no evidence
 * weight: a specification still needs its own evidence record.
 */
interface ReviewFigure {
  slug: string;
  /** Review this belongs to. */
  productSlug: string;
  /**
   * What the figure actually is.
   *
   * Deliberately never `product_hero`: that type is what the card and the
   * listing resolve to, and a second one per product would quietly outrank the
   * product creative and skew the readiness report. A review figure is an
   * extra view, not a replacement hero.
   */
  type:
    | "product_in_use"
    | "product_detail"
    | "app_screenshot"
    | "filtration_detail"
    | "included_accessories";
  file: string;
  checksum: string;
  width: number;
  height: number;
  /** What the composition shows — becomes the alt text, minus the pitch. */
  scene: string;
}

const REVIEW_FIGURES: ReviewFigure[] = [
  {
    slug: "hero",
    productSlug: "dolphin-nautilus-cc-plus",
    type: "product_in_use",
    file: "hero.webp",
    checksum: "sha256:5b07c200a41f5890ee6f1177aaa214620f890940af4bde0d5908983d2e010048",
    width: 1122,
    height: 1402,
    scene:
      "the black and blue cleaner lifting out of dark water beside a phone showing the Dolphin app, above three panels marked Wi-Fi control, wall climbing and top-load filter access",
  },
  {
    slug: "plug-and-play",
    productSlug: "dolphin-nautilus-cc-plus",
    type: "product_in_use",
    file: "plug-and-play.webp",
    checksum: "sha256:627f2c1a22a08551ee965c451ed17bec7275f91a7e147082a39e2c31c630ed15",
    width: 1254,
    height: 1254,
    scene:
      "the cleaner beside its power supply at the edge of a lit pool at night, with a hand pressing the single button on the caddy",
  },
  {
    slug: "app-control",
    productSlug: "dolphin-nautilus-cc-plus",
    type: "app_screenshot",
    file: "app-control.webp",
    checksum: "sha256:b909f05f0d7989c7d27d8b74b160534bc59f12e448bb77cccc47d9a0acc21531",
    width: 1254,
    height: 1254,
    scene:
      "the cleaner on wet stone beside a phone running the MyDolphin Plus app, showing a scheduled quick clean",
  },
  {
    slug: "video-poster",
    productSlug: "dolphin-nautilus-cc-plus",
    type: "product_in_use",
    file: "video-poster.webp",
    checksum: "sha256:d40f53d5f461b7f7260ceb402b818f8981f0d0bca64a65d0b840b84ca24823d9",
    width: 1672,
    height: 941,
    scene:
      "a BotPlanet review card for the machine, shown beside a phone running the MyDolphin Plus app with a Wi-Fi symbol between them",
  },
  {
    slug: "filter-access",
    productSlug: "dolphin-nautilus-cc-plus",
    type: "filtration_detail",
    file: "filter-access.webp",
    checksum: "sha256:8f9cc28e112d152edb838f5e04e74a3fae9d817a20b759bdf1a6fd47b227ff92",
    width: 1254,
    height: 1254,
    scene:
      "two hands lifting the filter baskets out through the top of the machine at the poolside",
  },

  /* ---- Polaris FREEDOM ---- */
  {
    slug: "hero",
    productSlug: "polaris-freedom",
    type: "product_in_use",
    file: "hero.webp",
    checksum: "sha256:9c0fdbb8ca88073fab0b2cce35b4da9ff1c29e6596da7a3ddec0bf1a53aa811c",
    width: 1254,
    height: 1254,
    scene:
      "the blue and black tracked cleaner at the edge of a lit pool at night beside a phone showing a two hour thirty cycle running in floor and wall mode",
  },
  {
    slug: "cordless-dock",
    productSlug: "polaris-freedom",
    type: "product_in_use",
    file: "cordless-dock.webp",
    checksum: "sha256:bf0532219a9d0c3d0cff9786fc7a548a7a2742d1470ed0d5b0a1f744c24a9b64",
    width: 1254,
    height: 1254,
    scene:
      "the cleaner standing on a terrace beside its upright charging station and a phone, with a lit pool behind",
  },
  {
    slug: "app-control",
    productSlug: "polaris-freedom",
    type: "app_screenshot",
    file: "app-control.webp",
    checksum: "sha256:e1568cf32873fe756c8b9f93ca29a5b3603ec216364d32ba5cc9b891ec87ef52",
    width: 1254,
    height: 1254,
    scene:
      "a phone running the iAquaLink app showing a two hour thirty floor and wall cycle and a full battery, beside the cleaner at a lit poolside",
  },

  /* ---- Betta SE Plus ---- */
  {
    slug: "hero",
    productSlug: "betta-se-plus",
    type: "product_in_use",
    file: "hero.webp",
    checksum: "sha256:5fb5ca3a267fb34f6b10e8c36a4d4f1405977fb052b1e1864e39c9601d475e83",
    width: 1254,
    height: 1254,
    scene:
      "the silver solar skimmer floating on a sunlit pool among fallen leaves, with its solar panel facing up",
  },
  {
    slug: "twin-motors",
    productSlug: "betta-se-plus",
    type: "product_in_use",
    file: "twin-motors.webp",
    checksum: "sha256:f58d95ccb170f386881acc70c654d1fbadfeced3a52dbea1a181c69ba4072a0c",
    width: 1254,
    height: 1254,
    scene:
      "the skimmer at a poolside beside a wall-mounted charger and a free-standing solar panel, above three panels on motors, solar charging and shallow water",
  },
  {
    slug: "sensors",
    productSlug: "betta-se-plus",
    type: "product_in_use",
    file: "sensors.webp",
    checksum: "sha256:406495e30ccf8e52f859c594adeaa8429f51eaad5fe01908463e2c7cf8bb1923",
    width: 1254,
    height: 1254,
    scene:
      "the skimmer on a dark pool with sensor arcs drawn around it, above three panels on obstacle detection, edge navigation and the UV-resistant shell",
  },
  {
    slug: "debris-basket",
    productSlug: "betta-se-plus",
    type: "filtration_detail",
    file: "debris-basket.webp",
    checksum: "sha256:521af3f70232a084dada6b2f0ef73014162f198804494e9aac0cbb4dc42998ca",
    width: 1254,
    height: 1254,
    scene:
      "the skimmer with its top cover raised showing a basket full of leaves, above a three-step sequence ending with the basket being emptied into a bin",
  },

  /* ---- Dolphin Proteus DX4 Plus ---- */
  {
    slug: "hero",
    productSlug: "dolphin-proteus-dx4-plus",
    type: "product_in_use",
    file: "hero.webp",
    checksum: "sha256:4322c17dd68111fc13da45f2ae7e791f2f758bf39df352c8192cbe417c5a4236",
    width: 1254,
    height: 1254,
    scene:
      "the white and blue tracked cleaner on stone paving beside a curved pool at dusk, with its cable coiled behind it",
  },
  {
    slug: "every-surface",
    productSlug: "dolphin-proteus-dx4-plus",
    type: "product_in_use",
    file: "every-surface.webp",
    checksum: "sha256:48de5cb59170a0064249f67d36ddb32bec2a59f0f086f4739e6d998900e27de8",
    width: 1254,
    height: 1254,
    scene:
      "the cleaner on a pool floor with two further views of it climbing a tiled wall above, beside panels naming floor cleaning, wall climbing and waterline coverage",
  },
  {
    slug: "weekly-timer",
    productSlug: "dolphin-proteus-dx4-plus",
    type: "product_in_use",
    file: "weekly-timer.webp",
    checksum: "sha256:b8058f4fc5bb966b85df51997ad4c2125e3453334e292c2870bc2dae8cf4e103",
    width: 1254,
    height: 1254,
    scene:
      "the cleaner beside its mains power supply unit at a poolside, with the supply's button panel facing the camera",
  },
  {
    slug: "filtration",
    productSlug: "dolphin-proteus-dx4-plus",
    type: "filtration_detail",
    file: "filtration.webp",
    checksum: "sha256:b7b1d51d8db347685e6f292a6ff9ef1a499cad06ab563ed5cc42ad3a93587e25",
    width: 1536,
    height: 1536,
    scene:
      "a hand lifting the filter cartridge out through the opened top lid of the machine at the poolside",
  },

  /* ---- Aiper Scuba V3 AI Vision ---- */
  {
    slug: "hero",
    productSlug: "aiper-scuba-v3-ai-vision",
    type: "product_in_use",
    file: "hero.webp",
    checksum: "sha256:5eff3711d840b749d6b3d20b33dd7091e5f9f0f13b2081ff4ba267574c592fac",
    width: 1254,
    height: 1254,
    scene:
      "the black tracked cleaner with a teal vent standing on stone beside a night pool, next to a phone showing the Aiper app, above five feature panels",
  },
  {
    slug: "ai-patrol",
    productSlug: "aiper-scuba-v3-ai-vision",
    type: "product_in_use",
    file: "ai-patrol.webp",
    checksum: "sha256:e6919910f0c44b2f42920ffe73ae88c02440fff4ac65313d7e9a828b1035e1c2",
    width: 1254,
    height: 1254,
    scene:
      "the cleaner head-on with three headlight beams sweeping a gridded pool floor, with leaves, sand, twigs and pebbles picked out in target frames around it",
  },
  {
    slug: "carefree",
    productSlug: "aiper-scuba-v3-ai-vision",
    type: "app_screenshot",
    file: "carefree.webp",
    checksum: "sha256:9c01cb4b112ebb3150231576f454f7da96dd07732015a9bce21822340680976a",
    width: 1254,
    height: 1254,
    scene:
      "the cleaner at a daylight poolside above a cutaway pool diagram showing its cleaning path, beside a phone running the Aiper app in AI Navium mode",
  },
  {
    slug: "filtration",
    productSlug: "aiper-scuba-v3-ai-vision",
    type: "filtration_detail",
    file: "filtration.webp",
    checksum: "sha256:fd5f8fd9bc3f627c73c2c6ad0e4f923387bec1661c3288c4bb98ba362b06bd9a",
    width: 1254,
    height: 1254,
    scene:
      "an exploded view of the white filter basket inside the dark debris basket, with the mesh layers fanned out and the 3 micron and 180 micron layers labelled",
  },

  /* ---- Aiper Scuba X1 Pro Max ---- */
  {
    slug: "hero",
    productSlug: "aiper-scuba-x1-pro-max",
    type: "product_in_use",
    file: "hero.webp",
    checksum: "sha256:b52ba7ea6db769785e39c3d2cf7658193102a02d584e5a9e3741da95bbbd31a3",
    width: 1402,
    height: 1122,
    scene:
      "the dark tracked flagship at the edge of a night pool, sensor beams fanning across scattered leaves, beside a feature list from surface skimming to app control",
  },
  {
    slug: "suction",
    productSlug: "aiper-scuba-x1-pro-max",
    type: "product_in_use",
    file: "suction.webp",
    checksum: "sha256:8f4d13a8bf77f9349d1bbfc426da93c672b33135df488929eb6e43566187378a",
    width: 1254,
    height: 1254,
    scene:
      "the cleaner on a leaf-strewn pool floor with two jets of water rising from its outlets and suction streaks drawn ahead of it",
  },
  {
    slug: "runtimes",
    productSlug: "aiper-scuba-x1-pro-max",
    type: "product_in_use",
    file: "runtimes.webp",
    checksum: "sha256:8e49037240001266efface4ff526d4a8e5ab9beea74581007137c21261682de6",
    width: 1254,
    height: 1254,
    scene:
      "the cleaner floating at the surface of a lit pool at night beside three duration panels for surface, floor and eco cleaning",
  },
  {
    slug: "filtration",
    productSlug: "aiper-scuba-x1-pro-max",
    type: "filtration_detail",
    file: "filtration.webp",
    checksum: "sha256:df490c18c93c4c510b13d96dc257b930249e2aca2661bce5e1b51926573145aa",
    width: 1254,
    height: 1254,
    scene:
      "two filter baskets side by side underwater — the 180 micron standard mesh with leaves and stones, and the 3 micron ultra-fine basket with dust and algae",
  },

  /* ---- Aiper Seagull SE ---- */
  {
    slug: "hero",
    productSlug: "aiper-seagull-se",
    type: "product_in_use",
    file: "hero.webp",
    checksum: "sha256:54703cc18761b0ce99c25efac24ceb493de9a11c873a98712d60aa012a30e71c",
    width: 1254,
    height: 1254,
    scene:
      "the compact grey cleaner with its carbon-weave handle beside its retrieval hook at a poolside, above panels for cordless design, self-parking, easy retrieval and compact build",
  },
  {
    slug: "charging",
    productSlug: "aiper-seagull-se",
    type: "product_in_use",
    file: "charging.webp",
    checksum: "sha256:5a7de7cd2ba442947a13b668232aeacdd8b12ae0d8467c2431a6490b6a526cd2",
    width: 1254,
    height: 1254,
    scene:
      "the cleaner on an indoor floor beside its wall charger, with a 2.5 hours badge and a note comparing charging time with the Seagull 600",
  },
  {
    slug: "battery",
    productSlug: "aiper-seagull-se",
    type: "product_in_use",
    file: "battery.webp",
    checksum: "sha256:0019449cb5ac7a89c2f68a27d338dd58c852e767ccdb6f1f8233b0017dd3efdc",
    width: 1254,
    height: 1254,
    scene:
      "an above-ground pool seen from directly overhead on a lawn, the cleaner working inside a 90 minutes dial, with a 2x battery badge in the corner",
  },
  {
    slug: "retrieval",
    productSlug: "aiper-seagull-se",
    type: "product_in_use",
    file: "retrieval.webp",
    checksum: "sha256:8aaaec19e73c52ae4b80815d48307fe0f203cd25fb3c1d51d5ba9c16afa2e49d",
    width: 1254,
    height: 1254,
    scene:
      "the cleaner lifted dripping from an infinity pool on the included hook and pole, with feature panels beneath",
  },

  /* ---- Aiper Scuba S1 ---- */
  {
    slug: "hero",
    productSlug: "aiper-scuba-s1",
    type: "product_in_use",
    file: "hero.webp",
    checksum: "sha256:06956efa784e4feaf74788e81ca1ac640da5e2a03c466859abbbfa390f770168",
    width: 1402,
    height: 1122,
    scene:
      "the grey and black tracked cleaner at the edge of a night pool beside a phone showing the Aiper app with floor, wall, waterline and all modes and a running countdown",
  },
  {
    slug: "four-zone",
    productSlug: "aiper-scuba-s1",
    type: "product_in_use",
    file: "four-zone.webp",
    checksum: "sha256:533aab1a96f58ab716af2a2aa99896767accb8afa0121bea680d9047ab444cc9",
    width: 1254,
    height: 1254,
    scene:
      "a daylight pool seen from above with the cleaner shown working four labelled zones — shallow areas, waterline, walls and floors — while a woman and a dog rest poolside",
  },
  {
    slug: "filtration",
    productSlug: "aiper-scuba-s1",
    type: "filtration_detail",
    file: "filtration.webp",
    checksum: "sha256:556a3fbe627798de01c6467d7580ba911ee4cd3287b571ea89db85822ad16dc2",
    width: 1254,
    height: 1254,
    scene:
      "the dark 180 micron filter basket and the white 3 micron ultra-fine basket side by side underwater, with debris icons from leaves to algae beneath",
  },
  {
    slug: "modes",
    productSlug: "aiper-scuba-s1",
    type: "app_screenshot",
    file: "modes.webp",
    checksum: "sha256:0a5ee1d05acf23f35cff63378456bc8280a0c1f0280240a7c167f292c5f61502",
    width: 1254,
    height: 1254,
    scene:
      "the cleaner on rippling night water beside five labelled mode buttons — wall, eco, auto, floor and schedule — above a weekly day picker",
  },

  /* ---- BuBlue Bubot 800P Gen2 ----
     The hero prints 9.0 in / 18.3 in dimensions and a 49.21 ft cable, and the
     shallow creative prints a 12 in minimum operational depth. The dimensions
     differ slightly from the listing's 19 x 18 x 9, the cable figure is
     research-only, and the depth claim has NO source at all — BuBlue's own
     page claims shallow-zone AVOIDANCE, not shallow-zone cleaning. All four
     publish per the owner's standing rule; the review and captions carry the
     corrections. */
  {
    slug: "hero",
    productSlug: "bublue-bubot-800p",
    type: "product_in_use",
    file: "hero.webp",
    checksum: "sha256:6adf599e12464f147c001c4e87a64ae60d50c3d2a025143c6d59f7c095699e9a",
    width: 1254,
    height: 1254,
    scene:
      "the grey tracked cleaner on a sunlit pool deck under the words Your Pool's Reliable Partner, with size and cable-length callouts beside it",
  },
  {
    slug: "filtration",
    productSlug: "bublue-bubot-800p",
    type: "filtration_detail",
    file: "filtration.webp",
    checksum: "sha256:001757383f5b1d173f54ed637d99b6a7d0e4d661952ce912a10af249f49604bb",
    width: 1254,
    height: 1254,
    scene:
      "the cleaner opened to show its two 3-litre filter baskets, with 180 micron ultra-fine filtration callouts around them",
  },
  {
    slug: "schedule",
    productSlug: "bublue-bubot-800p",
    type: "app_screenshot",
    file: "schedule.webp",
    checksum: "sha256:71db4c4676e602ea576b232299712f16fecbcf34350f2072a6358408c0c87684",
    width: 1254,
    height: 1254,
    scene:
      "the cleaner working a pool floor beside a phone showing the app's weekly cleaning schedule calendar",
  },
  {
    slug: "shallow",
    productSlug: "bublue-bubot-800p",
    type: "product_in_use",
    file: "shallow.webp",
    checksum: "sha256:6d15f822e8d99b2a8df804fc462c5b7043ef36846e76201a52db094b2c9bbed4",
    width: 1254,
    height: 1254,
    scene:
      "the cleaner on a shallow tanning platform in clear water, with a 12 inch depth callout beside it",
  },

  /* ---- WYBOT C1 ----
     The suction creative prints 65 W motors, an 11.5 m³/h flow rate and
     four-wheel drive; the charging creative prints 4,600 mAh. WYBOT's page
     states 3,038 GPH (11.5 m³/h is that figure converted), a triple-motor
     system with no wattage, treads in every photo, and no battery capacity.
     The 3-hour charge IS WYBOT's own figure. All four publish per the owner's
     standing rule; the review and captions carry the corrections. */
  {
    slug: "hero",
    productSlug: "wybot-c1",
    type: "product_in_use",
    file: "hero.webp",
    checksum: "sha256:b4a18087fa075c54dc7b5be415cdc5129402269ae1c26212c25bf90ca7896274",
    width: 1254,
    height: 1254,
    scene:
      "the black and silver tracked cleaner on stone paving beside a night pool, next to a phone showing the WYBOT app and panels for app control, floor, wall and waterline cleaning, cordless running and navigation",
  },
  {
    slug: "suction",
    productSlug: "wybot-c1",
    type: "product_in_use",
    file: "suction.webp",
    checksum: "sha256:6c536beaec7191f4b59f77ec6d0b889d97d17beedc1c165aa4ad691ab802a803",
    width: 1254,
    height: 1254,
    scene:
      "the cleaner underwater from below, intake vortices drawing in leaves, above a row of debris icons for leaves, dirt, hair and twigs",
  },
  {
    slug: "cycles",
    productSlug: "wybot-c1",
    type: "app_screenshot",
    file: "cycles.webp",
    checksum: "sha256:3c7ef23bd1d13bc9fa6783cf5d10ac965ffa92162871c91dbb32c4c6a620d164",
    width: 1254,
    height: 1254,
    scene:
      "a phone showing the WYBOT app's cycle timer beside a ring diagram splitting one charge into one, two, three or four cleaning days",
  },
  {
    slug: "charging",
    productSlug: "wybot-c1",
    type: "product_in_use",
    file: "charging.webp",
    checksum: "sha256:65817bf8450d34f82109ead5302ab830cf96f2ff691de233543028c296b71807",
    width: 1254,
    height: 1254,
    scene:
      "the cleaner plugged into a wall charger on a poolside patio at night, with badges for charging time and battery capacity",
  },

  /* ---- Beatbot AquaSense 2 Ultra ----
     The hero prints the model name transposed ("AquaSense Ultra 2" — the real
     name is AquaSense 2 Ultra), the battery creative prints "up to 11 hours"
     surface cleaning where Beatbot's own page says up to 10, and the coverage
     creative's "multizone mode" label is our phrasing for what Beatbot calls
     Adaptive Multi-Platform Cleaning. All four publish per the owner's
     standing rule; the review and captions carry the corrections. */
  {
    slug: "hero",
    productSlug: "beatbot-aquasense-2-ultra",
    type: "product_in_use",
    file: "hero.webp",
    checksum: "sha256:4a6dad0bf3667bfd3a1665f0173e654fded48e55bfa7f22692c0dcb7cbe5c4a5",
    width: 1254,
    height: 1254,
    scene:
      "the dark grey cleaner tilted on its dock beside an infinity pool at dusk, next to a phone showing the AquaSense app and panels for app control, floor, wall and waterline cleaning, cordless running and navigation",
  },
  {
    slug: "coverage",
    productSlug: "beatbot-aquasense-2-ultra",
    type: "product_in_use",
    file: "coverage.webp",
    checksum: "sha256:e2cc427ccdf33e8705f864732b12575967667eebacf5e1aac510fcadb99410d7",
    width: 1254,
    height: 1254,
    scene:
      "six labelled panels showing the cleaner skimming the water surface, releasing clarifier, climbing a wall, cleaning a raised platform, working the waterline and crossing the floor",
  },
  {
    slug: "navigation",
    productSlug: "beatbot-aquasense-2-ultra",
    type: "product_in_use",
    file: "navigation.webp",
    checksum: "sha256:73e945d365eb530df121154f32509dc6a7375424664aaa4fbcc51f355236b2b3",
    width: 1254,
    height: 1254,
    scene:
      "the cleaner projecting a glowing route map above itself on a tiled pool floor, with icons marking an inlet, a drain and a ladder as obstacles",
  },
  {
    slug: "battery",
    productSlug: "beatbot-aquasense-2-ultra",
    type: "product_in_use",
    file: "battery.webp",
    checksum: "sha256:2eccefbcfc4ba5780fbd6460709580c71985b267172d2291a1bd9eb5f516ae68",
    width: 1254,
    height: 1254,
    scene:
      "the cleaner afloat in an infinity pool at dusk beneath runtime badges for surface, floor and wall cleaning, above a battery outline and a coverage figure",
  },
  {
    /* MISFILED AND MOVED, 7 August 2026. This arrived under the plain W2 PRO
       heading in Notion. It shows a portable power station on the floor and
       lists "PORTABLE POWER STATION" in its own footer — both are the OMNI's
       defining feature, and the plain W2 PRO does not ship with one. Publishing
       it on the W2 PRO review would have shown a reader a station while the
       words underneath said the machine does not include it. Caught because
       the owner asked whether two products had ended up sharing artwork. */
    slug: "winbot-on",
    productSlug: "ecovacs-winbot-w2-pro-omni",
    type: "product_in_use",
    file: "winbot-on.webp",
    checksum: "sha256:ea1395185c4f426b49f323493b620d288149298c82e43560f1cb08361df8b2cb",
    width: 1122,
    height: 1402,
    scene:
      "the robot mid-pane on a floor-to-ceiling window over a city skyline while a person sits watching from an armchair, the power station on the floor to the left, above three greyed panels showing the manual alternatives",
  },
  {
    /* The three W2 PRO Omni review figures, 7 August 2026. Same provenance
       note as the product creative above: owner-supplied, owner-confirmed as
       their own work. */
    slug: "cleaning-modes",
    productSlug: "ecovacs-winbot-w2-pro-omni",
    type: "product_in_use",
    file: "cleaning-modes.webp",
    checksum: "sha256:9f759bafd6d9860c35e264b96a8bce79ac04513ef17f0e3bd7b756c2e4d3bea4",
    width: 1254,
    height: 1254,
    scene:
      "the robot working a window above a city skyline at dusk while a person watches from an armchair with the app open, above panels for six cleaning modes, button control, folded storage and app control",
  },
  {
    slug: "all-from-inside",
    productSlug: "ecovacs-winbot-w2-pro-omni",
    type: "product_in_use",
    file: "all-from-inside.webp",
    checksum: "sha256:11b91fa5f72f37a1aa862cc6d23ad9134036dc9024cf601f04fd75fb512f948f",
    width: 1536,
    height: 1024,
    scene:
      "the robot part-way down a rain-streaked picture window over a mountain valley, its cable running to the station on the floor beside a plug socket, with three greyed panels showing the manual alternatives it replaces",
  },
  {
    slug: "three-nozzle-spray",
    productSlug: "ecovacs-winbot-w2-pro-omni",
    type: "filtration_detail",
    file: "three-nozzle-spray.webp",
    checksum: "sha256:52c5c4e8fccd860f8e3efaea37e5152c80f10dbea11effad30a985fdd7310c93",
    width: 1536,
    height: 1024,
    scene:
      "the robot mid-pane on a window over a lake, spray fanning across the glass above it, with three detail insets showing the nozzle spray, the underside pad and the drive wheels",
  },
  /* The other seven window products, 8 August 2026. Same batch as the cards
     above. */
  {
    slug: "three-nozzle-spray",
    productSlug: "ecovacs-winbot-w2-pro",
    type: "product_in_use",
    file: "three-nozzle-spray.webp",
    checksum: "sha256:ae5ba5750f49bde05a47b5a2624c72bf01e8e8d13a02d01b3ba71ee409f2efb9",
    width: 1086,
    height: 1448,
    scene:
      "the robot spraying a wide arc across dark glass with its pump drawn in cutaway, beside figures for water pressure and spray coverage, above a comparison with a narrower-spraying machine",
  },
  {
    slug: "cleaning-modes",
    productSlug: "ecovacs-winbot-w2-pro",
    type: "app_screenshot",
    file: "cleaning-modes.webp",
    checksum: "sha256:bab54041cf9df0ace74338fb75f7e263a0205f86f4cd788b0143b18db5f69b7e",
    width: 1169,
    height: 1346,
    scene:
      "the robot on a city window beside a numbered list of seven cleaning modes, with a phone running the WINBOT app below it",
  },
  {
    slug: "hero",
    productSlug: "ecovacs-winbot-w1-pro",
    type: "product_in_use",
    file: "hero.webp",
    checksum: "sha256:9e5eb146963328dad87d18dbb79d939a0407b49d592616d03413afe8b938f8fb",
    width: 1586,
    height: 992,
    scene:
      "the white and tan robot on rain-streaked glass at dusk with a lit house behind it",
  },
  {
    slug: "eight-tier",
    productSlug: "ecovacs-winbot-w1-pro",
    type: "product_detail",
    file: "eight-tier.webp",
    checksum: "sha256:399974ffc0cf6e7ba3f2d7ba2b904b2b62fa718ac0b477bcb6564be2c0ef1380",
    width: 1122,
    height: 1402,
    scene:
      "the robot centred in a ring of blue arrows marked 2800 Pa, ringed by eight labelled protections including a carabiner, an optocoupler sensor and a thirty-minute blackout hold",
  },
  {
    slug: "cross-spray",
    productSlug: "ecovacs-winbot-w1-pro",
    type: "product_detail",
    file: "cross-spray.webp",
    checksum: "sha256:f692f9faccc740df56402866cefef034fa288aefc24bb7c144d77aea46c06a51",
    width: 1086,
    height: 1448,
    scene:
      "the robot on a night window beside three panels naming a 60 ml reservoir, a cross auto-spray pattern and cleaning solution",
  },
  {
    slug: "app-control",
    productSlug: "ecovacs-winbot-w1-pro",
    type: "app_screenshot",
    file: "app-control.webp",
    checksum: "sha256:a8b3d6d4af79e7ce416ad087a135a8b864e4dc24ddf0024b1302874d5087131d",
    width: 1024,
    height: 1536,
    scene:
      "the robot on glass beside a phone showing a remote-control pad and a zigzag route, with panels for two water levels, three cleaning modes and maintenance reminders",
  },
  {
    slug: "hero",
    productSlug: "hobot-2s",
    type: "product_in_use",
    file: "hero.webp",
    checksum: "sha256:4264294faa09fa6977db2af964c95ffa0c2017802105a36797aa0d541b63e7c6",
    width: 1672,
    height: 941,
    scene:
      "the white robot on a night window spraying from both sides, above a strip reading dual spray, sparkling clean and safe and reliable",
  },
  {
    slug: "spray-module",
    productSlug: "hobot-2s",
    type: "included_accessories",
    file: "spray-module.webp",
    checksum: "sha256:1b3ddf44a1ec149cccc52a64d0e6fb82ac1e6514e177673d0cebe48a4c782172",
    width: 1448,
    height: 1086,
    scene:
      "the robot with its spray module lifted away on guide lines, beside panels naming tool-free removal, a large refill cap, the dual spray system and washable microfibre pads",
  },
  {
    slug: "app-control",
    productSlug: "hobot-2s",
    type: "app_screenshot",
    file: "app-control.webp",
    checksum: "sha256:7e1d19a01767f385867fe4fc248e772bcf9a983d2247d9dacd0f2d079d127413",
    width: 1086,
    height: 1448,
    scene:
      "the robot spraying on a night window above a phone running the HOBOT 2-S remote control, with the spray module shown separately below",
  },
  {
    slug: "holding-force",
    productSlug: "hobot-298",
    type: "product_detail",
    file: "holding-force.webp",
    checksum: "sha256:6a46a63586c447f9d564eb7d74af1a62ac59edc29421b92fff82dbf4c55b02de",
    width: 1122,
    height: 1402,
    scene:
      "the robot lifted off the glass on blue arrows beside a panel reading up to 6 kg holding force, above notes on stable grip, dust pickup and built-in safety",
  },
  {
    slug: "edge-detection",
    productSlug: "hobot-298",
    type: "product_detail",
    file: "edge-detection.webp",
    checksum: "sha256:29365f55bbaad542f2f55f93dfe8b3e787a947fd052a8417ea7f31cbeedebf70",
    width: 1254,
    height: 1254,
    scene:
      "the robot on wet glass with detection arcs at its edge, beside the underside of the machine showing its yellow border pad and grey centre pad",
  },
  {
    slug: "bluetooth-remote",
    productSlug: "hobot-298",
    type: "app_screenshot",
    file: "bluetooth-remote.webp",
    checksum: "sha256:43c3ac6dc32a777e95b95373474c2f8572d9bf51720158423f08dc61ce026ff2",
    width: 1254,
    height: 1254,
    scene:
      "a hand holding a phone running the HOBOT remote control over Bluetooth, beside the robot on a night window",
  },
  {
    slug: "every-surface",
    productSlug: "hutt-s55-pro",
    type: "product_in_use",
    file: "every-surface.webp",
    checksum: "sha256:245c44007b82a7867e21262c900fcbf21a7fb51d348508bd98fbdb2cddffb86d",
    width: 1254,
    height: 1254,
    scene:
      "the robot shown four times over — on a window, a bathroom mirror, tiled wall and a shower screen — under the heading adaptive cleaning for every surface",
  },
  {
    slug: "adaptive-suction",
    productSlug: "hutt-s55-pro",
    type: "product_detail",
    file: "adaptive-suction.webp",
    checksum: "sha256:8ce85299ecf04e39b93a9134eb5f33c2dd1a23cc52ef0c935e6c1c245bbbadfb",
    width: 1254,
    height: 1254,
    scene:
      "the robot exploded into its fan stack on the left under an adaptive suction panel reading 2000 to 6500 Pa, and its water tank and 120-degree spray fan on the right",
  },
  {
    slug: "safety-backup",
    productSlug: "hutt-s55-pro",
    type: "product_detail",
    file: "safety-backup.webp",
    checksum: "sha256:5701175cbfc2912714bee4acb84b6986700eedb78e7089e167e47cd41b40f5ed",
    width: 1254,
    height: 1254,
    scene:
      "the robot on a high window with its safety rope running to an anchor, beside a panel reading thirty-minute emergency backup battery",
  },
  {
    slug: "one-click",
    productSlug: "hutt-s55-pro",
    type: "product_in_use",
    file: "one-click.webp",
    checksum: "sha256:f637ca8991670ad504b128acc9d3d3504d54350ad597edb5badd15196dddeca4",
    width: 1254,
    height: 1254,
    scene:
      "a hand holding the robot's remote in a bright room, beside four numbered panels for one-click control, SLAM 4.0 navigation, automatic return and edge detection",
  },
  {
    slug: "corner-clean",
    productSlug: "mamibot-w120-dp",
    type: "product_detail",
    file: "corner-clean.webp",
    checksum: "sha256:f4258c0b20cb75c151a74025ace30e4d52879c744b4913b4b3f9feb5ff85384f",
    width: 1254,
    height: 1254,
    scene:
      "the robot seen from beneath with its four corner sensors lit, beside figures for 1 mm edge clearance, area coverage and rotation, above a comparison of edges left dirty and edges cleaned",
  },
  {
    slug: "eight-in-one",
    productSlug: "mamibot-w120-dp",
    type: "product_detail",
    file: "eight-in-one.webp",
    checksum: "sha256:13b9d7200f5618140ab785f34d72462e2713c25246a946418d557e48b7d325b9",
    width: 1254,
    height: 1254,
    scene:
      "the robot on a window overlooking a lake beside a list of eight features including suction compensation, optocoupler sensors, power-outage protection and voice prompts",
  },
  {
    slug: "dual-control",
    productSlug: "mamibot-w120-dp",
    type: "app_screenshot",
    file: "dual-control.webp",
    checksum: "sha256:7ab4656bc854662184472b0b18fd547974270bb6fa93ba9764bc942a7e5ff26f",
    width: 1254,
    height: 1254,
    scene:
      "the robot shown on a small framed window and on frameless glass, beside a phone running the W120-DP app and a note that the smallest window it takes is 60 by 40 centimetres",
  },
  {
    slug: "spray-suction",
    productSlug: "cop-rose-x5s",
    type: "product_detail",
    file: "spray-suction.webp",
    checksum: "sha256:16da615228827cbdd1b8cd05667ded33504f84ad5f7c3773dd07b3cd1647bf84",
    width: 1254,
    height: 1254,
    scene:
      "the robot on rain-streaked glass beside panels for an atomised water spray and suction quoted at up to 4000 Pa",
  },
  {
    slug: "multiple-surfaces",
    productSlug: "cop-rose-x5s",
    type: "product_in_use",
    file: "multiple-surfaces.webp",
    checksum: "sha256:d59d66f1d13514b938544912720e40231ef585a329a79e1a86c95cda5cdb5f50",
    width: 1122,
    height: 1402,
    scene:
      "the robot in a white bathroom labelled against glass, windows, a smooth bath surround and a countertop",
  },
  /* WINBOT W3 Omni, unmerged 8 August 2026. */
  {
    slug: "hero",
    productSlug: "ecovacs-winbot-w3-omni",
    type: "product_in_use",
    file: "hero.webp",
    checksum: "sha256:586e627812d5e67fb0dd0d212872cb9810148ef98365b89c600347f98a497107",
    width: 1536,
    height: 1024,
    scene:
      "the robot spraying a wide arc across a tall window with a city view, its station on the floor beside it, above a strip naming reliable performance, premium build, smart design and support",
  },
  {
    slug: "three-nozzle-spray",
    productSlug: "ecovacs-winbot-w3-omni",
    type: "product_detail",
    file: "three-nozzle-spray.webp",
    checksum: "sha256:186d9dc5e87b01d082499657d480271c2ee311bf8fe1a9c071b60da9415af66a",
    width: 1536,
    height: 1024,
    scene:
      "the robot spraying from its side across dark glass at dusk, beside figures for water pressure and spray coverage and a comparison with a narrower-spraying machine",
  },
  {
    slug: "model-comparison",
    productSlug: "ecovacs-winbot-w3-omni",
    type: "product_detail",
    file: "model-comparison.webp",
    checksum: "sha256:81acf25c77cc91417665c5266925d80eaa477890d41b35538fb31ab26571ef10",
    width: 1254,
    height: 1254,
    scene:
      "a two-column comparison of the W3 Omni against the W2S Omni on pad washing, navigation generation, battery life, working area, maximum suction, minimum window size and incline rating",
  },
  {
    slug: "path-planning",
    productSlug: "ecovacs-winbot-w3-omni",
    type: "product_detail",
    file: "path-planning.webp",
    checksum: "sha256:55b9fb3311fb1ce0efea3d85a92983986e9025455ee43a3c05285a19545d1f2d",
    width: 1086,
    height: 1448,
    scene:
      "the robot on a tall window above a city with its station below, beside panels for cleaning speed, obstacle detection accuracy and route planning",
  },
  {
    slug: "twelve-tier",
    productSlug: "ecovacs-winbot-w3-omni",
    type: "product_detail",
    file: "twelve-tier.webp",
    checksum: "sha256:d713cced692d4c40e8eb580a8296faf039460c0a382f092f66c4b5bc6eda285e",
    width: 1254,
    height: 1254,
    scene:
      "the underside of the robot showing its wiping pad and corner rollers, beside a twelve-part list of protection features including power-off protection, an emergency lockout and an optocoupler sensor",
  },
];

/**
 * Supplied, and deliberately not published.
 *
 * Each of these prints a claim the review refutes from the manufacturer's own
 * technical sheet. Putting them on the page would state in pixels the opposite
 * of what the page states in words — and the picture is what a reader believes.
 */
export const REVIEW_FIGURES_WITHHELD: {
  productSlug: string;
  supplied: string;
  claim: string;
  contradicts: string;
}[] = [
  {
    productSlug: "dolphin-nautilus-cc-plus",
    supplied: "Smart Navigation",
    claim: "Full pool coverage — cleans floors, walls and waterline",
    contradicts:
      "Maytronics' technical sheet for part 99996409-PCI lists Waterline Scrubbing: No. The review's second section is about this exact claim.",
  },
  {
    productSlug: "dolphin-nautilus-cc-plus",
    supplied: "Wall Climbing Capability",
    claim: "Total pool coverage — cleans floors, walls, and waterline thoroughly",
    contradicts:
      "Same sheet, same field. The headline of this creative is accurate; only the third bullet is not.",
  },
  {
    productSlug: "dolphin-nautilus-cc-plus",
    supplied: "Product Anatomy",
    claim: "Active scrubbing brush — helps loosen dirt and debris",
    contradicts:
      "The same sheet lists Active Brush: No, and the review states 'Actively driven brush: No'. The brushes are passive and work as the robot moves.",
  },
  {
    productSlug: "polaris-freedom",
    supplied: "FREEDOM — Clean. Smart. Cordless. (supplied as the main image)",
    claim: "4 intelligent cleaning modes: Floor, Wall, Waterline & Max Clean",
    contradicts:
      "There is no mode called Max Clean. Polaris's own listing bullet names the four as: floor, and floor+walls+waterline on the unit, plus Waterline only and SMART Cycle in the app. 'Max Clean' appears nowhere in the listing, the manual, the quick start guide or the support page. Everything else in this creative checks out — 2.5 hours, 50 ft, lithium-ion, cordless — so it is one wrong word on an otherwise accurate image, and changing it to SMART Cycle would make it publishable.",
  },
  {
    productSlug: "polaris-freedom",
    supplied: "Waterline Retrieval Options",
    claim: "Three retrieval options, including 'Tap & Lift — tap the robot on the top and it will rise to the waterline for easy lifting'",
    contradicts:
      "Polaris publishes TWO retrieval methods, not three: 'FREEDOM climbs to the waterline at end-of-cycle for lightweight removal... Or use the manual retrieval hook (included) and a standard pole.' The climb is automatic at the end of a cycle — no tap. Tapping the machine to summon it is not a feature Polaris describes anywhere. The push-notification panel on this creative IS accurate; it is presented as a third retrieval method, which it is not.",
  },

];

export const REVIEW_FIGURE_ASSETS: MediaAssetRecord[] = REVIEW_FIGURES.map((f): MediaAssetRecord => {
  const productId = PRODUCT_ID[f.productSlug] ?? `prod-${f.productSlug}`;
  const model = modelFor(productId, f.productSlug);
  return {
    ...base(`fig-${f.productSlug}-${f.slug}`, "depiction"),
    productId,
    purpose: `Review figure: ${f.slug}`,
    exactModel: model,
    type: f.type,
    checksum: f.checksum,
    width: f.width,
    height: f.height,
    src: `/media/reviews/${f.productSlug}/${f.file}`,
    // Describes the frame and names the model. It does not repeat the sales
    // claims printed in the artwork: a screen reader user gets the picture,
    // not the pitch.
    altText: `BotPlanet artwork for the ${model}: ${f.scene}.`,
    altTextStatus: "approved",
    schema: OWNER_ARTWORK_SCHEMA,
    depictsRealProduct: true,
    presentation: "bleed",
    notes:
      "Owner-created review figure, optimised from a PNG master to WebP with no crop, recolour or removal of in-image text. Published only because its printed claims agree with the review — see REVIEW_FIGURES_WITHHELD for the ones that do not.",
  };
});

/* ------------------------------------------------------------------ */
/* Branded product placeholders                                        */
/* ------------------------------------------------------------------ */

interface ManifestEntry {
  slug: string;
  model: string;
  src: string;
  width: number;
  height: number;
  checksum: string;
}

const manifest = MANIFEST as ManifestEntry[];

/**
 * Alt text for a placeholder must describe what the reader actually sees — a
 * BotPlanet panel naming a model — and must not claim to show the product.
 * That distinction is the whole reason placeholders are catalogued separately.
 */
const placeholderAlt = (model: string) =>
  `BotPlanet placeholder panel naming the ${model}. Product photography is not yet available under a licence we hold.`;

export const PLACEHOLDER_ASSETS: MediaAssetRecord[] = manifest.map((m): MediaAssetRecord => {
  const productId = PRODUCT_ID[m.slug] ?? `prod-${m.slug}`;
  const verified = VERIFICATIONS.find((v) => v.productId === productId);
  return {
    ...base(`ph-${m.slug}`, "placeholder"),
    productId,
    purpose: null,
    // The exact model comes from the Job 8 verification record, not from the
    // slug, so a placeholder can never drift onto a sibling model.
    exactModel: verified?.identity.canonicalName ?? m.model,
    type: "branded_placeholder",
    checksum: m.checksum,
    width: m.width,
    height: m.height,
    src: m.src,
    altText: placeholderAlt(verified?.identity.canonicalName ?? m.model),
    altTextStatus: "approved",
    schema: PLACEHOLDER_SCHEMA,
    depictsRealProduct: false,
    notes: "Vector artwork: it scales to every rendered size without derivatives, so no raster variants are generated and none are missing.",
  };
});


/* ------------------------------------------------------------------ */
/* The 9 August 2026 upload                                            */
/* ------------------------------------------------------------------ */

/**
 * 53 files, every one of them opened before it was written down here.
 *
 * TWO THINGS ABOUT THIS ROUND. It is INFOGRAPHICS rather than photographs:
 * most of these carry headline type, feature chips and body copy set into the
 * file, under BotPlanet branding — so a claim in the artwork reads as ours, and
 * it cannot carry the date or the source that a claim on this site normally
 * carries. It also cannot be corrected later: text in a caption is editable,
 * text in a WebP is not.
 *
 * Those files are typed `promotional_panel` and take ORIGINAL_SCHEMA, which
 * shuts Product structured data on them. A panel asserting "long-lasting
 * battery" must not reach a consumer as this machine's photograph. The clean
 * photographs beside them are `depiction` and open everywhere, which is the
 * whole reason both types exist.
 *
 * THIS IS A SEPARATE ARRAY RATHER THAN THE END OF ORIGINAL_ASSETS, and the
 * reason is resolution order. Appended to ORIGINAL_ASSETS these sit AHEAD of
 * OWNER_PRODUCT_ARTWORK, and the first `product_hero` in the register stops
 * being a pool creative — which is a silent re-ranking of every pool listing
 * card, not a new-category change. Spread after the pool artwork, each of
 * these still resolves for its own product and none of them outranks anything.
 *
 * SET ASIDE ON THE DAY and deliberately absent: two branded cards stating
 * 1080p for machines the evidence ledger records at 2K and 2.5K, a Ropet panel
 * asserting encryption and data handling under our own mark, and a ROLA layout
 * sheet with the slot names printed on it. See
 * docs/seo/notion-upload-audit-2026-08-09.md.
 */
export const AUGUST_UPLOAD_ASSETS: MediaAssetRecord[] = [

/* ============================================================
   BOT FINDER CARDS — supplied 10 August 2026.

   A COMPOSED ADVERTISEMENT, NOT A PRODUCT PICTURE. Each carries
   its own headline, logo and frame in the pixels and leaves one
   rectangle at the bottom EMPTY for a real HTML button — see
   components/BotFinderCard.astro and content/finder-cards.ts.

   `promotional_panel`, and deliberately not anything in the
   listing-card fallback chain. These must never resolve as a
   product's photograph: the universal card shows eight machines at
   once and the window card shows four, so any product they
   "depicted" would be the wrong one. ORIGINAL_SCHEMA and
   depictsRealProduct: false keep them out of Product structured
   data for the same reason.

   THE ALT TEXT IS LOAD-BEARING HERE, more than anywhere else on
   the site. Every word of the pitch is pixels; without alt text
   these pages say nothing about them to a screen reader or a
   crawler.
   ============================================================ */

  {
    ...base("finder-card-universal", "illustration"),
    productId: null,
    purpose: "Homepage — universal Bot Finder card",
    exactModel: null,
    type: "promotional_panel",
    checksum: "sha256:1f1d8496751531ca8e326dabbb82de7607a6a064f67a82d4cef14b04bd50c7c1",
    width: 1122,
    height: 1402,
    src: "/media/botmatch/finder-universal.webp",
    altText:
      "A BotPlanet card headed \u201cFind your perfect bot \u2014 universal bot finder\u201d, showing a line-up of home robots together in one room: a window-cleaning robot on glass, a companion robot, a furry robot pet, a coding robot in a clear ball, a pet camera robot, a robot vacuum, a robot lawn mower on grass and a pool cleaner in water.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("finder-card-coding", "illustration"),
    productId: null,
    purpose: "Coding hub — Bot Finder card",
    exactModel: null,
    type: "promotional_panel",
    checksum: "sha256:8681fe53980aec1bf43f05c5c76b4486fcf890419f78bdab434d4e96559d5a57",
    width: 1122,
    height: 1402,
    src: "/media/botmatch/finder-coding.webp",
    altText:
      "A BotPlanet card headed \u201cEducational robots \u2014 smart picks, STEM made fun\u201d, showing three children playing with coding robots at a table, with labels reading screen-free coding, programmable robots, STEM build kits and ages 4 to teen.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("finder-card-vacuum", "illustration"),
    productId: null,
    purpose: "Vacuum hub — Bot Finder card",
    exactModel: null,
    type: "promotional_panel",
    checksum: "sha256:662dcc72c4586887677d1e582f0289ec7fb842d8cbfe802ad7d67fd9011ef898",
    width: 1024,
    height: 1536,
    src: "/media/botmatch/finder-vacuum.webp",
    altText:
      "A BotPlanet card headed \u201cFloor cleaning bots \u2014 smart picks, cleaner floors\u201d, showing four robot vacuums across a home including one docking at a self-empty tower and two on a rug beside a golden retriever, with labels reading vacuum and mop, self-empty docks, pet hair ready, and hard floor plus carpet.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("finder-card-lawn", "illustration"),
    productId: null,
    purpose: "Lawn hub — Bot Finder card",
    exactModel: null,
    type: "promotional_panel",
    checksum: "sha256:af68de91fac11957301eb7fe8abc3e4a370ebdb197ea840de5e2cf9583927f32",
    width: 1122,
    height: 1402,
    src: "/media/botmatch/finder-lawn.webp",
    altText:
      "A BotPlanet card headed \u201cRobotic lawn mowers \u2014 smart picks, better lawns\u201d, showing four robot mowers cutting striped lawns beside flower borders, one passing a rabbit, with labels reading wire-free picks, small garden fits, pet and wildlife aware, and steep slope ready.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("finder-card-petcam", "illustration"),
    productId: null,
    purpose: "Pet camera hub — Bot Finder card",
    exactModel: null,
    type: "promotional_panel",
    checksum: "sha256:89e43f1765387df96ca21ae515f11172173caa6f3ebf1a2215d97e2fd468c7a0",
    width: 1122,
    height: 1402,
    src: "/media/botmatch/finder-petcam.webp",
    altText:
      "A BotPlanet card headed \u201cAnimal photography bots\u201d, showing four wheeled pet camera robots on a lit platform, with photographs above of a dog leaping over a pool, a child playing with a puppy beside one, and a cat watching another, and labels reading pet monitoring, playful interaction, night viewing and home-friendly design.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("finder-card-companion", "illustration"),
    productId: null,
    purpose: "Companion hub — Bot Finder card",
    exactModel: null,
    type: "promotional_panel",
    checksum: "sha256:5d46626dcba4047fd15a3b23fd417aecd61b2594175856d422f73db4ab035581",
    width: 1024,
    height: 1536,
    src: "/media/botmatch/finder-companion.webp",
    /* The machines in this one are RENDERED LIKENESSES, close enough to name —
       one carries the word "Eilik" on its chest. depictsRealProduct stays
       false and the record stays out of Product schema for exactly that
       reason: a drawing that resembles a product is not that product's
       photograph, and must never stand as one. */
    altText:
      "A BotPlanet card headed \u201cCompanion robots \u2014 smart picks, real personality\u201d, showing five desk and pet companion robots together on a rug in a dark living room, with labels reading expressive personalities, desk buddies, pet-like companions and family-friendly picks, and a line reading \u201cFind your perfect companion robot in 60 seconds\u201d.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("finder-card-litter", "illustration"),
    productId: null,
    purpose: "Litter hub — Bot Finder card",
    exactModel: null,
    type: "promotional_panel",
    checksum: "sha256:733af8b394f30515d9c6b2b62f9d7ac94e0ad9de13e27d269b68dec6a1614d53",
    width: 1024,
    height: 1536,
    src: "/media/botmatch/finder-litter.webp",
    altText:
      "A BotPlanet card headed \u201cCat litter bots \u2014 smart picks, happier cats\u201d, showing five self-cleaning litter boxes in a dark utility room with four cats around them, one sitting inside a globe-shaped unit, with labels reading self-scooping picks, open-entry options, odor-control designs and multi-cat homes, and a line reading \u201cFind your perfect cat litter robot in 60 seconds\u201d.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("finder-card-grill", "illustration"),
    productId: null,
    purpose: "Grill hub — Bot Finder card",
    exactModel: null,
    type: "promotional_panel",
    checksum: "sha256:05eba6b19391ab003cab6468bee64c65d41606d87cd57da7c35ce02d289906aa",
    width: 1122,
    height: 1402,
    src: "/media/botmatch/finder-grill.webp",
    altText:
      "A BotPlanet card headed \u201cGrill cleaning bots \u2014 smart picks, cleaner grills\u201d, showing four grill-cleaning robots with brush rollers working across the grates of a large open stainless barbecue at dusk, a fire pit behind, with labels reading brush rollers, open-lid cleaning, patio-ready picks and easy-maintenance bots.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("finder-card-pool", "illustration"),
    productId: null,
    purpose: "Pool hub — Bot Finder card",
    exactModel: null,
    type: "promotional_panel",
    checksum: "sha256:49f03df93a6ae9d127291580260007f5bd481b2e901837780b5916b1f083a048",
    width: 1122,
    height: 1402,
    src: "/media/botmatch/finder-pool.webp",
    altText:
      "A BotPlanet card headed \u201cPool cleaning bots \u2014 smart picks, cleaner pools\u201d, showing six pool-cleaning robots around a lit night-time pool: two on the deck, three in the water throwing spray, and one climbing a tiled wall, with labels reading cordless picks, wall climbers, skimmer bots and app-ready models.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("finder-card-window", "illustration"),
    productId: null,
    purpose: "Window hub — Bot Finder card",
    exactModel: null,
    type: "promotional_panel",
    checksum: "sha256:3d665f2b48a114298b658c7bd7404f33a8d6938c48e2349d3e464a84bdaf3d78",
    width: 1122,
    height: 1402,
    src: "/media/botmatch/finder-window.webp",
    altText:
      "A BotPlanet card headed \u201cWindow cleaning bots \u2014 smart picks, clearer views\u201d, showing four window-cleaning robots working on a tall city window at dusk, one spraying, each on a safety cord, with labels reading spray models, vacuum hold and app-ready picks.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },

/* ============================================================
   TIER-1 LISTING CARDS — supplied 10 August 2026.

   SIXTEEN PRODUCTS WERE LIVE WITH AN EMPTY SPACE WHERE THEIR
   PICTURE GOES. These fill every one of them.

   TYPED `branded_placeholder`, NOT `product_hero`, AND THE
   DISTINCTION IS DELIBERATE. Fourteen of the sixteen are branded
   BotPlanet panels with the product's NAME set into the pixels and
   a styled surround. That is exactly what this type exists for: a
   BotPlanet-authored image standing in the card slot. It resolves
   the listing card — see lib/media-registry.ts, which falls back
   through `product_hero` then `branded_placeholder` — so every
   empty slot fills, while `depictsRealProduct: false` and
   ORIGINAL_SCHEMA keep them out of Product structured data, where
   an AI-rendered panel has no business claiming to be the
   manufacturer's product image.

   TWO ARE PLAIN AND ARE TYPED AS DEPICTIONS: Cozmo and Moxie
   arrived as clean product shots on white with no text, which is
   what a card should be.

   ONE HONEST RESERVATION, RECORDED RATHER THAN ACTED ON. A card is
   served at 360px in a grid, and a product name set into the
   picture is an illegible smear at that size — the same reason the
   Joy For All slot was left empty on 9 August. The owner decision
   of 9 August is that all supplied artwork is used and set-aside is
   not an outcome available here, so these ship. The fix, if it is
   ever wanted, is a re-render without the name: Cozmo and Moxie
   below show exactly what that looks like.
   ============================================================ */

  {
    ...base("litter-robot-4-card", "illustration"),
    productId: "prod-litter-robot-4",
    purpose: "Litter-Robot 4 — listing card",
    exactModel: "Litter-Robot 4",
    type: "branded_placeholder",
    checksum: "sha256:47c50cf6bc7ac7b4b3a99225bfe0d8c61ee770445538c31104d6f9684a3b2648",
    width: 1254,
    height: 1254,
    src: "/media/litter/litter-robot-4/card.webp",
    altText:
      "A BotPlanet card for the Litter-Robot 4: the tall black globe-and-base unit in a dark utility room with a tabby cat standing beside it, with the model name and the BotPlanet logo set into the image.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("petkit-purobot-max-pro-2-card", "illustration"),
    productId: "prod-petkit-purobot-max-pro-2",
    purpose: "PETKIT Purobot Max Pro 2 — listing card",
    exactModel: "PETKIT Purobot Max Pro 2",
    type: "branded_placeholder",
    checksum: "sha256:fe0d8be86d345b68b261872d732e93bbbecc8c5d9efc11c3e23dea5b4da2cac6",
    width: 1254,
    height: 1254,
    src: "/media/litter/petkit-purobot-max-pro-2/card.webp",
    altText:
      "A BotPlanet card for the PETKIT Purobot Max Pro 2: the drum unit with its wide opening facing the camera, with the model name and the BotPlanet logo set into the image.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("casa-leo-loo-too-card", "illustration"),
    productId: "prod-casa-leo-loo-too",
    purpose: "Casa Leo Leo’s Loo Too — listing card",
    exactModel: "Casa Leo Leo’s Loo Too",
    type: "branded_placeholder",
    checksum: "sha256:cd14a15eafc3f56159c374eb26bbe98c1a9edc1847726bec73b9ccb622be03fd",
    width: 1254,
    height: 1254,
    src: "/media/litter/casa-leo-loo-too/card.webp",
    altText:
      "A BotPlanet card for the Casa Leo Leo’s Loo Too: the domed unit on a plain floor, with the model name and the BotPlanet logo set into the image.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("petsafe-scoopfree-crystal-pro-card", "illustration"),
    productId: "prod-petsafe-scoopfree-crystal-pro",
    purpose: "PetSafe ScoopFree Crystal Pro — listing card",
    exactModel: "PetSafe ScoopFree Crystal Pro",
    type: "branded_placeholder",
    checksum: "sha256:c4a4fea95cdda056aa6d1482ad16ef3b6c7e320a4244b6ef240051903c68c194",
    width: 1254,
    height: 1254,
    src: "/media/litter/petsafe-scoopfree-crystal-pro/card.webp",
    altText:
      "A BotPlanet card for the PetSafe ScoopFree Crystal Pro: the white flat-tray unit with a hooded cover and a cat standing on the tray, with the model name and the BotPlanet logo set into the image.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("segway-navimow-i110n-card", "illustration"),
    productId: "prod-navimow-i110n",
    purpose: "Segway Navimow i110N — listing card",
    exactModel: "Segway Navimow i110N",
    type: "branded_placeholder",
    checksum: "sha256:6bce3c8ca9faefc713bce3cc432c6b7ed3261928fff293a094be175a82a56977",
    width: 1254,
    height: 1254,
    src: "/media/lawn/segway-navimow-i110n/card.webp",
    altText:
      "A BotPlanet card for the Segway Navimow i110N: the mower on cut grass with no dock in frame, with the model name and the BotPlanet logo set into the image.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("mammotion-luba-3-awd-1500h-card", "illustration"),
    productId: "prod-luba-3-awd-1500h",
    purpose: "Mammotion LUBA 3 AWD 1500H — listing card",
    exactModel: "Mammotion LUBA 3 AWD 1500H",
    type: "branded_placeholder",
    checksum: "sha256:96e1b03e712792b8cfaccb355952090f81e78a3904c331723a9af61331f6cdbb",
    width: 1254,
    height: 1254,
    src: "/media/lawn/mammotion-luba-3-awd-1500h/card.webp",
    altText:
      "A BotPlanet card for the Mammotion LUBA 3 AWD 1500H: the white and orange all-wheel-drive mower on a lawn with all four wheels visible, with the model name and the BotPlanet logo set into the image.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("mammotion-luba-3-awd-3000h-card", "illustration"),
    productId: "prod-luba-3-awd-3000h",
    purpose: "Mammotion LUBA 3 AWD 3000H — listing card",
    exactModel: "Mammotion LUBA 3 AWD 3000H",
    type: "branded_placeholder",
    checksum: "sha256:3a04fca85c6891b0b0cdb01bd37a1a9fb05f47c84cdafe3b29a640869c604f8b",
    width: 1254,
    height: 1254,
    src: "/media/lawn/mammotion-luba-3-awd-3000h/card.webp",
    altText:
      "A BotPlanet card for the Mammotion LUBA 3 AWD 3000H: the all-wheel-drive mower on a lawn, same angle as the 1500H, with the model name and the BotPlanet logo set into the image.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("husqvarna-automower-410iq-card", "illustration"),
    productId: "prod-automower-410iq",
    purpose: "Husqvarna Automower 410iQ — listing card",
    exactModel: "Husqvarna Automower 410iQ",
    type: "branded_placeholder",
    checksum: "sha256:bbb46f33126378081a9005851d9589157011b757e50b1a590cb10b658f104250",
    width: 1536,
    height: 1024,
    src: "/media/lawn/husqvarna-automower-410iq/card.webp",
    altText:
      "A BotPlanet card for the Husqvarna Automower 410iQ: the mower on grass with no boundary wire in shot, with the model name and the BotPlanet logo set into the image.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("worx-landroid-vision-wr320-card", "illustration"),
    productId: "prod-worx-landroid-vision-wr320",
    purpose: "WORX Landroid Vision Cloud WR320 — listing card",
    exactModel: "WORX Landroid Vision Cloud WR320",
    type: "branded_placeholder",
    checksum: "sha256:8f9b017305318ae186d369188f480f8305715484899b7ce206fd3bb668d9f43d",
    width: 1536,
    height: 1024,
    src: "/media/lawn/worx-landroid-vision-wr320/card.webp",
    altText:
      "A BotPlanet card for the WORX Landroid Vision Cloud WR320: the orange-bodied mower on grass, with the model name and the BotPlanet logo set into the image.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("eufy-e15-card", "illustration"),
    productId: "prod-eufy-e15",
    purpose: "eufy Robot Lawn Mower E15 — listing card",
    exactModel: "eufy Robot Lawn Mower E15",
    type: "branded_placeholder",
    checksum: "sha256:a94a50ac9f0a14d04b8ec540280444345f77cce6f15938496b1aa525d65c0fc1",
    width: 1254,
    height: 1254,
    src: "/media/lawn/eufy-e15/card.webp",
    altText:
      "A BotPlanet card for the eufy Robot Lawn Mower E15: the mower on grass with its front camera housing visible, with the model name and the BotPlanet logo set into the image.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("dreame-a3-awd-1000-card", "illustration"),
    productId: "prod-dreame-a3-awd-1000",
    purpose: "DREAME A3 AWD 1000 — listing card",
    exactModel: "DREAME A3 AWD 1000",
    type: "branded_placeholder",
    checksum: "sha256:267cd1ad4cdc503e097901fc0d559c0c5ca7f2494c2d94f53bc4e2941df661f1",
    width: 1254,
    height: 1254,
    src: "/media/lawn/dreame-a3-awd-1000/card.webp",
    altText:
      "A BotPlanet card for the DREAME A3 AWD 1000: the mower on grass with the LiDAR turret on top, with the model name and the BotPlanet logo set into the image.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("ecovacs-winbot-w2s-card", "illustration"),
    productId: "prod-ecovacs-winbot-w2s",
    purpose: "ECOVACS WINBOT W2S — listing card",
    exactModel: "ECOVACS WINBOT W2S",
    type: "branded_placeholder",
    checksum: "sha256:dc264f77e1a8fbabbd40bdcd8632ba78e54d5d9f360f07c2e056ed228757b3f8",
    width: 1402,
    height: 1122,
    src: "/media/window/ecovacs-winbot-w2s/card.webp",
    altText:
      "A BotPlanet card for the ECOVACS WINBOT W2S: the window robot alone on clear glass with no station in frame, with the model name and the BotPlanet logo set into the image.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("ecovacs-winbot-mini-card", "illustration"),
    productId: "prod-ecovacs-winbot-mini",
    purpose: "ECOVACS WINBOT Mini — listing card",
    exactModel: "ECOVACS WINBOT Mini",
    type: "branded_placeholder",
    checksum: "sha256:793a7f0fe268424e8f326c2eba6278adf36cba4fbcbb038040f1bbc5f419859c",
    width: 1254,
    height: 1254,
    src: "/media/window/ecovacs-winbot-mini/card.webp",
    altText:
      "A BotPlanet card for the ECOVACS WINBOT Mini: the small window robot alone on a plain background, with the model name and the BotPlanet logo set into the image.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("cozmo-card", "depiction"),
    productId: "prod-cozmo",
    purpose: "Cozmo — listing card",
    exactModel: "Cozmo",
    type: "product_hero",
    checksum: "sha256:42eca1e2e25da8c22f4454f48d210018c4f32349dcec883c1554086f1d437614",
    width: 1536,
    height: 1024,
    src: "/media/coding/cozmo/card.webp",
    altText:
      "A clean studio shot of the small white and red tracked robot alone on a plain white background.",
    altTextStatus: "approved",
    schema: DEPICTION_SCHEMA,
    depictsRealProduct: true,
  },
  {
    ...base("moxie-card", "depiction"),
    productId: "prod-moxie",
    purpose: "Moxie — listing card",
    exactModel: "Moxie",
    type: "product_hero",
    checksum: "sha256:dbc31ef02bce63d499c82973d70bc2043506e0da8ced297c0546078afa5c1b28",
    width: 1536,
    height: 1024,
    src: "/media/companion/moxie/card.webp",
    altText:
      "A clean studio shot of the robot alone on a plain background.",
    altTextStatus: "approved",
    schema: DEPICTION_SCHEMA,
    depictsRealProduct: true,
  },

  /* FIVE PRODUCTS RESOLVED NO LISTING CARD, found on 9 August 2026 by asking
     the registry rather than by looking at a page. resolveImage(id,
     "listing_card") returns the first `product_hero` for a product, and these
     five had their card art typed `product_in_use` or `product_detail` — true
     descriptions of the picture, and the wrong answer to "what does the grid
     show for this machine". Their hub cards were falling through to nothing.

     Retyped rather than duplicated: a second record per product is exactly
     what the note above REVIEW_FIGURES warns about, because it outranks the
     product creative. Nothing is outranked here — there was no creative. */

  /* ==================================================================
     THE SEVEN HELD BACK ON 9 AUGUST, PUBLISHED BY OWNER DECISION.

     Four of these were withheld on the day: two panels printing 1080p
     for cameras Enabot's own listing records at 2K and 2.5K, a size
     chart printing 3.1 inches for a robot the same listing gives as
     3.8, and a Ropet panel asserting encryption and data handling.
     The owner's ruling of 9 August is that his artwork is published,
     and that where a file carries a maker's figure or claim the
     caption attributes it to the maker. That is what the alt text
     below does, in every case, naming the conflicting figure rather
     than leaving a reader to assume the number is ours.

     All seven are promotional_panel on ORIGINAL_SCHEMA, so none of
     them can enter Product structured data. A disputed figure may
     appear on a page with its owner named; it may not be handed to a
     search engine as this machine's photograph.
     ================================================================== */
  {
    ...base("ebo-air-2-panel-overview", "illustration"),
    productId: "prod-enabot-ebo-air-2",
    purpose: "EBO Air 2 review — maker's overview panel",
    exactModel: "Enabot EBO Air 2",
    type: "promotional_panel",
    checksum: "sha256:f2fe7242524d5970893e124b4cc2c30fd906f797a501e4f7debdec4494fd5a64",
    width: 1448,
    height: 1086,
    src: "/media/petcam/ebo-air-2/panel-overview.webp",
    altText:
      "The Enabot EBO Air 2 on a dark surface beside panels of Enabot's own feature copy. The panel reads 1080p HD video; Enabot's own listing records this camera as 2K, and the figure on the artwork is the maker's wording rather than a BotPlanet measurement.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("rola-petpal-panel-overview", "illustration"),
    productId: "prod-enabot-rola-petpal",
    purpose: "ROLA PetPal review — maker's overview panel",
    exactModel: "Enabot ROLA PetPal",
    type: "promotional_panel",
    checksum: "sha256:9357276c7df64416ec7254fd4183ababc88fa2fb3a56570155be2016366467ab",
    width: 1254,
    height: 1254,
    src: "/media/petcam/rola-petpal/panel-overview.webp",
    altText:
      "The ROLA PetPal with its treat hopper open beside a phone showing a cat on camera, under Enabot's own feature list. The panel reads 1080p HD pet camera; Enabot's own listing records 2.5K, and the figure on the artwork is the maker's rather than a BotPlanet measurement.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("rola-petpal-panel-summary", "illustration"),
    productId: "prod-enabot-rola-petpal",
    purpose: "ROLA PetPal review — maker's summary sheet",
    exactModel: "Enabot ROLA PetPal",
    type: "promotional_panel",
    checksum: "sha256:4ebdd3288c816158d49fe8f5996676470bf4ecc5e1bdab9805214098a1a6fff3",
    width: 1402,
    height: 1122,
    src: "/media/petcam/rola-petpal/panel-summary.webp",
    altText:
      "A four-panel sheet: a dog taking a treat, the open dispenser, the PetPal beside the much smaller Air 2, and the PetPal lighting a raccoon at night. The size and night-vision claims on it are Enabot's own wording.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("petcam-range-size-chart", "illustration"),
    productId: "prod-enabot-rola-petpal",
    purpose: "Enabot range page — maker's size chart",
    exactModel: "Enabot ROLA PetPal",
    type: "promotional_panel",
    checksum: "sha256:c778c8247ca91edf42e91f06b7358e0bf8be0b6aab3d7cf357fe4f6cf6493ad5",
    width: 1536,
    height: 1024,
    src: "/media/petcam/range/size-chart.webp",
    altText:
      "A size comparison of the Enabot SE against the ROLA PetPal with dimensions printed beside each. The figures are the maker's; Enabot's own listing gives the SE as 3.8 inches wide where this chart reads 3.1.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("ropet-panel-diary-privacy", "illustration"),
    productId: "prod-ropet",
    purpose: "Ropet review — maker's diary and privacy panel",
    exactModel: "Ropet KAMOMO pro",
    type: "promotional_panel",
    checksum: "sha256:2c96546d12d6b6cf451292d8de8d06cfdb2be9b91e906aa2018d0f3dc2a61306",
    width: 1254,
    height: 1254,
    src: "/media/companion/ropet/panel-diary-privacy.webp",
    altText:
      "A panel showing Ropet's diary feature beside four claims about data handling — encryption, no data sharing, camera off by default and secure design. Every one of those is Ropet's own marketing wording, supplied with the artwork, and none has been tested by BotPlanet.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("loona-range", "illustration"),
    productId: "prod-loona",
    purpose: "Loona review — maker's overview card",
    exactModel: "Loona Petbot (KEYi Tech)",
    type: "promotional_panel",
    checksum: "sha256:e2d587736cbf948ab05b945030b0ab41f301c7338c065e9052635cc184ff5447",
    width: 1448,
    height: 1086,
    src: "/media/companion/loona/range.webp",
    altText:
      "Loona on a dark table under a headline naming it an AI companion robot. The descriptive wording set into the artwork is promotional copy rather than a BotPlanet finding.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("joy-for-all-panel-overview", "illustration"),
    productId: "prod-joy-for-all-companion-pets",
    purpose: "Robotic pets for elderly relatives — maker's overview card",
    exactModel: "Joy For All Companion Pet Cat, B7594 (Silver with White Mitts)",
    type: "promotional_panel",
    checksum: "sha256:fd4b8c7eb80fad8268992ba64dfca93ea2ae562d1a17bee0b5ecfdf04c260a00",
    width: 1448,
    height: 1086,
    src: "/media/companion/joy-for-all/panel-overview.webp",
    altText:
      "The Joy For All companion cat on a blanket with an older couple behind it, under a line describing it as designed to bring comfort and companionship. That description is Ageless Innovation's own marketing wording, not a BotPlanet finding.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-grill-row-baked-on-grease", "illustration"),
    productId: null,
    purpose: "grill hub — coverage row, baked-on grease",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:425eb4e11859eccc53ff181ac8beeb91e76b7bddc31b21b0c838e6278c510a51",
    width: 1536,
    height: 1024,
    src: "/media/hubs/grill/row-baked-on-grease.webp",
    altText:
      "The inside corner of a barbecue firebox under the grate, coated in thick black baked-on grease with the bars running across it.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-grill-row-far-corner", "illustration"),
    productId: null,
    purpose: "grill hub — coverage row, far corner",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:c38647c0f1419af93c41b274153ed2088cd701e469643c7efb4236591569ee1f",
    width: 1536,
    height: 1024,
    src: "/media/hubs/grill/row-far-corner.webp",
    altText:
      "The far corner of an open barbecue in sunlight, where the grill bars end and meet the side wall of the firebox.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-grill-row-under-grate", "illustration"),
    productId: null,
    purpose: "grill hub — coverage row, under the grate",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:c88dbf7a813ee5454410d733f3dea3cd094619d6ebd74468edb1ff6ba94b09d8",
    width: 1536,
    height: 1024,
    src: "/media/hubs/grill/row-under-grate.webp",
    altText:
      "The space below a lifted grill grate, showing the drip tray beneath it streaked with burnt-on fat.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-petcam-hero-2026-08", "illustration"),
    productId: null,
    purpose: "pet camera hub — hero",
    exactModel: null,
    type: "category_hero",
    checksum: "sha256:7abd1f855290076dde49ec7c21344942ddec24feedab49dbf43d494089d4969f",
    width: 1448,
    height: 1086,
    src: "/media/hubs/petcam/hero-2026-08.webp",
    altText:
      "A white and black rolling pet camera robot on a hallway floor, a golden retriever standing in the doorway behind it. The picture carries the words Best Pet Camera Robots.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-petcam-card-hallway", "illustration"),
    productId: null,
    purpose: "pet camera hub — card, hard flooring",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:a33701c4bf17434e80bf37d79b6d85c4e1113f2536ff31a475afe5da4546191f",
    width: 1448,
    height: 1086,
    src: "/media/hubs/petcam/card-hallway.webp",
    altText:
      "A domestic hallway of bare wooden boards running away from the camera towards a lit doorway.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-petcam-card-staircase", "illustration"),
    productId: null,
    purpose: "pet camera hub — card, staircase",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:29cb360aa35a96221913b0fde1f750b674e64f3aaccaba2350a993c36ca9d2c1",
    width: 1448,
    height: 1086,
    src: "/media/hubs/petcam/card-staircase.webp",
    altText:
      "A wooden staircase seen from floor level at the bottom step, rising away from the camera.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-petcam-card-deep-pile-rug", "illustration"),
    productId: null,
    purpose: "pet camera hub — card, deep pile",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:2b9651933f1f538037fbe9e22a3530bb38a46f55f6a72a77bf2545ec997d4d2f",
    width: 1448,
    height: 1086,
    src: "/media/hubs/petcam/card-deep-pile-rug.webp",
    altText:
      "The cut edge of a thick cream rug meeting a pale wooden floor, the pile standing well clear of the boards.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-petcam-row-dog-by-door", "illustration"),
    productId: null,
    purpose: "pet camera hub — row, dog alone",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:741b1620fd38b3383f41a224d978cb33d84e6e057e596e057bded0035e628eb0",
    width: 1448,
    height: 1086,
    src: "/media/hubs/petcam/row-dog-by-door.webp",
    altText:
      "A cockapoo sitting alone on a wooden floor beside a closed black front door, looking towards the camera.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-petcam-row-cat-watching", "illustration"),
    productId: null,
    purpose: "pet camera hub — row, cat watching",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:58529ce72eb7a69793f302cc53ea401bacb595d72ca10a148fb36fdec9227d4e",
    width: 1448,
    height: 1086,
    src: "/media/hubs/petcam/row-cat-watching.webp",
    altText:
      "A tabby and white cat crouched flat on a wooden floor, eyes fixed on a small grey ball just in front of it.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-petcam-row-empty-room", "illustration"),
    productId: null,
    purpose: "pet camera hub — row, empty room",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:066a59f4bde029de41567a19ea81e7e37ddcb669eca861c5ed620a991ad40cbe",
    width: 768,
    height: 432,
    src: "/media/hubs/petcam/row-empty-room.webp",
    altText:
      "An empty living room in the middle of the afternoon, sofa and armchair unoccupied and daylight coming through tall windows.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("hub-petcam-row-older-dog", "illustration"),
    productId: null,
    purpose: "pet camera hub — row, older dog",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:7a0a0f95f495d6d627a7712e9e5eaf497835beda98b4d15f83e07f7808b6bd84",
    width: 612,
    height: 407,
    src: "/media/hubs/petcam/row-older-dog.webp",
    altText:
      "An elderly yellow labrador asleep in a padded bed beside a window, head resting on the rim.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("moflin-hero", "illustration"),
    productId: "prod-moflin",
    purpose: "Moflin review — lead",
    exactModel: "Casio Moflin (Silver)",
    type: "promotional_panel",
    checksum: "sha256:3b9aba6752cf286620741a6babaab26419aedf6c05341d855ce1832339d1ce35",
    width: 1448,
    height: 1086,
    src: "/media/companion/moflin/hero.webp",
    altText:
      "Moflin, a small grey-brown ball of fur with a single dark eye, held in two cupped hands in a lamplit living room. Panels set into the artwork name it as an AI pet.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("moflin-figure-1", "illustration"),
    productId: "prod-moflin",
    purpose: "Moflin review — charging nest",
    exactModel: "Casio Moflin (Silver)",
    type: "promotional_panel",
    checksum: "sha256:64a4377b1a4f0ab40b20ba83fcc351708dd5c0ed03bae06d4d21a46bdb17f12c",
    width: 1448,
    height: 1086,
    src: "/media/companion/moflin/figure-1.webp",
    altText:
      "Moflin curled asleep in its open charging nest on a side table beside a mug and a book, in low evening light.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("moflin-figure-2", "illustration"),
    productId: "prod-moflin",
    purpose: "Moflin review — touch response",
    exactModel: "Casio Moflin (Silver)",
    type: "promotional_panel",
    checksum: "sha256:5aaedee12ef9baeb5cb6ae73cdf3a0028120a2a2818d2261f724ccbe9a4a89ec",
    width: 1448,
    height: 1086,
    src: "/media/companion/moflin/figure-2.webp",
    altText:
      "A hand resting on Moflin's back, the long pale fur parting under the fingers, on a knitted blanket.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("moflin-card", "depiction"),
    productId: "prod-moflin",
    purpose: "Moflin — listing card",
    exactModel: "Casio Moflin (Silver)",
    type: "product_hero",
    checksum: "sha256:264ecd48865ab29f252c929008502c83494cdd7ccb17f634a49f03f5399007dd",
    width: 1448,
    height: 1086,
    src: "/media/companion/moflin/card.webp",
    altText:
      "Moflin alone on a plain pale background, seen from the side: an oval of grey-tipped fur with one black eye and no visible face.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: true,
  },
  {
    ...base("miko-3-hero", "illustration"),
    productId: "prod-miko-3",
    purpose: "Miko 3 review — lead",
    exactModel: "Miko 3 (Red)",
    type: "promotional_panel",
    checksum: "sha256:52821841ceee367b5978cc3223f23bc1d04225e2794821b9d2ae8df7da82b71c",
    width: 1448,
    height: 1086,
    src: "/media/companion/miko-3/hero.webp",
    altText:
      "A red Miko 3 on a rug with its screen face lit blue, a child sitting cross-legged in front of it with their back to the camera.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("miko-3-figure-1", "depiction"),
    productId: "prod-miko-3",
    purpose: "Miko 3 review — the screen face",
    exactModel: "Miko 3 (Red)",
    type: "product_detail",
    checksum: "sha256:0dc6de7c9d9101da55a8dcc635ab7c3efc12cc7209da58b0dc6a102e0d650721",
    width: 1448,
    height: 1086,
    src: "/media/companion/miko-3/figure-1.webp",
    altText:
      "Close on Miko 3's screen, which shows two large cartoon eyes either side of a simple sum reading two plus three equals five.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: true,
  },
  {
    ...base("miko-3-figure-2", "depiction"),
    productId: "prod-miko-3",
    purpose: "Miko 3 review — the two colourways",
    exactModel: "Miko 3 (Red)",
    type: "product_detail",
    checksum: "sha256:1df4d8a570e2ea92c35d6ca3079d44a6be33a47e8b2884c9657866ad0b3f6603",
    width: 1448,
    height: 1086,
    src: "/media/companion/miko-3/figure-2.webp",
    altText:
      "A red Miko 3 and a blue Miko 3 side by side on a carpet, identical apart from the colour of the body.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: true,
  },
  {
    ...base("miko-3-card", "depiction"),
    productId: "prod-miko-3",
    purpose: "Miko 3 — listing card",
    exactModel: "Miko 3 (Red)",
    type: "product_hero",
    checksum: "sha256:eb975316436c6f063000f902fdf2b4762adf1a34dde32d25c5c8bc8769fc0582",
    width: 1448,
    height: 1086,
    src: "/media/companion/miko-3/card.webp",
    altText:
      "A red Miko 3 alone on a garden path surrounded by flowers, screen face lit and facing the camera.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: true,
  },
  {
    ...base("vector-2-hero", "illustration"),
    productId: "prod-vector-2",
    purpose: "Vector 2.0 review — lead",
    exactModel: "Anki Vector 2.0 (Black)",
    type: "promotional_panel",
    checksum: "sha256:7f2cb6a2e681f3c046b73f819b763ab99ab09d42bc96efb528d82a458f93e58e",
    width: 1448,
    height: 1086,
    src: "/media/companion/vector-2/hero.webp",
    altText:
      "Anki Vector on a dark desk at night, its screen face lit green, its cube glowing beside it.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("vector-2-figure-1", "depiction"),
    productId: "prod-vector-2",
    purpose: "Vector 2.0 review — on the dock",
    exactModel: "Anki Vector 2.0 (Black)",
    type: "product_detail",
    checksum: "sha256:9b2125e63c3bb2e7af476f7ccdf513ed60d1a5f42448c2328ad2fb3195e544c4",
    width: 1448,
    height: 1086,
    src: "/media/companion/vector-2/figure-1.webp",
    altText:
      "Vector reversed onto its black charging dock, shot low and close, the dock's indicator lit blue.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: true,
  },
  {
    ...base("vector-2-figure-2", "depiction"),
    productId: "prod-vector-2",
    purpose: "Vector 2.0 review — scale in a hand",
    exactModel: "Anki Vector 2.0 (Black)",
    type: "product_in_use",
    checksum: "sha256:adc326fef24943cf1699a83ca6fed2aa7a1fb844b23887557f325b1f842f37de",
    width: 1448,
    height: 1086,
    src: "/media/companion/vector-2/figure-2.webp",
    altText:
      "Vector sitting in an open palm, small enough that it fits inside the fingers with room to spare.",
    altTextStatus: "approved",
    schema: DEPICTION_SCHEMA,
    depictsRealProduct: true,
  },
  {
    ...base("vector-2-card", "depiction"),
    productId: "prod-vector-2",
    purpose: "Vector 2.0 — listing card",
    exactModel: "Anki Vector 2.0 (Black)",
    type: "product_hero",
    checksum: "sha256:9ec7b7e055a65c41ef051e5d5b67efcb16619d9d79a38b3326e3bb6348ee7cbd",
    width: 1448,
    height: 1086,
    src: "/media/companion/vector-2/card.webp",
    altText:
      "Vector on a dark office desk beside a keyboard and a potted succulent, tracks on the surface and screen face lit green.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: true,
  },
  {
    ...base("eilik-hero", "depiction"),
    productId: "prod-eilik",
    purpose: "Eilik review — lead",
    exactModel: "Eilik (Energize Lab)",
    type: "product_in_use",
    checksum: "sha256:5b2427c949f141804ca665df1646cd2774c3d1fc29e0ce78648998db6f26c220",
    width: 1448,
    height: 1086,
    src: "/media/companion/eilik/hero.webp",
    altText:
      "Two Eiliks on a wooden desk turned towards each other, one white with pink trim and one orange, both screen faces lit.",
    altTextStatus: "approved",
    schema: DEPICTION_SCHEMA,
    depictsRealProduct: true,
  },
  {
    ...base("eilik-figure-1", "depiction"),
    productId: "prod-eilik",
    purpose: "Eilik review — the colourways",
    exactModel: "Eilik (Energize Lab)",
    type: "product_detail",
    checksum: "sha256:fef6849dde0eb067858b6377e7f4524e0292e7d6ca16ebdf0bb1dcb0915412ad",
    width: 1448,
    height: 1086,
    src: "/media/companion/eilik/figure-1.webp",
    altText:
      "Four Eiliks in a row on a pale surface, trimmed gold, blue, pink and grey, each with a black screen face and raised arms.",
    altTextStatus: "approved",
    schema: DEPICTION_SCHEMA,
    depictsRealProduct: true,
  },
  {
    ...base("eilik-figure-2", "depiction"),
    productId: "prod-eilik",
    purpose: "Eilik review — DQ beside the standard",
    exactModel: "Eilik (Energize Lab)",
    type: "product_detail",
    checksum: "sha256:4cbe8efa8a594b5eb2d1911c29c4c161fc297e2b3f94fd3fefad9932ba3c9068",
    width: 1448,
    height: 1086,
    src: "/media/companion/eilik/figure-2.webp",
    altText:
      "A white and pink Eilik beside an orange Eilik DQ on a desk, the DQ holding a tool and with more tools laid out in front of it.",
    altTextStatus: "approved",
    schema: DEPICTION_SCHEMA,
    depictsRealProduct: true,
  },
  {
    ...base("eilik-card", "depiction"),
    productId: "prod-eilik",
    purpose: "Eilik — listing card",
    exactModel: "Eilik (Energize Lab)",
    type: "product_hero",
    checksum: "sha256:c474ee1ebe953aad8e3850642c02de4587b279df6b9fb92e7721220d30cc851d",
    width: 1086,
    height: 1448,
    src: "/media/companion/eilik/card.webp",
    altText:
      "A single white and pink Eilik on a pale disc, arms raised, lit by a glowing ring behind it.",
    altTextStatus: "approved",
    schema: DEPICTION_SCHEMA,
    depictsRealProduct: true,
  },
  {
    ...base("eilik-range", "illustration"),
    productId: "prod-eilik",
    purpose: "Eilik review — the whole range",
    exactModel: "Eilik (Energize Lab)",
    type: "promotional_panel",
    checksum: "sha256:4d7c86a5e95954c48d42f2936d61aeb7b87ffa50624fff5504840994bdc421e6",
    width: 1448,
    height: 1086,
    src: "/media/companion/eilik/range.webp",
    altText:
      "Twelve Eilik-family robots arranged on shelves, including the AI Station dome, the DQ, the Panxer and the hooded Eiliko, in several colourways.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("loona-hero", "depiction"),
    productId: "prod-loona",
    purpose: "Loona review — lead",
    exactModel: "Loona Petbot (KEYi Tech)",
    type: "product_in_use",
    checksum: "sha256:2e71196b69b43781ac53e5cf17bfcb82e5e93777b2fae5ee92a8330c6b28f88f",
    width: 1448,
    height: 1086,
    src: "/media/companion/loona/hero.webp",
    altText:
      "Loona on a wooden floor with its ears up and screen face lit amber, a real golden doodle lying a few feet behind it.",
    altTextStatus: "approved",
    schema: DEPICTION_SCHEMA,
    depictsRealProduct: true,
  },
  {
    ...base("loona-figure-1", "depiction"),
    productId: "prod-loona",
    purpose: "Loona review — the screen face",
    exactModel: "Loona Petbot (KEYi Tech)",
    type: "product_detail",
    checksum: "sha256:d09d49167e7b2672da6bf6a6d3f5da248c5211bed518da5409c1cffb698557f5",
    width: 1448,
    height: 1086,
    src: "/media/companion/loona/figure-1.webp",
    altText:
      "Close on Loona's face in a child's bedroom, the screen showing two curved amber shapes for closed, contented eyes.",
    altTextStatus: "approved",
    schema: DEPICTION_SCHEMA,
    depictsRealProduct: true,
  },
  {
    ...base("loona-figure-2", "illustration"),
    productId: "prod-loona",
    purpose: "Loona review — what is in the box",
    exactModel: "Loona Petbot (KEYi Tech)",
    type: "included_accessories",
    checksum: "sha256:1d2c9b31de9e5c7b3d6d161b01ffa324305f0f072420e8dddf424ba373beb435",
    width: 1536,
    height: 1024,
    src: "/media/companion/loona/figure-2.webp",
    altText:
      "Loona on a table beside its retail box, its ball, a small beacon and three charging parts laid out in front of it.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("loona-card", "depiction"),
    productId: "prod-loona",
    purpose: "Loona — listing card",
    exactModel: "Loona Petbot (KEYi Tech)",
    type: "product_hero",
    checksum: "sha256:124da98dda146a1119d216ad9e39f1c9081228b2f10169fbe10a3be8143d2a4f",
    width: 1448,
    height: 1086,
    src: "/media/companion/loona/card.webp",
    altText:
      "Loona alone on a garden path in daylight, seen from the front three-quarter, its four wheels planted and its screen face lit.",
    altTextStatus: "approved",
    schema: DEPICTION_SCHEMA,
    depictsRealProduct: true,
  },
  {
    ...base("emo-hero", "illustration"),
    productId: "prod-living-ai-emo",
    purpose: "EMO review — lead",
    exactModel: "Living.AI EMO",
    type: "promotional_panel",
    checksum: "sha256:2821d1263a23257a1a63b2d5369366b6a6b23b5472342f0252dae362fc9f67ad",
    width: 1448,
    height: 1086,
    src: "/media/companion/emo/hero.webp",
    altText:
      "EMO standing on its charging base on a desk, screen face lit cyan, headphones round its head and a small pixel display behind it.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("emo-figure-1", "illustration"),
    productId: "prod-living-ai-emo",
    purpose: "EMO review — on the charging pad",
    exactModel: "Living.AI EMO",
    type: "promotional_panel",
    checksum: "sha256:0eaa20fa83d12be0efbf955249034a5187f5a9eddfcc3cac5ef97cf0ea8e4408",
    width: 1402,
    height: 1122,
    src: "/media/companion/emo/figure-1.webp",
    altText:
      "EMO on its charging base on a dark office desk at night, a city skyline through the window behind it.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("emo-figure-2", "illustration"),
    productId: "prod-living-ai-emo",
    purpose: "EMO review — what comes with it",
    exactModel: "Living.AI EMO",
    type: "included_accessories",
    checksum: "sha256:15c80069bbedeb2dbcaeb01f6faf4a304eb5764d9fb889ecbc5f09c8674cae68",
    width: 1536,
    height: 1024,
    src: "/media/companion/emo/figure-2.webp",
    altText:
      "EMO beside the things that come with it on a dark surface: the charging base, a ball, a mat, a cable, a small pair of antlers and a card.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("emo-card", "depiction"),
    productId: "prod-living-ai-emo",
    purpose: "EMO — listing card",
    exactModel: "Living.AI EMO",
    type: "product_hero",
    checksum: "sha256:2f6097c008da08c4af127ea9ff25c865a292fbc4a903588911b5641bedfaa994",
    width: 1254,
    height: 1254,
    src: "/media/companion/emo/card.webp",
    altText:
      "A young man in headphones at a desk reaching towards EMO, which stands on its base beside a pixel display and a monitor.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: true,
  },
  {
    ...base("emo-vs-eilik-hero", "illustration"),
    productId: null,
    purpose: "EMO vs Eilik comparison — lead",
    exactModel: null,
    type: "open_graph",
    checksum: "sha256:5e6045ef735b85e650d8b02e104a1ed3845fd08a21c01b55d760ce9765873c89",
    width: 1536,
    height: 1024,
    src: "/media/companion/emo-vs-eilik/hero.webp",
    altText:
      "A white and green Eilik on the left and a black EMO on the right, split by a bright diagonal, under the question which is better, Eilik or EMO.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("ropet-hero", "illustration"),
    productId: "prod-ropet",
    purpose: "Ropet review — lead",
    exactModel: "Ropet KAMOMO pro",
    type: "promotional_panel",
    checksum: "sha256:6b1c4e78cc5be208f3712bfe6ae1fef424373e0833db99e0a173faab40051bc2",
    width: 1399,
    height: 1124,
    src: "/media/companion/ropet/hero.webp",
    altText:
      "Ropet on a desk under a hand resting on its head, a round white robot in a cream fur cover with large blue eyes.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("ropet-figure-1", "illustration"),
    productId: "prod-ropet",
    purpose: "Ropet review — covers and eye colours",
    exactModel: "Ropet KAMOMO pro",
    type: "promotional_panel",
    checksum: "sha256:43004ee49f342533df5e84cd3021db268e831df7b759e63f315e209675cf98f8",
    width: 1254,
    height: 1254,
    src: "/media/companion/ropet/figure-1.webp",
    altText:
      "A chart of Ropet's five plush covers in cream, panda, sage, lavender and pink, above five eye colours and nine face expressions.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("ropet-figure-2", "depiction"),
    productId: "prod-ropet",
    purpose: "Ropet review — asleep on charge",
    exactModel: "Ropet KAMOMO pro",
    type: "product_hero",
    checksum: "sha256:d32800ce20dd505f1aaa757ea7028c74d472e52e94a6cf46f7ec58c315271d59",
    width: 1254,
    height: 1254,
    src: "/media/companion/ropet/figure-2.webp",
    altText:
      "Ropet asleep on a bedside table with its eyes closed, a charging cable running into its base and a lamp lit behind it.",
    altTextStatus: "approved",
    schema: DEPICTION_SCHEMA,
    depictsRealProduct: true,
  },
  {
    ...base("joy-for-all-card", "illustration"),
    productId: "prod-joy-for-all-companion-pets",
    purpose: "Robotic pets for elderly relatives — Joy For All card",
    exactModel: "Joy For All Companion Pet Cat, B7594 (Silver with White Mitts)",
    /* `branded_placeholder`, not `promotional_panel`, and that one word is what
       fills the slot. The listing card resolves through product_hero then
       branded_placeholder — see lib/media-registry.ts — and a promotional panel
       is in neither chain, so this card sat in the register with its artwork on
       disk and the grid space still blank. Same file, same schema, same
       depictsRealProduct: false; only the type it is filed under, now matching
       the fourteen cards it arrived beside. */
    type: "branded_placeholder",
    checksum: "sha256:dc015febbb9a41e1d681a84a19cdc8659802824035e2a2e7df06cbf9f4cbb79e",
    width: 1536,
    height: 1024,
    src: "/media/companion/joy-for-all/card.webp",
    altText:
      "The Joy For All companion cat in silver with white mitts, lying with its paws forward, beside two inset photographs of older people holding one.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("ebo-air-2-hero", "illustration"),
    productId: "prod-enabot-ebo-air-2",
    purpose: "EBO Air 2 review — lead",
    exactModel: "Enabot EBO Air 2",
    type: "promotional_panel",
    checksum: "sha256:ac2553eae7a6bb183fc49a7c5e8d33238669ab3c163acf77fac2e6a087904599",
    width: 1254,
    height: 1254,
    src: "/media/petcam/ebo-air-2/hero.webp",
    altText:
      "The Enabot EBO Air 2 on a rug with a heart lit on its face, above a night-vision and daylight pair of the same dog and a height marked three point seven four inches.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("ebo-air-2-figure-1", "depiction"),
    productId: "prod-enabot-ebo-air-2",
    purpose: "EBO Air 2 review — on a rug",
    exactModel: "Enabot EBO Air 2",
    type: "product_in_use",
    checksum: "sha256:93ae4c831a8cee3b6ffe8fb478216b653850e06b6e531e1ad8e8ba8937833606",
    width: 1254,
    height: 1254,
    src: "/media/petcam/ebo-air-2/figure-1.webp",
    altText:
      "The EBO Air 2 parked on a grey rug in a living room at dusk, its camera lens and lit heart facing the camera.",
    altTextStatus: "approved",
    schema: DEPICTION_SCHEMA,
    depictsRealProduct: true,
  },
  {
    ...base("ebo-air-2-figure-2", "illustration"),
    productId: "prod-enabot-ebo-air-2",
    purpose: "EBO Air 2 review — tracks and docking",
    exactModel: "Enabot EBO Air 2",
    type: "promotional_panel",
    checksum: "sha256:fe31d00d9324fcbbdc5c4f63da1602c36b02db90e2e420fda8d2103233fc0c24",
    width: 1402,
    height: 1122,
    src: "/media/petcam/ebo-air-2/figure-2.webp",
    altText:
      "Two panels: the EBO Air 2 climbing the edge of a rug on its tracks, and the same robot reversing onto its charging dock.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("ebo-air-2-card", "depiction"),
    productId: "prod-enabot-ebo-air-2",
    purpose: "EBO Air 2 — listing card",
    exactModel: "Enabot EBO Air 2",
    type: "product_hero",
    checksum: "sha256:b9db425e72471b4acf35d0ce104a66334d77300cee2b158b05a6b316f21dfb23",
    width: 1254,
    height: 1254,
    src: "/media/petcam/ebo-air-2/card.webp",
    altText:
      "The EBO Air 2 on a garden path in sunlight facing a tortoise walking towards it.",
    altTextStatus: "approved",
    schema: DEPICTION_SCHEMA,
    depictsRealProduct: true,
  },
  {
    ...base("ebo-se-hero", "illustration"),
    productId: "prod-enabot-ebo-se",
    purpose: "EBO SE review — lead",
    exactModel: "Enabot EBO SE",
    type: "promotional_panel",
    checksum: "sha256:3f1e0449a6b486a127892647e167269a2b4f193294c9db0f1861a5757cce4fb4",
    width: 1254,
    height: 1254,
    src: "/media/petcam/ebo-se/hero.webp",
    altText:
      "The Enabot EBO SE on a dark wooden floor with a blue heart lit on its face, beside panels naming it a compact rolling pet camera robot.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("ebo-se-figure-1", "depiction"),
    productId: "prod-enabot-ebo-se",
    purpose: "EBO SE review — beside the Air 2",
    exactModel: "Enabot EBO SE",
    type: "product_detail",
    checksum: "sha256:3ad9f329eb74d3712dd7eadb170623090578e04b43f35bd7799a2cfc44a5d243",
    width: 1254,
    height: 1254,
    src: "/media/petcam/ebo-se/figure-1.webp",
    altText:
      "The EBO SE and the EBO Air 2 side by side on a wooden floor at the same scale and labelled, the SE noticeably the smaller and without a dock.",
    altTextStatus: "approved",
    schema: DEPICTION_SCHEMA,
    depictsRealProduct: true,
  },
  {
    ...base("ebo-se-figure-2", "depiction"),
    productId: "prod-enabot-ebo-se",
    purpose: "EBO SE review — at night",
    exactModel: "Enabot EBO SE",
    type: "product_in_use",
    checksum: "sha256:c1c496e60d0289b3a374f689e9474d3467801b871f22c11a3f44dc2ec15cbfb2",
    width: 1254,
    height: 1254,
    src: "/media/petcam/ebo-se/figure-2.webp",
    altText:
      "The EBO SE in a darkened living room with only its face lit, a cat sitting in the shadows watching it from across the floor.",
    altTextStatus: "approved",
    schema: DEPICTION_SCHEMA,
    depictsRealProduct: true,
  },
  {
    ...base("ebo-se-card", "depiction"),
    productId: "prod-enabot-ebo-se",
    purpose: "EBO SE — listing card",
    exactModel: "Enabot EBO SE",
    type: "product_hero",
    checksum: "sha256:4268e8a79300b32ed01d88f026ecd2ad9ba861b4fcd8fe4e163f7fac4913c232",
    width: 1254,
    height: 1254,
    src: "/media/petcam/ebo-se/card.webp",
    altText:
      "The EBO SE on the paving beside a swimming pool as a golden retriever leaps into the water behind it.",
    altTextStatus: "approved",
    schema: DEPICTION_SCHEMA,
    depictsRealProduct: true,
  },
  {
    ...base("rola-petpal-hero", "depiction"),
    productId: "prod-enabot-rola-petpal",
    purpose: "ROLA PetPal review — lead",
    exactModel: "Enabot ROLA PetPal",
    type: "product_in_use",
    checksum: "sha256:0da7d2b01d05c68d14e9d1eabe419f79b0d3e4a9bebbc2a70d6e7a37476d010d",
    width: 1254,
    height: 1254,
    src: "/media/petcam/rola-petpal/hero.webp",
    altText:
      "A golden retriever taking a treat from the open hopper of the ROLA PetPal on a kitchen floor.",
    altTextStatus: "approved",
    schema: DEPICTION_SCHEMA,
    depictsRealProduct: true,
  },
  {
    ...base("rola-petpal-figure-1", "depiction"),
    productId: "prod-enabot-rola-petpal",
    purpose: "ROLA PetPal review — the dispenser",
    exactModel: "Enabot ROLA PetPal",
    type: "product_hero",
    checksum: "sha256:f395c82c3fb55ce4d0b46ab460f60ca2072c18cc4ed06065fe6780c08af5fc5b",
    width: 1254,
    height: 1254,
    src: "/media/petcam/rola-petpal/figure-1.webp",
    altText:
      "The ROLA PetPal with its lid open and the hopper full of cube-shaped treats, a few of them dropped on the surface in front of it.",
    altTextStatus: "approved",
    schema: DEPICTION_SCHEMA,
    depictsRealProduct: true,
  },
  {
    ...base("rola-petpal-figure-2", "depiction"),
    productId: "prod-enabot-rola-petpal",
    purpose: "ROLA PetPal review — beside the Air 2",
    exactModel: "Enabot ROLA PetPal",
    type: "product_detail",
    checksum: "sha256:fab14dc1e0ddc34370baca1cfe87572d5812df4c3552436a7059871c5b8a308e",
    width: 1254,
    height: 1254,
    src: "/media/petcam/rola-petpal/figure-2.webp",
    altText:
      "The ROLA PetPal and the much smaller EBO Air 2 on a wooden floor at the same scale, both labelled.",
    altTextStatus: "approved",
    schema: DEPICTION_SCHEMA,
    depictsRealProduct: true,
  },
  {
    ...base("petcam-range-hero", "depiction"),
    productId: null,
    purpose: "Enabot range page — lead",
    exactModel: null,
    type: "educational_diagram",
    checksum: "sha256:ef4e280739a414ddd9b05c59d1febc766b16dbd32406cf684d9805a30a9e6ec1",
    width: 1672,
    height: 941,
    src: "/media/petcam/range/hero.webp",
    altText:
      "Four Enabot robots in a row on a dark surface at the same scale, labelled EBO Air 2, EBO SE, ROLA Mini and ROLA PetPal, smallest to largest.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: true,
  },
];


/* ------------------------------------------------------------------ */
/* Educational and coding robots, 9 August 2026                        */
/* ------------------------------------------------------------------ */

/**
 * Five products, twenty-two files, every one of them opened.
 *
 * THIS ROUND CAME FROM TWO DIFFERENT PLACES and it shows. The three Sphero
 * sets are generated art of the usual size and quality. Ozobot and Makeblock
 * arrive as small JPEGs from the makers' own press kits — 500x300 in one case
 * — so their derivative ladders stop short. The generator refuses to upscale,
 * which is why nothing here claims a width it does not have.
 *
 * TWO SUPPLIED FIGURES DISAGREE WITH THIS SITE AND BOTH ARE PUBLISHED, with
 * the disagreement named in the caption rather than smoothed over:
 *
 *   - The Ozobot card heads itself "Evo Entry Kit, Ages 4+". This review uses
 *     5 to 11, which is what Ozobot's own product title says and what its
 *     manufacturer age months support. Amazon's category field for the same
 *     listing reads "Toddler". Three sources, three answers; the caption says
 *     whose "4+" it is.
 *   - The Makeblock three-panel figure is captioned "electroics" by the maker.
 *     The typo is rendered into the file and cannot be edited out of a WebP,
 *     so the alt text says the label is misspelt in the supplied artwork
 *     rather than repeating it as though we had written it.
 */
export const CODING_UPLOAD_ASSETS: MediaAssetRecord[] = [
  {
    ...base("sphero-bolt-hero", "illustration"),
    productId: "prod-sphero-bolt",
    purpose: "Sphero BOLT review — lead",
    exactModel: "Sphero BOLT",
    type: "promotional_panel",
    checksum: "sha256:f0d78c640d2cddaec14457950be2c03bd13afbacf4f182751f831f5d2a70a7c9",
    width: 1536,
    height: 1024,
    src: "/media/coding/sphero-bolt/hero.webp",
    altText:
      "A clear Sphero BOLT on a wooden floor with its blue LED matrix lit, a child's hand reaching for it. Sphero's own name and the words programmable robotic ball are set into the artwork.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("sphero-bolt-figure-1", "depiction"),
    productId: "prod-sphero-bolt",
    purpose: "Sphero BOLT review — inside the ball",
    exactModel: "Sphero BOLT",
    type: "product_detail",
    checksum: "sha256:d9cc90703d1aa1b3ae78d1ec79cd990fbe9d85829fe28cfe3637158361836cc1",
    width: 1254,
    height: 1254,
    src: "/media/coding/sphero-bolt/figure-1.webp",
    altText:
      "Close on the BOLT through its clear shell: the 8 by 8 blue LED matrix, the drive wheels either side and the circuit board beneath.",
    altTextStatus: "approved",
    schema: DEPICTION_SCHEMA,
    depictsRealProduct: true,
  },
  {
    ...base("sphero-bolt-figure-2", "depiction"),
    productId: "prod-sphero-bolt",
    purpose: "Sphero BOLT review — coding it",
    exactModel: "Sphero BOLT",
    type: "product_in_use",
    checksum: "sha256:72eb2ca84498198729ff0ed2c1bdf15e7b0d4b172c6ca71aba12584c6553b6c4",
    width: 1536,
    height: 1024,
    src: "/media/coding/sphero-bolt/figure-2.webp",
    altText:
      "A BOLT beside an open laptop showing JavaScript that connects to the ball, sets its LED matrix and rolls it.",
    altTextStatus: "approved",
    schema: DEPICTION_SCHEMA,
    depictsRealProduct: true,
  },
  {
    ...base("sphero-bolt-card", "depiction"),
    productId: "prod-sphero-bolt",
    purpose: "Sphero BOLT — listing card",
    exactModel: "Sphero BOLT",
    type: "product_hero",
    checksum: "sha256:602e7b6d70dea52ec5ed102ed58a6276f144e837bec6ac026cd40ac6b2f78de6",
    width: 1536,
    height: 1024,
    src: "/media/coding/sphero-bolt/card.webp",
    altText:
      "A Sphero BOLT sitting on its black charging base against a plain pale background, matrix lit blue.",
    altTextStatus: "approved",
    schema: DEPICTION_SCHEMA,
    depictsRealProduct: true,
  },
  {
    ...base("sphero-mini-hero", "illustration"),
    productId: "prod-sphero-mini",
    purpose: "Sphero Mini review — lead",
    exactModel: "Sphero Mini (Blue)",
    type: "promotional_panel",
    checksum: "sha256:08913966118f84eaa75b46fa1a22e9de78291416c1f2cfb0370037e69fc3fb42",
    width: 1254,
    height: 1254,
    src: "/media/coding/sphero-mini/hero.webp",
    altText:
      "A blue and white Sphero Mini beside a phone running its driving app, with cone-shaped obstacles behind. The panel wording describing it is promotional copy rather than a BotPlanet finding.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("sphero-mini-figure-1", "depiction"),
    productId: "prod-sphero-mini",
    purpose: "Sphero Mini review — beside the BOLT",
    exactModel: "Sphero Mini (Blue)",
    type: "product_detail",
    checksum: "sha256:23da0d663615edd7fae92ec68b5bcb2055e859954e13c723b3167e458bd22c99",
    width: 1536,
    height: 1024,
    src: "/media/coding/sphero-mini/figure-1.webp",
    altText:
      "A Sphero Mini next to a Sphero BOLT on the same surface, the Mini roughly half the diameter of the BOLT.",
    altTextStatus: "approved",
    schema: DEPICTION_SCHEMA,
    depictsRealProduct: true,
  },
  {
    ...base("sphero-mini-figure-2", "depiction"),
    productId: "prod-sphero-mini",
    purpose: "Sphero Mini review — charging",
    exactModel: "Sphero Mini (Blue)",
    type: "product_detail",
    checksum: "sha256:fa69bb411b32d2310bb679a9269ca62361fca5479c7b5a99f3aa407f89340e97",
    width: 1536,
    height: 1024,
    src: "/media/coding/sphero-mini/figure-2.webp",
    altText:
      "A Sphero Mini with its blue top shell lifted off, a charging cable plugged into the clear body and a green indicator lit.",
    altTextStatus: "approved",
    schema: DEPICTION_SCHEMA,
    depictsRealProduct: true,
  },
  {
    ...base("sphero-mini-card", "depiction"),
    productId: "prod-sphero-mini",
    purpose: "Sphero Mini — listing card",
    exactModel: "Sphero Mini (Blue)",
    type: "product_hero",
    checksum: "sha256:7da2797634c65323fa6748ddfc5bbaff502a2d1d3aef2c598f4043705dc02300",
    width: 1536,
    height: 1024,
    src: "/media/coding/sphero-mini/card.webp",
    altText:
      "A blue and white Sphero Mini on a garden table with a tabby cat lying beside it, watching it.",
    altTextStatus: "approved",
    schema: DEPICTION_SCHEMA,
    depictsRealProduct: true,
  },
  {
    ...base("sphero-indi-panel-overview", "illustration"),
    productId: "prod-sphero-indi",
    purpose: "Sphero indi review — overview panel",
    exactModel: "Sphero indi At-Home Learning Kit",
    type: "promotional_panel",
    checksum: "sha256:f4b9d39730bab6be4a97c607eb2e6efc5ea0b5a8122492e4b6fe2727612ad1b9",
    width: 1254,
    height: 1254,
    src: "/media/coding/sphero-indi/panel-overview.webp",
    altText:
      "A blue Sphero indi car above four colour cards marked drive, spin, sound and wait. The line calling it a beginner coding robot that teaches real skills is promotional copy, not a BotPlanet finding.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("sphero-indi-hero", "depiction"),
    productId: "prod-sphero-indi",
    purpose: "Sphero indi review — lead",
    exactModel: "Sphero indi At-Home Learning Kit",
    type: "product_in_use",
    checksum: "sha256:2d246789807231e1e9a5196439d35c93ffd37d2c188f01623753f6e1687c4dc5",
    width: 1254,
    height: 1254,
    src: "/media/coding/sphero-indi/hero.webp",
    altText:
      "A young child kneeling on a wooden floor laying a green colour card in front of a blue indi car, with a track of red, blue and green cards already down.",
    altTextStatus: "approved",
    schema: DEPICTION_SCHEMA,
    depictsRealProduct: true,
  },
  {
    ...base("sphero-indi-figure-1", "depiction"),
    productId: "prod-sphero-indi",
    purpose: "Sphero indi review — the colour cards",
    exactModel: "Sphero indi At-Home Learning Kit",
    type: "product_detail",
    checksum: "sha256:cbae2a87ef541a555baeebaa8064ab70d95915e496b39dd25337203383edfc35",
    width: 1536,
    height: 1024,
    src: "/media/coding/sphero-indi/figure-1.webp",
    altText:
      "A blue indi car standing on a blue card, with purple, green, red and yellow cards laid in a line beside it, each printed with an arrow.",
    altTextStatus: "approved",
    schema: DEPICTION_SCHEMA,
    depictsRealProduct: true,
  },
  {
    ...base("sphero-indi-figure-2", "depiction"),
    productId: "prod-sphero-indi",
    purpose: "Sphero indi review — a course built from books",
    exactModel: "Sphero indi At-Home Learning Kit",
    type: "product_in_use",
    checksum: "sha256:aee95af1e12caf2229595de93a04ff8fbffd8c5d76f2841796b0be0bf59df2ff",
    width: 1254,
    height: 1254,
    src: "/media/coding/sphero-indi/figure-2.webp",
    altText:
      "A child lying on a floor watching an indi car drive through a maze built from stacked books and wooden blocks.",
    altTextStatus: "approved",
    schema: DEPICTION_SCHEMA,
    depictsRealProduct: true,
  },
  {
    ...base("sphero-indi-card", "depiction"),
    productId: "prod-sphero-indi",
    purpose: "Sphero indi — listing card",
    exactModel: "Sphero indi At-Home Learning Kit",
    type: "product_hero",
    checksum: "sha256:45ed7e79cdb00d8e68e65c072f781ee674f82f0dd3024915b4f7d2184bf0f2b5",
    width: 1254,
    height: 1254,
    src: "/media/coding/sphero-indi/card.webp",
    altText:
      "A blue Sphero indi car alone on a weathered wooden table outdoors, its two round white eyes lit.",
    altTextStatus: "approved",
    schema: DEPICTION_SCHEMA,
    depictsRealProduct: true,
  },
  {
    ...base("ozobot-evo-hero", "illustration"),
    productId: "prod-ozobot-evo",
    purpose: "Ozobot Evo review — lead",
    exactModel: "Ozobot Evo Entry Kit",
    type: "included_accessories",
    checksum: "sha256:df0e47a9634bdb49e67f9d93d6d64cb1ddb6bbea0aa5f50b7fdadddbd80a4284",
    width: 1676,
    height: 1357,
    src: "/media/coding/ozobot-evo/hero.webp",
    altText:
      "The Ozobot Evo Entry Kit as it ships: the retail box, a zipped case, a pack of washable colour-code markers, a Meet Evo booklet and the small white robot itself.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("ozobot-evo-figure-1", "illustration"),
    productId: "prod-ozobot-evo",
    purpose: "Ozobot Evo review — colour codes",
    exactModel: "Ozobot Evo Entry Kit",
    type: "promotional_panel",
    checksum: "sha256:6423cdab88bb432fa427684999520208da8ce507f78892a5add8ca109d092d92",
    width: 1080,
    height: 1130,
    src: "/media/coding/ozobot-evo/figure-1.webp",
    altText:
      "An Evo crossing a hand-drawn line on paper where a band of colours has been marked, with the words screen-free coding and colour codes set into the picture. That wording is Ozobot's own.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("ozobot-evo-figure-2", "illustration"),
    productId: "prod-ozobot-evo",
    purpose: "Ozobot Evo review — block coding",
    exactModel: "Ozobot Evo Entry Kit",
    type: "app_screenshot",
    checksum: "sha256:08fe7821eb6bca06d23c05535a8cb234c69e95624a284e6e02dce6ae667d939e",
    width: 1855,
    height: 1289,
    src: "/media/coding/ozobot-evo/figure-2.webp",
    altText:
      "A laptop screen showing an OzoBlockly program of stacked colour blocks, with a hand holding an Evo against the screen to load it.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("ozobot-evo-card", "depiction"),
    productId: "prod-ozobot-evo",
    purpose: "Ozobot Evo — listing card",
    exactModel: "Ozobot Evo Entry Kit",
    type: "product_hero",
    checksum: "sha256:6e4a7cd8ae0d495df6a990b505aa14b7c60a9455c3ac3e99843915b159851cfc",
    width: 1080,
    height: 1130,
    src: "/media/coding/ozobot-evo/card.webp",
    altText:
      "A hand holding the small white Evo beside its Entry Kit box and case. The heading calling it the Evo Entry Kit for ages 4 and up is Ozobot's own wording; this review uses the 5 to 11 range Ozobot's title and age fields give.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: true,
  },
  {
    ...base("makeblock-mbot-panel-app", "illustration"),
    productId: "prod-makeblock-mbot",
    purpose: "Makeblock mBot review — the app",
    exactModel: "Makeblock mBot",
    type: "promotional_panel",
    checksum: "sha256:3e82f45a099b5ce2dbac3c1f9d5467da89fbe547298ffc686733d0c7052332e8",
    width: 500,
    height: 300,
    src: "/media/coding/makeblock-mbot/panel-app.webp",
    altText:
      "A blue mBot on a desk beside two hands holding a phone running the Makeblock app. Supplied with the maker's own press images.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("makeblock-mbot-hero", "depiction"),
    productId: "prod-makeblock-mbot",
    purpose: "Makeblock mBot review — lead",
    exactModel: "Makeblock mBot",
    type: "product_detail",
    checksum: "sha256:eab590b597ebb176c7b666bcd1eba735db85b4ebe832767e5023988fb1fe2768",
    width: 773,
    height: 400,
    src: "/media/coding/makeblock-mbot/hero.webp",
    altText:
      "A blue mBot on a plain blue background with several of its parts floating away from it: a bracket, a perforated plate, a yellow flag and a blue beam.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: true,
  },
  {
    ...base("makeblock-mbot-figure-1", "depiction"),
    productId: "prod-makeblock-mbot",
    purpose: "Makeblock mBot review — assembled",
    exactModel: "Makeblock mBot",
    type: "product_detail",
    checksum: "sha256:eb4efe53e49adbe1e9f28628fbb87d6463044e8cb96dd414ee5d8bda76863eda",
    width: 1024,
    height: 768,
    src: "/media/coding/makeblock-mbot/figure-1.webp",
    altText:
      "An assembled blue mBot standing on a green cutting mat with its instruction booklet propped behind it, ultrasonic sensor facing the camera.",
    altTextStatus: "approved",
    schema: DEPICTION_SCHEMA,
    depictsRealProduct: true,
  },
  {
    ...base("makeblock-mbot-figure-2", "illustration"),
    productId: "prod-makeblock-mbot",
    purpose: "Makeblock mBot review — the three things it teaches",
    exactModel: "Makeblock mBot",
    type: "promotional_panel",
    checksum: "sha256:62ce5ab166e6128098ff34fb81ba278caed30d60145e38f1c074af864669812a",
    width: 1500,
    height: 1500,
    src: "/media/coding/makeblock-mbot/figure-2.webp",
    altText:
      "Three panels from the maker labelled robotics, electroics and coding: the mBot pushing a cone, its board with components laid out, and a child coding it on a laptop. The middle label is misspelt in the supplied artwork.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
  },
  {
    ...base("makeblock-mbot-card", "depiction"),
    productId: "prod-makeblock-mbot",
    purpose: "Makeblock mBot — listing card",
    exactModel: "Makeblock mBot",
    type: "product_hero",
    checksum: "sha256:a6f40610fff33794189c90c5e6729eb3b65657ebda6dd3f85ddcca769eb433fe",
    width: 1000,
    height: 1000,
    src: "/media/coding/makeblock-mbot/card.webp",
    altText:
      "A blue Makeblock mBot photographed head-on against white, its two ultrasonic sensors reading as eyes above a printed smile.",
    altTextStatus: "approved",
    schema: DEPICTION_SCHEMA,
    depictsRealProduct: true,
  },
  /* Code & Go Robot Mouse, owner-supplied 26 September 2026. */
  {
    ...base("code-and-go-robot-mouse-hero", "depiction"),
    productId: "prod-code-and-go-robot-mouse",
    purpose: "Code & Go Robot Mouse review — lead",
    exactModel: "Code & Go Robot Mouse",
    type: "product_detail",
    checksum: "sha256:8856a99c7f8377c78a4b5803e78e6b4df61d317d3b20f376e9b31449d1340d24",
    width: 1254,
    height: 1254,
    src: "/media/coding/code-and-go-robot-mouse/hero.webp",
    altText:
      "A young girl pressing a button on a purple Code & Go Robot Mouse, with a stack of green directional cards laid out on the table in front of her.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: true,
  },
  {
    ...base("code-and-go-robot-mouse-figure-1", "depiction"),
    productId: "prod-code-and-go-robot-mouse",
    purpose: "Code & Go Robot Mouse review — close-up",
    exactModel: "Code & Go Robot Mouse",
    type: "product_detail",
    checksum: "sha256:072ae968f00a080289b3ba61dbb0d1940bfad879420b61ce968a9a6fcf079093",
    width: 1295,
    height: 1214,
    src: "/media/coding/code-and-go-robot-mouse/figure-1.webp",
    altText:
      "A close-up of the purple Code & Go Robot Mouse, showing its coloured directional buttons and painted-on eyes and whiskers.",
    altTextStatus: "approved",
    schema: DEPICTION_SCHEMA,
    depictsRealProduct: true,
  },
  {
    ...base("code-and-go-robot-mouse-figure-2", "depiction"),
    productId: "prod-code-and-go-robot-mouse",
    purpose: "Code & Go Robot Mouse review — box and cards",
    exactModel: "Code & Go Robot Mouse",
    type: "product_detail",
    checksum: "sha256:2df12fee5ed9ad1878369f5d535bcbf41340f1c795386d1f64254f029b3f4526",
    width: 1254,
    height: 1254,
    src: "/media/coding/code-and-go-robot-mouse/figure-2.webp",
    altText:
      "The Code & Go Robot Mouse retail box beside the purple mouse itself and a fanned-out set of its green directional cards.",
    altTextStatus: "approved",
    schema: DEPICTION_SCHEMA,
    depictsRealProduct: true,
  },
  {
    /* card.webp is a byte-identical copy of figure-1.webp, kept as its own
       file rather than the same path reused across two records: the
       derivative generator matches a manifest entry to the FIRST asset record
       found at that source path, so a second record sharing figure-1's path
       would silently never link to its own responsive derivatives. */
    ...base("code-and-go-robot-mouse-card", "depiction"),
    productId: "prod-code-and-go-robot-mouse",
    purpose: "Code & Go Robot Mouse — listing card",
    exactModel: "Code & Go Robot Mouse",
    type: "product_hero",
    checksum: "sha256:072ae968f00a080289b3ba61dbb0d1940bfad879420b61ce968a9a6fcf079093",
    width: 1295,
    height: 1214,
    src: "/media/coding/code-and-go-robot-mouse/card.webp",
    altText:
      "A close-up of the purple Code & Go Robot Mouse, showing its coloured directional buttons and painted-on eyes and whiskers.",
    altTextStatus: "approved",
    schema: DEPICTION_SCHEMA,
    depictsRealProduct: true,
  },
  /* Botley 2.0, owner-supplied 26 September 2026. All three carry marketing
     text and claims composited into the pixels — "Easy to use & packed with
     advanced features!", "Ready to go right out of the box!" — so all three
     take ORIGINAL_SCHEMA rather than DEPICTION_SCHEMA, same reasoning as the
     makeblock-mbot hero above: a claim-laden promotional composition is not
     the neutral photograph Product structured data should point at, even
     though it does show the real machine. */
  {
    ...base("botley-hero", "depiction"),
    productId: "prod-botley-2",
    purpose: "Botley 2.0 review — lead",
    exactModel: "Botley 2.0",
    type: "promotional_panel",
    checksum: "sha256:e518c5552d924fcb9ee97daf3191b840355ef15d5263501060db6755ba720e7f",
    width: 1536,
    height: 1024,
    src: "/media/coding/botley-the-coding-robot/hero.webp",
    altText:
      "The Botley 2.0 Activity Set retail box beside the robot, its detachable remote, activity cards, cones and flags laid out on a table.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: true,
  },
  {
    ...base("botley-figure-1", "depiction"),
    productId: "prod-botley-2",
    purpose: "Botley 2.0 review — the remote in use",
    exactModel: "Botley 2.0",
    type: "promotional_panel",
    checksum: "sha256:775e902bfc793fff6cea13fec78b81e1026669f0070cf65cdf7cb3141e8a6bee",
    width: 1254,
    height: 1254,
    src: "/media/coding/botley-the-coding-robot/figure-1.webp",
    altText:
      "A child pressing a button on Botley's detachable remote, with the green-and-blue robot and its directional cards on the floor in front of them.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: true,
  },
  {
    ...base("botley-figure-2", "depiction"),
    productId: "prod-botley-2",
    purpose: "Botley 2.0 review — a course laid out",
    exactModel: "Botley 2.0",
    type: "promotional_panel",
    checksum: "sha256:af63205611496b71b1089fd27af9fc3da90e0119ed486167939be0111af792d1",
    width: 1254,
    height: 1254,
    src: "/media/coding/botley-the-coding-robot/figure-2.webp",
    altText:
      "Botley the robot beside cube obstacles and two flag markers set up as a course on a patterned rug.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: true,
  },
  {
    /* card.webp is a byte-identical copy of hero.webp, kept as its own file
       for the same reason as the Code & Go Robot Mouse card above — a shared
       path silently drops one of the two records out of responsive-variant
       readiness. product_hero for the grid slot; still ORIGINAL_SCHEMA since
       the image itself is the claim-laden box shot, not Product schema
       eligible. */
    ...base("botley-card", "depiction"),
    productId: "prod-botley-2",
    purpose: "Botley 2.0 — listing card",
    exactModel: "Botley 2.0",
    type: "product_hero",
    checksum: "sha256:e518c5552d924fcb9ee97daf3191b840355ef15d5263501060db6755ba720e7f",
    width: 1536,
    height: 1024,
    src: "/media/coding/botley-the-coding-robot/card.webp",
    altText:
      "The Botley 2.0 Activity Set retail box beside the robot, its detachable remote, activity cards, cones and flags laid out on a table.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: true,
  },
];


/* ------------------------------------------------------------------ */
/* The 11 August 2026 artwork drop                                     */
/* ------------------------------------------------------------------ */

/**
 * Fifty-eight files across seventeen product reviews, supplied by the owner on
 * 11 August 2026.
 *
 * WHAT CHANGED ON THE SITE. Every one of these seventeen machines was live
 * with nothing in its picture slot — no creative, no branded card, not even a
 * vector placeholder, because none of them was in the placeholder manifest.
 * The vacuum, mower and grill categories were grids of text. This is the first
 * artwork any of them has had.
 *
 * ONE IMAGE PER PRODUCT WAS THE OLD SHAPE AND IT WAS THE WRONG ONE. A review
 * that argues about mop lift, threshold height and brush design needs a
 * picture beside each of those arguments, not a single card at the top. So the
 * first file for each product resolves the listing card AND the review lead,
 * and the rest are placed against named sections in content/reviews.ts.
 *
 * TYPING, AND WHY MOST OF THESE ARE SHUT OUT OF PRODUCT SCHEMA. Nearly every
 * file carries a headline and a claim set into the pixels — suction figures,
 * threshold heights, percentages against unnamed rivals. Those are
 * `promotional_panel` (or `branded_placeholder` where the file also fills the
 * card) on ORIGINAL_SCHEMA with depictsRealProduct: false, exactly as the 10
 * August batch above. A panel asserting "180x more suction" must not reach a
 * consumer as this machine's photograph. The handful with nothing but the
 * machine in a scene — the Grillbot, the eufy X10's underside — are
 * depictions and open everywhere.
 *
 * THE ALT TEXT NAMES THE FIGURES RATHER THAN HIDING THEM, and attributes them
 * to the maker. Where a printed figure disagrees with what the review could
 * establish, `notes` records the disagreement: the Shark PowerDetect's
 * 120-minute runtime and the Roomba Max 705's 180x suction are both marketing
 * numbers this site's tables record as not disclosed, and both are labelled
 * here rather than quietly adopted.
 *
 * TWO SUPPLIED FILES ARE NOT IN THIS ARRAY BECAUSE THEY ARE BYTE-IDENTICAL
 * DUPLICATES of files that are: the X50 Ultra's hair-brush panel arrived
 * twice, and the third file under the eufy X10 Pro Omni is the same file as
 * the Omni S1 Pro's stain panel and carries the S1 Pro's name in its pixels,
 * so it ships once, under the S1 Pro.
 *
 * THREE ARE HELD, AND THE REASON IS RECORDED IN QREVO_S5V_ARTWORK_HELD below.
 */
export const AUGUST_11_UPLOAD_ASSETS: MediaAssetRecord[] = [

  /* ---- Grillbot ---- */
  {
    ...base("aug11-grillbot-hero", "depiction"),
    productId: PRODUCT_ID["grillbot"] ?? "prod-grillbot",
    purpose: "Grillbot — review lead and listing card",
    exactModel: "Grillbot",
    type: "product_hero",
    checksum: "sha256:571da9967fddbc670fadc4cf8f92dcbde29a2ff64d6513dd06c3e6bec019b2fd",
    width: 1672,
    height: 941,
    src: "/media/reviews/grillbot/hero.webp",
    altText:
      "The Grillbot on a hot grill grate: a squat red machine with three circular " +
      "wire brushes underneath, sitting on the bars of a lit gas grill at dusk " +
      "with steam rising around it.",
    altTextStatus: "approved",
    schema: DEPICTION_SCHEMA,
    depictsRealProduct: true,
    presentation: "bleed",
  },

  /* ---- eufy X10 Pro Omni ---- */
  {
    ...base("aug11-eufy-x10-pro-omni-hero", "illustration"),
    productId: PRODUCT_ID["eufy-x10-pro-omni"] ?? "prod-eufy-x10-pro-omni",
    purpose: "eufy X10 Pro Omni — review lead and listing card",
    exactModel: "eufy X10 Pro Omni",
    type: "branded_placeholder",
    checksum: "sha256:ac06086f5b426dd1c620cb8fe45a6068bf8b1b8db19d486e4dec6fa54a69846f",
    width: 1254,
    height: 1254,
    src: "/media/reviews/eufy-x10-pro-omni/hero.webp",
    altText:
      "A BotPlanet panel for the eufy X10 Pro Omni: the flat black robot parked " +
      "under its tall auto-empty dock on dark wood flooring, a child sitting with " +
      "a small dog on a rug behind. Four labels along the bottom read 8000 Pa, " +
      "smart vacuum plus mop 2-in-1, auto-empty dock up to 60 days, and iPath " +
      "laser navigation — eufy's own marketing wording, set into the artwork.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("aug11-eufy-x10-pro-omni-underside", "depiction"),
    productId: PRODUCT_ID["eufy-x10-pro-omni"] ?? "prod-eufy-x10-pro-omni",
    purpose: "eufy X10 Pro Omni — review figure: underside",
    exactModel: "eufy X10 Pro Omni",
    type: "product_detail",
    checksum: "sha256:b74fb69982a7220d1fb7ca4b93ec17f5d8e8c489363ffa9cfd23fa7b04611bc4",
    width: 1254,
    height: 1254,
    src: "/media/reviews/eufy-x10-pro-omni/underside.webp",
    altText:
      "The underside of the eufy X10 Pro Omni: two round spinning mop pads at the " +
      "rear, a full-width roller brush across the middle and a single side brush " +
      "at the front edge.",
    altTextStatus: "approved",
    schema: DEPICTION_SCHEMA,
    depictsRealProduct: true,
    presentation: "bleed",
  },

  /* ---- eufy Omni S1 Pro ---- */
  {
    ...base("aug11-eufy-omni-s1-pro-hero", "illustration"),
    productId: PRODUCT_ID["eufy-omni-s1-pro"] ?? "prod-eufy-omni-s1-pro",
    purpose: "eufy Omni S1 Pro — review lead and listing card",
    exactModel: "eufy Omni S1 Pro",
    type: "branded_placeholder",
    checksum: "sha256:087218b3c578cd31486613ed76ace88755d5d1df01a60056830196b7ac514ed7",
    width: 1254,
    height: 1254,
    src: "/media/reviews/eufy-omni-s1-pro/hero.webp",
    altText:
      "A BotPlanet panel for the eufy Omni S1 Pro: the tall cylindrical UniClean " +
      "station standing on a wooden floor with the slim black robot in front of " +
      "it crossing a spilled-coffee stain. A feature list beside it reads " +
      "UniClean station, vacuum and mop, tackles tough stains and premium smart " +
      "cleaning — eufy's own marketing wording, set into the artwork.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("aug11-eufy-omni-s1-pro-stain-lift", "illustration"),
    productId: PRODUCT_ID["eufy-omni-s1-pro"] ?? "prod-eufy-omni-s1-pro",
    purpose: "eufy Omni S1 Pro — review figure: stain-lift",
    exactModel: "eufy Omni S1 Pro",
    type: "promotional_panel",
    checksum: "sha256:1b89c270ef286f55a550038ebc5907ca121e81ab9bf5880d27349c4ca74514f9",
    width: 1122,
    height: 1402,
    src: "/media/reviews/eufy-omni-s1-pro/stain-lift.webp",
    altText:
      "A BotPlanet panel headed “Erase stains, leave no trace” for the eufy Omni " +
      "S1 Pro, showing the robot crossing a wide spilled-coffee stain on a wooden " +
      "floor. Labels read unclean roller mop, 48-hour deep clean, constant mop " +
      "pressure, edge-to-edge coverage and AI-powered stain detection, above a " +
      "two-way comparison marking the Omni S1 Pro clean and other robots " +
      "streaked.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("aug11-eufy-omni-s1-pro-slim-profile", "illustration"),
    productId: PRODUCT_ID["eufy-omni-s1-pro"] ?? "prod-eufy-omni-s1-pro",
    purpose: "eufy Omni S1 Pro — review figure: slim-profile",
    exactModel: "eufy Omni S1 Pro",
    type: "promotional_panel",
    checksum: "sha256:271f12599a787d97610798511f00b8e290313ca966f8bd45dcdfe9b7ba9ba686",
    width: 1122,
    height: 1402,
    src: "/media/reviews/eufy-omni-s1-pro/slim-profile.webp",
    altText:
      "A BotPlanet panel for the eufy Omni S1 Pro headed “Hands-free clean”, " +
      "showing a hand pressing the top of the tall cylindrical station above four " +
      "icons reading auto emptying, auto washing, auto drying and auto refilling. " +
      "Below, the slim robot slides under low furniture beside the figure 3.78 " +
      "inches, described as an ultra-slim profile.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },

  /* ---- roborock S8 Max Ultra ---- */
  {
    ...base("aug11-roborock-s8-max-ultra-hero", "illustration"),
    productId: PRODUCT_ID["roborock-s8-max-ultra"] ?? "prod-roborock-s8-max-ultra",
    purpose: "roborock S8 Max Ultra — review lead and listing card",
    exactModel: "roborock S8 Max Ultra",
    type: "branded_placeholder",
    checksum: "sha256:0f05926089e20527f077548c191a349dd0c8c5e81be4e8a28c5d7bedfc9a922b",
    width: 1122,
    height: 1402,
    src: "/media/reviews/roborock-s8-max-ultra/hero.webp",
    altText:
      "A BotPlanet panel for the roborock S8 Max Ultra: the white robot on a lit " +
      "plinth in front of its tall white dock, a phone showing a floor map beside " +
      "them. Labels read smart docking, app control, auto washing and drying, and " +
      "edge-to-edge cleaning.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("aug11-roborock-s8-max-ultra-underside", "illustration"),
    productId: PRODUCT_ID["roborock-s8-max-ultra"] ?? "prod-roborock-s8-max-ultra",
    purpose: "roborock S8 Max Ultra — review figure: underside",
    exactModel: "roborock S8 Max Ultra",
    type: "promotional_panel",
    checksum: "sha256:ee2a2603ad4a2a3f8fc584d692cae1424861127752907168401ccbaaef799e43",
    width: 1122,
    height: 1402,
    src: "/media/reviews/roborock-s8-max-ultra/underside.webp",
    altText:
      "A BotPlanet panel for the roborock S8 Max Ultra showing the machine tipped " +
      "up: a wide mop pad, a small round side mop and twin rubber rollers " +
      "underneath, labelled DuoRoller Riser for carpet protection, twin vibration " +
      "modules and DuoRoller brush. The figure 8,000 Pa is drawn in light beneath " +
      "it.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("aug11-roborock-s8-max-ultra-dock", "illustration"),
    productId: PRODUCT_ID["roborock-s8-max-ultra"] ?? "prod-roborock-s8-max-ultra",
    purpose: "roborock S8 Max Ultra — review figure: dock",
    exactModel: "roborock S8 Max Ultra",
    type: "promotional_panel",
    checksum: "sha256:49f448b9c7a47e8ff31ef5794b32cc23fd43346f6c1d6da5a6c053a8578b986e",
    width: 1254,
    height: 1254,
    src: "/media/reviews/roborock-s8-max-ultra/dock.webp",
    altText:
      "A BotPlanet panel headed “all-in-one dock” for the roborock S8 Max Ultra, " +
      "showing the white dock with the robot beneath it and eight labelled panels " +
      "around the edges reading auto tank refilling, hot water mop wash, hot air " +
      "drying, auto dust emptying, auto detergent dispenser, intelligent dirt " +
      "detection and dock self-cleaning.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },

  /* ---- roborock Saros 10 ---- */
  {
    ...base("aug11-roborock-saros-10-hero", "illustration"),
    productId: PRODUCT_ID["roborock-saros-10"] ?? "prod-roborock-saros-10",
    purpose: "roborock Saros 10 — review lead and listing card",
    exactModel: "roborock Saros 10",
    type: "branded_placeholder",
    checksum: "sha256:15c704c7abdd17cdeb2a7951e818af1d3b6ad2ab686cb4c39fa8b78e71e61c62",
    width: 1254,
    height: 1254,
    src: "/media/reviews/roborock-saros-10/hero.webp",
    altText:
      "A BotPlanet panel for the roborock Saros 10: the black robot on a lit " +
      "plinth in front of its tall dark dock, ringed by six labelled thumbnails " +
      "reading app control, low-profile cleaning, smart navigation, edge " +
      "cleaning, auto-dock support and powerful cleaning.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("aug11-roborock-saros-10-suction", "illustration"),
    productId: PRODUCT_ID["roborock-saros-10"] ?? "prod-roborock-saros-10",
    purpose: "roborock Saros 10 — review figure: suction",
    exactModel: "roborock Saros 10",
    type: "promotional_panel",
    checksum: "sha256:6546cc07619c133ab9afb88948a3418de71c322e6a6b79393cc1125c8e0164de",
    width: 1254,
    height: 1254,
    src: "/media/reviews/roborock-saros-10/suction.webp",
    altText:
      "A BotPlanet panel for the roborock Saros 10 showing a close view of the " +
      "machine's underside with the figure 22,000 Pa drawn in light across it, " +
      "and labels reading zero per cent hair tangling, 100 per cent hair removal " +
      "on carpet and zero-tangle brushes.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("aug11-roborock-saros-10-brushes", "illustration"),
    productId: PRODUCT_ID["roborock-saros-10"] ?? "prod-roborock-saros-10",
    purpose: "roborock Saros 10 — review figure: brushes",
    exactModel: "roborock Saros 10",
    type: "promotional_panel",
    checksum: "sha256:b16ad289c5631d7b84ce09554c7db415a4c47e94a5db50afec70caad278264cd",
    width: 1254,
    height: 1254,
    src: "/media/reviews/roborock-saros-10/brushes.webp",
    altText:
      "A BotPlanet panel headed “zero-tangle brushes” for the roborock Saros 10, " +
      "showing the underside brush assembly lit from below with labels reading " +
      "hair-free roller design, smooth debris pickup and engineered for carpet " +
      "and hard floors.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },

  /* ---- Dreame X40 Ultra ---- */
  {
    ...base("aug11-dreame-x40-ultra-hero", "illustration"),
    productId: PRODUCT_ID["dreame-x40-ultra"] ?? "prod-dreame-x40-ultra",
    purpose: "Dreame X40 Ultra — review lead and listing card",
    exactModel: "Dreame X40 Ultra",
    type: "branded_placeholder",
    checksum: "sha256:c3b0edb669f5192957440f98efaf36fa2e816181391539cfc7e4529877eb14d0",
    width: 1254,
    height: 1254,
    src: "/media/reviews/dreame-x40-ultra/hero.webp",
    altText:
      "A BotPlanet panel for the Dreame X40 Ultra: the black robot beside its " +
      "tall dock on a dark floor with a phone showing the Dreame app. The " +
      "headline reads 12,000 Pa cleaning power, with labels for dual spinning " +
      "mops, a smart dock system and app control.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("aug11-dreame-x40-ultra-washboard", "illustration"),
    productId: PRODUCT_ID["dreame-x40-ultra"] ?? "prod-dreame-x40-ultra",
    purpose: "Dreame X40 Ultra — review figure: washboard",
    exactModel: "Dreame X40 Ultra",
    type: "promotional_panel",
    checksum: "sha256:154a75e70771121ccc0332a856b82d1a54422e32840d78e8b866865499da980a",
    width: 1122,
    height: 1402,
    src: "/media/reviews/dreame-x40-ultra/washboard.webp",
    altText:
      "A BotPlanet panel headed “self-cleaning washboard” for the Dreame X40 " +
      "Ultra, showing the inside of the dock's washing tray with the two mop pads " +
      "spinning over ridged plates in a burst of water. Labels read automatic " +
      "self-wash, dual mop cleaning, fresh water rinse and low-maintenance dock.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("aug11-dreame-x40-ultra-avoidance", "illustration"),
    productId: PRODUCT_ID["dreame-x40-ultra"] ?? "prod-dreame-x40-ultra",
    purpose: "Dreame X40 Ultra — review figure: avoidance",
    exactModel: "Dreame X40 Ultra",
    type: "promotional_panel",
    checksum: "sha256:0fc1b9b546f52f78c1a74d4c078a5c00ccedeb17904b16ff34d22016c5e38a6e",
    width: 1122,
    height: 1402,
    src: "/media/reviews/dreame-x40-ultra/avoidance.webp",
    altText:
      "A BotPlanet panel headed “smart avoidance, clean floors” for the Dreame " +
      "X40 Ultra, showing the robot on a dark floor picking its way between a " +
      "shoe, a cable, a bowl and a soft toy, with labels reading obstacle " +
      "recognition, home-aware navigation, wet and dry separation and carpet-safe " +
      "mopping.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },

  /* ---- Dreame X50 Ultra ---- */
  {
    ...base("aug11-dreame-x50-ultra-hero", "illustration"),
    productId: PRODUCT_ID["dreame-x50-ultra"] ?? "prod-dreame-x50-ultra",
    purpose: "Dreame X50 Ultra — review lead and listing card",
    exactModel: "Dreame X50 Ultra",
    type: "branded_placeholder",
    checksum: "sha256:27931b299696780169188316728d4e416ca6036e17ee51dabf207785bae999c0",
    width: 1254,
    height: 1254,
    src: "/media/reviews/dreame-x50-ultra/hero.webp",
    altText:
      "A BotPlanet panel headed “reach into tight corners” for the Dreame X50 " +
      "Ultra, showing the machine from a low angle with its roller brush and two " +
      "round mop pads visible as it works into a corner. Labels read edge " +
      "cleaning, under-furniture reach and corner precision.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("aug11-dreame-x50-ultra-mop-washing", "illustration"),
    productId: PRODUCT_ID["dreame-x50-ultra"] ?? "prod-dreame-x50-ultra",
    purpose: "Dreame X50 Ultra — review figure: mop-washing",
    exactModel: "Dreame X50 Ultra",
    type: "promotional_panel",
    checksum: "sha256:2eea201cadc2721d7214685f867b7d8c4f0ace41561b67bbbd63bc87d8bab475",
    width: 1254,
    height: 1254,
    src: "/media/reviews/dreame-x50-ultra/mop-washing.webp",
    altText:
      "A BotPlanet panel headed “automatic mop washing” for the Dreame X50 Ultra, " +
      "showing the open dock tray with the two round mop pads being washed under " +
      "jets of water. Labels read deep cleans mop pads, helps reduce odours and " +
      "residue, and always ready for the next clean.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("aug11-dreame-x50-ultra-brushes", "illustration"),
    productId: PRODUCT_ID["dreame-x50-ultra"] ?? "prod-dreame-x50-ultra",
    purpose: "Dreame X50 Ultra — review figure: brushes",
    exactModel: "Dreame X50 Ultra",
    type: "promotional_panel",
    checksum: "sha256:89143fb39239c1ea59226c911177f1c0903d4ff2535d67a3888c5693df6fd740",
    width: 1254,
    height: 1254,
    src: "/media/reviews/dreame-x50-ultra/brushes.webp",
    altText:
      "A BotPlanet panel headed “no more tangled hair” for the Dreame X50 Ultra, " +
      "showing a close view of the machine's tan-coloured anti-tangle roller " +
      "brush, with two inset panels beneath showing it cleaning a floor crevice " +
      "and crossing a carpet.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },

  /* ---- ECOVACS DEEBOT T90 PRO Omni ---- */
  {
    ...base("aug11-ecovacs-deebot-t90-pro-omni-hero", "illustration"),
    productId: PRODUCT_ID["ecovacs-deebot-t90-pro-omni"] ?? "prod-ecovacs-deebot-t90-pro-omni",
    purpose: "ECOVACS DEEBOT T90 PRO Omni — review lead and listing card",
    exactModel: "ECOVACS DEEBOT T90 PRO Omni",
    type: "branded_placeholder",
    checksum: "sha256:ee94fc5f11d6925866b8c0c5bfde78406548b45d6c2db9ad488253f92966db39",
    width: 1254,
    height: 1254,
    src: "/media/reviews/ecovacs-deebot-t90-pro-omni/hero.webp",
    altText:
      "A BotPlanet panel for the ECOVACS DEEBOT T90 PRO Omni: the black robot in " +
      "front of its dock on a dark floor beside a phone and two bottles of " +
      "cleaning solution. The headline reads nonstop power, with labels for quick " +
      "top-up charging, built for big homes and app-ready control.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("aug11-ecovacs-deebot-t90-pro-omni-thresholds", "illustration"),
    productId: PRODUCT_ID["ecovacs-deebot-t90-pro-omni"] ?? "prod-ecovacs-deebot-t90-pro-omni",
    purpose: "ECOVACS DEEBOT T90 PRO Omni — review figure: thresholds",
    exactModel: "ECOVACS DEEBOT T90 PRO Omni",
    type: "promotional_panel",
    checksum: "sha256:3f5b211482a48294c76a484ca66ad325eaacb84722a9562e7447144e68106de4",
    width: 1254,
    height: 1254,
    src: "/media/reviews/ecovacs-deebot-t90-pro-omni/thresholds.webp",
    altText:
      "A BotPlanet panel headed “reliable and fast, every climb” for the ECOVACS " +
      "DEEBOT T90 PRO Omni, showing the robot climbing a raised threshold strip. " +
      "Labels read climbs higher, effortlessly clears thresholds up to 0.59 " +
      "inches, smooth transition and all-surface confidence, with a comparison " +
      "strip beneath marking other machines as getting stuck.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("aug11-ecovacs-deebot-t90-pro-omni-suction-noise", "illustration"),
    productId: PRODUCT_ID["ecovacs-deebot-t90-pro-omni"] ?? "prod-ecovacs-deebot-t90-pro-omni",
    purpose: "ECOVACS DEEBOT T90 PRO Omni — review figure: suction-noise",
    exactModel: "ECOVACS DEEBOT T90 PRO Omni",
    type: "promotional_panel",
    checksum: "sha256:db61ad90c0074d706bb760ea010e74431df0647addb290efbc63f7f0eec5f377",
    width: 1254,
    height: 1254,
    src: "/media/reviews/ecovacs-deebot-t90-pro-omni/suction-noise.webp",
    altText:
      "A BotPlanet panel headed “powerful yet quiet” for the ECOVACS DEEBOT T90 " +
      "PRO Omni, showing the robot on a ribbed rug with a golden retriever asleep " +
      "behind it. The figures 33.9 CFM airflow and 30,000 Pa suction sit above " +
      "three comparison figures reading 67 per cent stronger suction, 68 per cent " +
      "less vacuuming noise and 50 per cent less emptying noise, footnoted as " +
      "compared to the DEEBOT T90.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("aug11-ecovacs-deebot-t90-pro-omni-lift", "illustration"),
    productId: PRODUCT_ID["ecovacs-deebot-t90-pro-omni"] ?? "prod-ecovacs-deebot-t90-pro-omni",
    purpose: "ECOVACS DEEBOT T90 PRO Omni — review figure: lift",
    exactModel: "ECOVACS DEEBOT T90 PRO Omni",
    type: "promotional_panel",
    checksum: "sha256:a4ea4f5e262e2fc76b89e9953f0a28cd57986a1d33fe1be5e19e926470eac3e6",
    width: 1254,
    height: 1254,
    src: "/media/reviews/ecovacs-deebot-t90-pro-omni/lift.webp",
    altText:
      "A BotPlanet panel headed “wet and dry, done right” for the ECOVACS DEEBOT " +
      "T90 PRO Omni, showing three stacked detail panels numbered one to three: " +
      "side and main brush lift to stop wet mess spreading, roller mop lift of " +
      "0.59 inches to keep carpets dry, and side brush lift on hard floors to " +
      "prevent debris scatter.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },

  /* ---- Shark PowerDetect AV2820S ---- */
  {
    ...base("aug11-shark-powerdetect-av2820s-hero", "illustration"),
    productId: PRODUCT_ID["shark-powerdetect-av2820s"] ?? "prod-shark-powerdetect-av2820s",
    purpose: "Shark PowerDetect AV2820S — review lead and listing card",
    exactModel: "Shark PowerDetect AV2820S",
    type: "branded_placeholder",
    checksum: "sha256:16e6d22b97b2c906d819075d0049b90ffc06574454a67d57f73a4bcf5f44900c",
    width: 1254,
    height: 1254,
    src: "/media/reviews/shark-powerdetect-av2820s/hero.webp",
    altText:
      "A BotPlanet panel for the Shark PowerDetect AV2820S: the black robot in " +
      "front of its bagless tower on a dark floor with scattered debris around it " +
      "and a phone showing the DirtDetect screen. Three panels beneath read Dirt " +
      "Detect, Edge Detect and Floor Detect, each quoting Shark's own " +
      "up-to-50-per-cent improvement footnoted against the Shark RV900S and " +
      "RV2600. A strip along the bottom adds up to 120 minutes of runtime.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
    notes:
      "The 120-minute runtime printed on this artwork is Shark's marketing " +
      "figure. The Amazon listing this review was built from publishes no " +
      "runtime, and our table records it as not disclosed.",
  },
  {
    ...base("aug11-shark-powerdetect-av2820s-pet-hair", "illustration"),
    productId: PRODUCT_ID["shark-powerdetect-av2820s"] ?? "prod-shark-powerdetect-av2820s",
    purpose: "Shark PowerDetect AV2820S — review figure: pet-hair",
    exactModel: "Shark PowerDetect AV2820S",
    type: "promotional_panel",
    checksum: "sha256:795046bd32160c0b25f16c4d9ddd38b11ed8ae1c041eb5dde1a4afc295e0a5d5",
    width: 1254,
    height: 1254,
    src: "/media/reviews/shark-powerdetect-av2820s/pet-hair.webp",
    altText:
      "A BotPlanet panel headed “exceptional pet hair performance” for the Shark " +
      "PowerDetect AV2820S, showing a corgi lying on a rug with the robot working " +
      "beside it. Labels read HEPA filtration, Dirt Detect technology, " +
      "self-cleaning brushroll and anti-hair wrap.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("aug11-shark-powerdetect-av2820s-self-empty", "illustration"),
    productId: PRODUCT_ID["shark-powerdetect-av2820s"] ?? "prod-shark-powerdetect-av2820s",
    purpose: "Shark PowerDetect AV2820S — review figure: self-empty",
    exactModel: "Shark PowerDetect AV2820S",
    type: "promotional_panel",
    checksum: "sha256:c0ec878539e77eb180735e6af4273b5e38bbe34b51691b705980cfbf3b9772f3",
    width: 1254,
    height: 1254,
    src: "/media/reviews/shark-powerdetect-av2820s/self-empty.webp",
    altText:
      "A BotPlanet panel headed “self-empty system” for the Shark PowerDetect " +
      "AV2820S, showing the tall bagless base cut open to show the dust chamber. " +
      "Labels read HEPA filtration with an anti-allergen complete seal, 30-day " +
      "capacity, powerful suction, dust-free disposal and sealed system.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("aug11-shark-powerdetect-av2820s-neverstuck", "illustration"),
    productId: PRODUCT_ID["shark-powerdetect-av2820s"] ?? "prod-shark-powerdetect-av2820s",
    purpose: "Shark PowerDetect AV2820S — review figure: neverstuck",
    exactModel: "Shark PowerDetect AV2820S",
    type: "promotional_panel",
    checksum: "sha256:00c5393ac1d32611b68ca92519957424ad6c64904ab0cb81c018600587cfa25a",
    width: 1254,
    height: 1254,
    src: "/media/reviews/shark-powerdetect-av2820s/neverstuck.webp",
    altText:
      "A BotPlanet panel for the Shark PowerDetect AV2820S headed with the " +
      "NeverStuck name, showing the robot beside three labelled detail panels " +
      "reading active lift and lower, detects and avoids objects, and goes over " +
      "thresholds and uneven surfaces with ease.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },

  /* ---- Shark Matrix Plus UR2650WS ---- */
  {
    ...base("aug11-shark-matrix-plus-ur2650ws-hero", "illustration"),
    productId: PRODUCT_ID["shark-matrix-plus-ur2650ws"] ?? "prod-shark-matrix-plus-ur2650ws",
    purpose: "Shark Matrix Plus UR2650WS — review lead and listing card",
    exactModel: "Shark Matrix Plus UR2650WS",
    type: "branded_placeholder",
    checksum: "sha256:ab54375a473328fbfaac22531167ac276d36be1405fa699971f7bafae2a3845a",
    width: 1254,
    height: 1254,
    src: "/media/reviews/shark-matrix-plus-ur2650ws/hero.webp",
    altText:
      "A BotPlanet panel for the Shark Matrix Plus UR2650WS: the black robot in " +
      "front of its dock with a green tile above reading vac plus mop, described " +
      "as a 2-in-1 robot vacuum and sonic mopping system. Two panels beneath read " +
      "sonic mopping, scrubs hard floors up to 100 times per minute, and better " +
      "edge cleaning using blasts of air.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("aug11-shark-matrix-plus-ur2650ws-mapping", "illustration"),
    productId: PRODUCT_ID["shark-matrix-plus-ur2650ws"] ?? "prod-shark-matrix-plus-ur2650ws",
    purpose: "Shark Matrix Plus UR2650WS — review figure: mapping",
    exactModel: "Shark Matrix Plus UR2650WS",
    type: "promotional_panel",
    checksum: "sha256:b3c71de0f22864bfdc2101ddc5d56e54fe3e0cf65a843d9d5c25ba755e962981",
    width: 1254,
    height: 1254,
    src: "/media/reviews/shark-matrix-plus-ur2650ws/mapping.webp",
    altText:
      "A BotPlanet panel headed “precision home mapping” for the Shark Matrix " +
      "Plus UR2650WS, showing the robot on a floor drawn as a blue wireframe room " +
      "plan. Labels read 360-degree LiDAR for complete accurate home mapping, " +
      "smart detection of rooms and obstacles, and optimised cleaning routes.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("aug11-shark-matrix-plus-ur2650ws-filtration", "illustration"),
    productId: PRODUCT_ID["shark-matrix-plus-ur2650ws"] ?? "prod-shark-matrix-plus-ur2650ws",
    purpose: "Shark Matrix Plus UR2650WS — review figure: filtration",
    exactModel: "Shark Matrix Plus UR2650WS",
    type: "promotional_panel",
    checksum: "sha256:25e4507bfc00cc36bdfde7cb0c15f76389091b452ff1a686eb9f146d7e1f1091",
    width: 1254,
    height: 1254,
    src: "/media/reviews/shark-matrix-plus-ur2650ws/filtration.webp",
    altText:
      "A BotPlanet panel for the Shark Matrix Plus UR2650WS headed “traps 99.97 " +
      "per cent of dust and allergens”, showing the robot docked with an arc of " +
      "light rising from it beside a panel headed anti-allergen complete seal. " +
      "The claim is footnoted to the ASTM F1977 test standard.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("aug11-shark-matrix-plus-ur2650ws-pets", "illustration"),
    productId: PRODUCT_ID["shark-matrix-plus-ur2650ws"] ?? "prod-shark-matrix-plus-ur2650ws",
    purpose: "Shark Matrix Plus UR2650WS — review figure: pets",
    exactModel: "Shark Matrix Plus UR2650WS",
    type: "promotional_panel",
    checksum: "sha256:ea8c994035e68f76fde113cde15d352b1b37e368f7d26db91b7ccb5255559bd0",
    width: 1254,
    height: 1254,
    src: "/media/reviews/shark-matrix-plus-ur2650ws/pets.webp",
    altText:
      "A BotPlanet panel headed “perfect for homes with pets” for the Shark " +
      "Matrix Plus UR2650WS, showing a golden retriever lying on a grey rug with " +
      "the robot working beside it. Labels read powerful suction and " +
      "self-cleaning brushroll.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },

  /* ---- iRobot Roomba Max 705 ---- */
  {
    ...base("aug11-roomba-max-705-hero", "illustration"),
    productId: PRODUCT_ID["roomba-max-705"] ?? "prod-roomba-max-705",
    purpose: "iRobot Roomba Max 705 — review lead and listing card",
    exactModel: "iRobot Roomba Max 705",
    type: "branded_placeholder",
    checksum: "sha256:c048455ff657c02a1dfc17676f872c32fc12021ab3b0a24d74eb248282470132",
    width: 1254,
    height: 1254,
    src: "/media/reviews/roomba-max-705/hero.webp",
    altText:
      "A BotPlanet panel for the iRobot Roomba Max 705: the black robot on dark " +
      "wood in front of its AutoEmpty dock, a phone showing the Roomba app beside " +
      "it and scattered popcorn on the floor in front. Six labelled panels down " +
      "the side read 75 days auto-emptying, extreme power with 180 times more " +
      "suction, anti-tangle dual rubber brushes, four suction levels plus carpet " +
      "boost, PrecisionVision AI with ClearView Pro LiDAR, and targeted cleaning.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
    notes:
      "The 180x suction figure is iRobot's marketing wording, footnoted on the " +
      "artwork as a comparison against the AeroVac system in the Roomba 600 " +
      "series. The Amazon listing this review was built from publishes no suction " +
      "figure at all, and our table records it as not disclosed.",
  },
  {
    ...base("aug11-roomba-max-705-precisionvision", "illustration"),
    productId: PRODUCT_ID["roomba-max-705"] ?? "prod-roomba-max-705",
    purpose: "iRobot Roomba Max 705 — review figure: precisionvision",
    exactModel: "iRobot Roomba Max 705",
    type: "promotional_panel",
    checksum: "sha256:e0ee7af5423ca0e23e8a8cb078b68298b4448d32649e458b2eb4e32c49d17392",
    width: 1254,
    height: 1254,
    src: "/media/reviews/roomba-max-705/precisionvision.webp",
    altText:
      "A BotPlanet panel headed “PrecisionVision AI technology” for the iRobot " +
      "Roomba Max 705, showing the robot approaching a bag, a pair of glasses and " +
      "a cable on a wooden floor, each ringed by a green outline, described as " +
      "smart object awareness.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("aug11-roomba-max-705-lidar", "illustration"),
    productId: PRODUCT_ID["roomba-max-705"] ?? "prod-roomba-max-705",
    purpose: "iRobot Roomba Max 705 — review figure: lidar",
    exactModel: "iRobot Roomba Max 705",
    type: "promotional_panel",
    checksum: "sha256:029039d560127e9a4096bd7904e210b03d02a352a03924c6d36a9b70c12d9bd9",
    width: 1254,
    height: 1254,
    src: "/media/reviews/roomba-max-705/lidar.webp",
    altText:
      "A BotPlanet panel headed “ClearView Pro LiDAR” for the iRobot Roomba Max " +
      "705, showing the robot on a floor drawn as a green wireframe room plan, " +
      "described as expert home mapping.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("aug11-roomba-max-705-edge", "illustration"),
    productId: PRODUCT_ID["roomba-max-705"] ?? "prod-roomba-max-705",
    purpose: "iRobot Roomba Max 705 — review figure: edge",
    exactModel: "iRobot Roomba Max 705",
    type: "promotional_panel",
    checksum: "sha256:6d3e87552b1063d821605bedf505d7e54f442eba5b6f94bd560a5a682b705853",
    width: 1254,
    height: 1254,
    src: "/media/reviews/roomba-max-705/edge.webp",
    altText:
      "A BotPlanet panel headed “edge cleaning” for the iRobot Roomba Max 705, " +
      "showing the round black robot working into a corner with green light " +
      "fanning out ahead of it, described as reaching tight corners.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },

  /* ---- Husqvarna Automower 410iQ ---- */
  {
    ...base("aug11-husqvarna-automower-410iq-hero", "illustration"),
    productId: PRODUCT_ID["husqvarna-automower-410iq"] ?? "prod-husqvarna-automower-410iq",
    purpose: "Husqvarna Automower 410iQ — review lead and listing card",
    exactModel: "Husqvarna Automower 410iQ",
    type: "branded_placeholder",
    checksum: "sha256:c33115937479e8853d5169f37029ed5daa1b561e5282c449cf75681b4e971b31",
    width: 1672,
    height: 941,
    src: "/media/reviews/husqvarna-automower-410iq/hero.webp",
    altText:
      "A BotPlanet panel naming the Husqvarna Automower 410iQ, showing the low " +
      "dark grey mower on a lawn at night with lit borders behind it.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("aug11-husqvarna-automower-410iq-wire-free", "illustration"),
    productId: PRODUCT_ID["husqvarna-automower-410iq"] ?? "prod-husqvarna-automower-410iq",
    purpose: "Husqvarna Automower 410iQ — review figure: wire-free",
    exactModel: "Husqvarna Automower 410iQ",
    type: "promotional_panel",
    checksum: "sha256:ebb33bae368fe226962ea11d56629fb6bb7c3de6e147ffcf8f9c89c338354f5e",
    width: 1254,
    height: 1254,
    src: "/media/reviews/husqvarna-automower-410iq/wire-free.webp",
    altText:
      "A BotPlanet panel headed “wire-free setup” for the Husqvarna Automower " +
      "410iQ, showing the mower on a lawn at night with a dotted line running " +
      "down to it from a satellite and a cloud icon overhead, and a lit house " +
      "behind.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("aug11-husqvarna-automower-410iq-durability", "illustration"),
    productId: PRODUCT_ID["husqvarna-automower-410iq"] ?? "prod-husqvarna-automower-410iq",
    purpose: "Husqvarna Automower 410iQ — review figure: durability",
    exactModel: "Husqvarna Automower 410iQ",
    type: "promotional_panel",
    checksum: "sha256:c262b07be9334c9ed246b6dacbf63edf83a709e5cfabfe0858b803795282d352",
    width: 1254,
    height: 1254,
    src: "/media/reviews/husqvarna-automower-410iq/durability.webp",
    altText:
      "A BotPlanet panel headed “ultra-durable design” for the Husqvarna " +
      "Automower 410iQ, showing the mower on wet grass in heavy rain with water " +
      "beading across its dark shell and its lights on.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("aug11-husqvarna-automower-410iq-cut-quality", "illustration"),
    productId: PRODUCT_ID["husqvarna-automower-410iq"] ?? "prod-husqvarna-automower-410iq",
    purpose: "Husqvarna Automower 410iQ — review figure: cut-quality",
    exactModel: "Husqvarna Automower 410iQ",
    type: "promotional_panel",
    checksum: "sha256:0c436871cf18bf8d98f130a97acced7f7bc75af893add72416f8965f01dc9800",
    width: 1254,
    height: 1254,
    src: "/media/reviews/husqvarna-automower-410iq/cut-quality.webp",
    altText:
      "A BotPlanet panel headed “professional-quality cut” for the Husqvarna " +
      "Automower 410iQ, showing the mower crossing a striped lawn in front of a " +
      "lit modern house at dusk.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },

  /* ---- Dreame A3 AWD 1000 ---- */
  {
    ...base("aug11-dreame-a3-awd-1000-hero", "illustration"),
    productId: PRODUCT_ID["dreame-a3-awd-1000"] ?? "prod-dreame-a3-awd-1000",
    purpose: "Dreame A3 AWD 1000 — review lead and listing card",
    exactModel: "Dreame A3 AWD 1000",
    type: "branded_placeholder",
    checksum: "sha256:7f521aeb522a6f474f3a452ee730476f8099638c481ce5e3769eaba5413b05f8",
    width: 1672,
    height: 941,
    src: "/media/reviews/dreame-a3-awd-1000/hero.webp",
    altText:
      "A BotPlanet panel naming the Dreame A3 AWD 1000, showing the black, white " +
      "and red four-wheel-drive mower on a lawn at night with lit planting behind " +
      "it.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("aug11-dreame-a3-awd-1000-slope", "illustration"),
    productId: PRODUCT_ID["dreame-a3-awd-1000"] ?? "prod-dreame-a3-awd-1000",
    purpose: "Dreame A3 AWD 1000 — review figure: slope",
    exactModel: "Dreame A3 AWD 1000",
    type: "promotional_panel",
    checksum: "sha256:07f86d7da8df44400a1304790b262dbc3e0893f667d9646aa613d9d3d4e7109e",
    width: 1254,
    height: 1254,
    src: "/media/reviews/dreame-a3-awd-1000/slope.webp",
    altText:
      "The Dreame A3 AWD 1000 climbing a grass bank in daylight in front of a " +
      "Mediterranean villa, its four chunky wheels angled to the slope and its " +
      "cutting deck following the ground.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("aug11-dreame-a3-awd-1000-obstacle-vision", "illustration"),
    productId: PRODUCT_ID["dreame-a3-awd-1000"] ?? "prod-dreame-a3-awd-1000",
    purpose: "Dreame A3 AWD 1000 — review figure: obstacle-vision",
    exactModel: "Dreame A3 AWD 1000",
    type: "promotional_panel",
    checksum: "sha256:75f683421610bfca8765986c461f8f63fe070a86d595545562d6efc26bcd39d5",
    width: 1254,
    height: 1254,
    src: "/media/reviews/dreame-a3-awd-1000/obstacle-vision.webp",
    altText:
      "The Dreame A3 AWD 1000 on a lawn at night projecting a fan of blue light " +
      "ahead of it, with a dog and a shrub drawn as blue wireframe shapes in the " +
      "beam.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("aug11-dreame-a3-awd-1000-coverage", "illustration"),
    productId: PRODUCT_ID["dreame-a3-awd-1000"] ?? "prod-dreame-a3-awd-1000",
    purpose: "Dreame A3 AWD 1000 — review figure: coverage",
    exactModel: "Dreame A3 AWD 1000",
    type: "promotional_panel",
    checksum: "sha256:406c32b5f4b77db44bfdc76be1571cbde0f9492c52f1ef6f090b085fd7a38d88",
    width: 1254,
    height: 1254,
    src: "/media/reviews/dreame-a3-awd-1000/coverage.webp",
    altText:
      "The Dreame A3 AWD 1000 seen head-on at night on a lawn, with arcs of light " +
      "sweeping out around it and a lit house in the distance.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },

  /* ---- WORX Landroid Vision WR320 ---- */
  {
    ...base("aug11-worx-landroid-vision-wr320-hero", "illustration"),
    productId: PRODUCT_ID["worx-landroid-vision-wr320"] ?? "prod-worx-landroid-vision-wr320",
    purpose: "WORX Landroid Vision WR320 — review lead and listing card",
    exactModel: "WORX Landroid Vision WR320",
    type: "branded_placeholder",
    checksum: "sha256:2e0b249d7c71e6d17977bed41d8a2d6df979201a4c8e80157d684ce721738ecc",
    width: 1254,
    height: 1254,
    src: "/media/reviews/worx-landroid-vision-wr320/hero.webp",
    altText:
      "A BotPlanet panel headed “smart height control” for the WORX Landroid " +
      "Vision WR320, showing a hand holding a phone with the Landroid app's " +
      "cutting-height slider set to medium, and the orange and black mower on the " +
      "lawn behind.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("aug11-worx-landroid-vision-wr320-obstacles", "illustration"),
    productId: PRODUCT_ID["worx-landroid-vision-wr320"] ?? "prod-worx-landroid-vision-wr320",
    purpose: "WORX Landroid Vision WR320 — review figure: obstacles",
    exactModel: "WORX Landroid Vision WR320",
    type: "promotional_panel",
    checksum: "sha256:b48f3f73543147c5ddd59ab8c8fc7c43143d62e94edea1272c6e31ef14fe5ec6",
    width: 1254,
    height: 1254,
    src: "/media/reviews/worx-landroid-vision-wr320/obstacles.webp",
    altText:
      "A BotPlanet panel headed “AI obstacle avoidance” for the WORX Landroid " +
      "Vision WR320, showing the mower on a lawn with a curved blue path drawn " +
      "around a football, a toy truck, a trowel and a rugby ball.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("aug11-worx-landroid-vision-wr320-edge", "illustration"),
    productId: PRODUCT_ID["worx-landroid-vision-wr320"] ?? "prod-worx-landroid-vision-wr320",
    purpose: "WORX Landroid Vision WR320 — review figure: edge",
    exactModel: "WORX Landroid Vision WR320",
    type: "promotional_panel",
    checksum: "sha256:de43a197bd21132b16e36fc7a77129504b48ec4d4d0ebe63e8f9fce56faef28e",
    width: 1254,
    height: 1254,
    src: "/media/reviews/worx-landroid-vision-wr320/edge.webp",
    altText:
      "A BotPlanet panel headed “cut-to-edge mowing” for the WORX Landroid Vision " +
      "WR320, showing the mower running along a strip of lawn beside a paved edge " +
      "with a line of blue light under its deck.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("aug11-worx-landroid-vision-wr320-coverage", "illustration"),
    productId: PRODUCT_ID["worx-landroid-vision-wr320"] ?? "prod-worx-landroid-vision-wr320",
    purpose: "WORX Landroid Vision WR320 — review figure: coverage",
    exactModel: "WORX Landroid Vision WR320",
    type: "promotional_panel",
    checksum: "sha256:e0166e6ea3013bcdd5926cef3f64473fa44e7343d1f24647a216a19d126d7550",
    width: 1254,
    height: 1254,
    src: "/media/reviews/worx-landroid-vision-wr320/coverage.webp",
    altText:
      "The WORX Landroid Vision WR320 on a lawn at dusk in front of a lit house, " +
      "with arcs of green light sweeping out around it.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },

  /* ---- Segway Navimow i110N ---- */
  {
    ...base("aug11-segway-navimow-i110n-hero", "illustration"),
    productId: PRODUCT_ID["segway-navimow-i110n"] ?? "prod-segway-navimow-i110n",
    purpose: "Segway Navimow i110N — review lead and listing card",
    exactModel: "Segway Navimow i110N",
    type: "branded_placeholder",
    checksum: "sha256:32d083b9f3d34f83cd9d1f7580bcf6475e69cd569f90f562087464f8dfad7cae",
    width: 1672,
    height: 941,
    src: "/media/reviews/segway-navimow-i110n/hero.webp",
    altText:
      "A BotPlanet panel naming the Segway Navimow i110N and describing it as " +
      "wire-free robotic mowing, showing the grey and orange mower on a lawn at " +
      "night with a blue line drawn along the lawn edge and a lit house behind.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("aug11-segway-navimow-i110n-rtk", "illustration"),
    productId: PRODUCT_ID["segway-navimow-i110n"] ?? "prod-segway-navimow-i110n",
    purpose: "Segway Navimow i110N — review figure: rtk",
    exactModel: "Segway Navimow i110N",
    type: "promotional_panel",
    checksum: "sha256:306dfd8fb4d375935444ee8124ffe135e7aeacbadd0bc6e13b76f6f2ba71a651",
    width: 1254,
    height: 1254,
    src: "/media/reviews/segway-navimow-i110n/rtk.webp",
    altText:
      "A BotPlanet panel headed “RTK plus vision handles gardens with tall trees” " +
      "for the Segway Navimow i110N, showing the mower on a lawn beneath tall " +
      "trees at night with dotted lines running up to satellites overhead. Labels " +
      "read stable RTK accuracy under tree cover, AI vision obstacle recognition " +
      "and consistent coverage every time.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("aug11-segway-navimow-i110n-zoning", "illustration"),
    productId: PRODUCT_ID["segway-navimow-i110n"] ?? "prod-segway-navimow-i110n",
    purpose: "Segway Navimow i110N — review figure: zoning",
    exactModel: "Segway Navimow i110N",
    type: "promotional_panel",
    checksum: "sha256:57ada80b1ac2d73bb50ea0ce56703920d208a318c5ef39f277b67ab71a04287c",
    width: 1254,
    height: 1254,
    src: "/media/reviews/segway-navimow-i110n/zoning.webp",
    altText:
      "A BotPlanet panel headed “smart zoning and scheduled mowing” for the " +
      "Segway Navimow i110N, showing an overhead plan of a garden with a mowing " +
      "zone outlined in green, three scheduling cards giving days and times, the " +
      "mower at the lawn edge and a phone running the app.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("aug11-segway-navimow-i110n-voice", "illustration"),
    productId: PRODUCT_ID["segway-navimow-i110n"] ?? "prod-segway-navimow-i110n",
    purpose: "Segway Navimow i110N — review figure: voice",
    exactModel: "Segway Navimow i110N",
    type: "promotional_panel",
    checksum: "sha256:81bacb9cae25ca750b511bdd6b3d69b6a22478d3b7e87eea1e301dc6cba17416",
    width: 1254,
    height: 1254,
    src: "/media/reviews/segway-navimow-i110n/voice.webp",
    altText:
      "A BotPlanet panel headed “smart home by voice control” for the Segway " +
      "Navimow i110N, showing a woman sitting on a patio sofa with a cup beside a " +
      "smart speaker while the mower works on the lawn behind. Badges read works " +
      "with Alexa and works with Google Home.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },

  /* ---- eufy Robot Lawn Mower E15 ---- */
  {
    ...base("aug11-eufy-e15-hero", "illustration"),
    productId: PRODUCT_ID["eufy-e15"] ?? "prod-eufy-e15",
    purpose: "eufy Robot Lawn Mower E15 — review lead and listing card",
    exactModel: "eufy Robot Lawn Mower E15",
    type: "branded_placeholder",
    checksum: "sha256:dd0684de779e7c317a86af4073fe269f3772cebea8c5e0ebd61d618de833b943",
    width: 1672,
    height: 941,
    src: "/media/reviews/eufy-e15/hero.webp",
    altText:
      "A BotPlanet panel for the eufy Robot Lawn Mower E15, showing the white and " +
      "grey mower on a lawn at dusk with a curved blue guide line running behind " +
      "it and a lit house beyond. Labels read wire-free freedom, precise vision " +
      "navigation, smart and even cutting and app control.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("aug11-eufy-e15-cutting-height", "illustration"),
    productId: PRODUCT_ID["eufy-e15"] ?? "prod-eufy-e15",
    purpose: "eufy Robot Lawn Mower E15 — review figure: cutting-height",
    exactModel: "eufy Robot Lawn Mower E15",
    type: "promotional_panel",
    sourceProvider: "eufy",
    checksum: "sha256:1eebf4830c05b8d2b872fae9d2e9163aa7457a0ef0c9caa86988a6fc10f5a5d0",
    width: 815,
    height: 1050,
    src: "/media/reviews/eufy-e15/cutting-height.webp",
    altText:
      "Three stacked panels from eufy's own listing for the E15: the mower on " +
      "grass above the cutting-height range 25 to 75 millimetres, with a note " +
      "that 9 centimetres is the maximum grass height before mowing and that it " +
      "is not suitable for dense Zoysia or St Augustine; the mower on a bank " +
      "labelled slopes of up to 18 degrees; and the mower passing a person " +
      "reading in a deckchair, labelled noise as low as 56 decibels.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("aug11-eufy-e15-obstacles", "illustration"),
    productId: PRODUCT_ID["eufy-e15"] ?? "prod-eufy-e15",
    purpose: "eufy Robot Lawn Mower E15 — review figure: obstacles",
    exactModel: "eufy Robot Lawn Mower E15",
    type: "promotional_panel",
    sourceProvider: "eufy",
    checksum: "sha256:1131462964de8f2423528f8cb59b34c786667b86ffcad5e1d487d63192eb8571",
    width: 840,
    height: 1050,
    src: "/media/reviews/eufy-e15/obstacles.webp",
    altText:
      "A panel from eufy's own listing for the E15 headed “precise obstacle " +
      "avoiding”, showing a child and a small dog playing on a lawn beside the " +
      "mower, above a row of icons for trunk, sprinkler, fence, fountain, pool, " +
      "rock, light, lounger, ball, toy, human and pets.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("aug11-eufy-e15-app-security", "illustration"),
    productId: PRODUCT_ID["eufy-e15"] ?? "prod-eufy-e15",
    purpose: "eufy Robot Lawn Mower E15 — review figure: app-security",
    exactModel: "eufy Robot Lawn Mower E15",
    type: "promotional_panel",
    sourceProvider: "eufy",
    checksum: "sha256:5cdd24248cef172188c398eeb25d72eda7afc5d322b799e4c94fe51a60038476",
    width: 860,
    height: 1050,
    src: "/media/reviews/eufy-e15/app-security.webp",
    altText:
      "Two panels from eufy's own listing for the E15: a man sitting with a " +
      "tablet on a lawn beside a pool under the heading app control, and beneath " +
      "it a security system panel showing a phone alert and a badge reading GPS " +
      "plus 4G.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },

  /* ---- Mammotion LUBA 3 AWD 1500H ---- */
  {
    ...base("aug11-mammotion-luba-3-awd-1500h-hero", "illustration"),
    productId: PRODUCT_ID["mammotion-luba-3-awd-1500h"] ?? "prod-mammotion-luba-3-awd-1500h",
    purpose: "Mammotion LUBA 3 AWD 1500H — review lead and listing card",
    exactModel: "Mammotion LUBA 3 AWD 1500H",
    type: "branded_placeholder",
    checksum: "sha256:da34b1b0a345b3fa634b1505b9310363d170f15be916257ccf770f2d02bd6f23",
    width: 1254,
    height: 1254,
    src: "/media/reviews/mammotion-luba-3-awd-1500h/hero.webp",
    altText:
      "A BotPlanet panel naming the Mammotion LUBA 3 AWD, showing the white and " +
      "orange four-wheel-drive mower on a lawn at night with a blue guide line " +
      "drawn across the grass and a lit house behind.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("aug11-mammotion-luba-3-awd-1500h-cutting-decks", "illustration"),
    productId: PRODUCT_ID["mammotion-luba-3-awd-1500h"] ?? "prod-mammotion-luba-3-awd-1500h",
    purpose: "Mammotion LUBA 3 AWD 1500H — review figure: cutting-decks",
    exactModel: "Mammotion LUBA 3 AWD 1500H",
    type: "promotional_panel",
    checksum: "sha256:b55cb9ed753f4b2983689dd72fadbc52429dc710ca4e0bcb54643f15c3399ad9",
    width: 1254,
    height: 1254,
    src: "/media/reviews/mammotion-luba-3-awd-1500h/cutting-decks.webp",
    altText:
      "The Mammotion LUBA 3 AWD tilted up to show its underside: two circular " +
      "cutting discs spinning inside halos of blue light, with four chunky " +
      "treaded wheels around them.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("aug11-mammotion-luba-3-awd-1500h-navigation", "illustration"),
    productId: PRODUCT_ID["mammotion-luba-3-awd-1500h"] ?? "prod-mammotion-luba-3-awd-1500h",
    purpose: "Mammotion LUBA 3 AWD 1500H — review figure: navigation",
    exactModel: "Mammotion LUBA 3 AWD 1500H",
    type: "promotional_panel",
    checksum: "sha256:e2b3c36137dbb8e60e64c5c95700f8e163e57b65977ea358366d1514c6dd64b1",
    width: 1254,
    height: 1254,
    src: "/media/reviews/mammotion-luba-3-awd-1500h/navigation.webp",
    altText:
      "The Mammotion LUBA 3 AWD on a lit platform with translucent wireframe " +
      "panels floating beside it showing a garden map, a house outline and a " +
      "cloud icon.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("aug11-mammotion-luba-3-awd-1500h-obstacles", "illustration"),
    productId: PRODUCT_ID["mammotion-luba-3-awd-1500h"] ?? "prod-mammotion-luba-3-awd-1500h",
    purpose: "Mammotion LUBA 3 AWD 1500H — review figure: obstacles",
    exactModel: "Mammotion LUBA 3 AWD 1500H",
    type: "promotional_panel",
    checksum: "sha256:105277a8c077b408d4de562f17ec90a4bbae6f4319868c25330dd643223aa8ec",
    width: 1254,
    height: 1254,
    src: "/media/reviews/mammotion-luba-3-awd-1500h/obstacles.webp",
    altText:
      "The Mammotion LUBA 3 AWD on a lawn at night at the centre of concentric " +
      "rings of light, with a dog, a football, two bicycles and a child's toy " +
      "scattered around it on the grass.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
];

/**
 * The three files supplied under "roborock Qrevo S5V" that this site cannot
 * publish as supplied, and exactly why.
 *
 * ALL THREE CARRY "ROBOROCK SAROS 10" AS THEIR HEADLINE, in metal type across
 * the top, while describing the Qrevo: one of them is a FlexiArm edge-mopping
 * panel, and FlexiArm is the Qrevo's feature, not the Saros's. So the name in
 * the pixels belongs to one machine and the content to another, and there is
 * no page on this site where both halves are true at once:
 *
 *  - on the Qrevo S5V review, the reader is shown a different model's name,
 *    on a page whose opening section exists to stop them buying the wrong
 *    roborock;
 *  - on the Saros 10 review, the name is right and the features are not.
 *
 * This is the narrow case the note above REVIEW_FIGURES_WITHHELD describes:
 * pixels stating the opposite of the page, where no caption can hold both. It
 * is a headline re-render rather than a re-shoot — the photography is fine and
 * the machine is right. Held pending that, not discarded.
 */
/**
 * Six files for the Yarbo Snow Blower review, supplied 11 August 2026.
 *
 * WHAT THEY FIX. The review shipped earlier the same day with no artwork at
 * all — no lead, no figures, and a social preview falling back to the generic
 * BotPlanet brand card. It is the only page on the site arguing that a $1,299
 * "snow blower" and a $4,999 "snow blower" are different objects, and it was
 * making that argument in text alone. `module-split` makes it in one picture.
 *
 * ALL SIX ARE TYPED AS ILLUSTRATION AND SHUT OUT OF PRODUCT SCHEMA, and that
 * is a stricter call than the 11 August batch above needed. Those files are
 * shut out because they carry marketing claims in their pixels; these carry no
 * claim at all — no price, no throw distance, no runtime, which is exactly
 * what was asked for, since every one of those three numbers is either
 * seasonal or a conflict this review publishes unresolved. They are shut out
 * for a different reason: they are renders rather than photographs of the
 * machine, and this page refuses a buy link because Amazon's own brand and
 * model fields have not been read. Asserting `productImage` here would be
 * claiming photographic authority over a machine whose listing identity we
 * have just declined to assert. The two positions have to agree.
 *
 * WHAT THE PIXELS GOT RIGHT THAT THE BRIEF GOT WRONG. The brief asked for a
 * white and grey machine. The renders are black and yellow, which is Yarbo's
 * actual livery — Lowe's and Best Buy both picture it that way, and Best Buy
 * titles the SKU "Black Yarbo S1". The brief was wrong and the artwork is not,
 * so nothing here is corrected in a caption.
 *
 * THE ONE SLOT THESE SIX LEFT UNFILLED was the lawn best-of hero — all six
 * files are Yarbo snow. It was filled separately the same day and is recorded
 * as `hero-editorial-best-lawn-mowers` up in ORIGINAL_ASSETS, alongside the
 * other editorial heroes rather than down here, because it depicts no product.
 */
export const YARBO_UPLOAD_ASSETS: MediaAssetRecord[] = [
  {
    ...base("yarbo-snow-blower-hero", "illustration"),
    productId: PRODUCT_ID["yarbo-snow-blower"] ?? "prod-yarbo-snow-blower",
    purpose: "Yarbo Snow Blower — review lead, listing card and social preview",
    exactModel: "Yarbo Snow Blower (YARBO S1)",
    type: "branded_placeholder",
    checksum: "sha256:66ed07c1faa37a4b6d7955fcc121343f809d8374bf77ea7b294207446154be10",
    width: 1672,
    height: 941,
    src: "/media/reviews/yarbo-snow-blower/hero.webp",
    altText:
      "A BotPlanet panel titled Yarbo Snow Blower: a black and yellow tracked " +
      "robot on a driveway at night, snow arcing from its chute to the right, " +
      "a lit house behind it and a cleared strip visible behind its tracks.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("yarbo-snow-blower-module-split", "illustration"),
    productId: PRODUCT_ID["yarbo-snow-blower"] ?? "prod-yarbo-snow-blower",
    purpose: "Yarbo Snow Blower — review figure: the module and the Core, separated",
    exactModel: "Yarbo Snow Blower (YARBO S1)",
    type: "educational_diagram",
    checksum: "sha256:0053b3a583fa408d4010ad34233ca952abd2f0db64e04e9c80258210353aad3f",
    width: 1122,
    height: 1402,
    src: "/media/reviews/yarbo-snow-blower/module-split.webp",
    altText:
      "The two halves of the machine shown apart on black plinths: above, the " +
      "snow blower module — a wide housing with two spiral augers across the " +
      "front, a drive shaft running back to an impeller, and the chute rising " +
      "from the top; below, the tracked Core platform on its own, a bare " +
      "chassis on two rubber tracks with YARBO along the side.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
    notes:
      "The single most useful image on the page. The module alone is $1,299 " +
      "and is the top half; the thing sold as the Yarbo Snow Blower is both " +
      "halves and costs $4,999. No figure is set into the pixels, so the " +
      "prices stay in the text where they carry the date they were read.",
  },
  {
    ...base("yarbo-snow-blower-tracked-platform", "illustration"),
    productId: PRODUCT_ID["yarbo-snow-blower"] ?? "prod-yarbo-snow-blower",
    purpose: "Yarbo Snow Blower — review figure: a robot carrying an attachment",
    exactModel: "Yarbo Snow Blower (YARBO S1)",
    type: "educational_diagram",
    checksum: "sha256:341cbf2854caeeddc2722574a0708cefc16211cc81b6c508ed37ecc5eedf7174",
    width: 1122,
    height: 1402,
    src: "/media/reviews/yarbo-snow-blower/tracked-platform.webp",
    altText:
      "The assembled machine seen from the front quarter at night: a low " +
      "tracked chassis at the back with an antenna and a camera pod, and a " +
      "separate blower housing bolted across the front with its augers turning " +
      "in the snow and headlamps lit.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
  {
    ...base("yarbo-snow-blower-chute-control", "illustration"),
    productId: PRODUCT_ID["yarbo-snow-blower"] ?? "prod-yarbo-snow-blower",
    purpose: "Yarbo Snow Blower — review figure: chute rotation and elevation",
    exactModel: "Yarbo Snow Blower (YARBO S1)",
    type: "educational_diagram",
    checksum: "sha256:7e5f2f9f8189f78bc14edb295f00a5f56164754283f64abb7230b791b1143f48",
    width: 1122,
    height: 1402,
    src: "/media/reviews/yarbo-snow-blower/chute-control.webp",
    altText:
      "Two panels of the same machine with arrows drawn over the chute. In the " +
      "upper panel a curved arrow shows the chute swinging left and right and " +
      "the snow throwing flat and wide; in the lower panel a straight arrow " +
      "shows it raised and the snow throwing high.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
    notes:
      "Deliberately carries no distance. Yarbo's own module page prints both " +
      "up to 40 feet and 6-40 Yards Throw Control in one panel, and the review " +
      "publishes that as an unresolved conflict — a number drawn into the " +
      "artwork would pick a side we refused to pick.",
  },
  {
    ...base("yarbo-snow-blower-conditions", "illustration"),
    productId: PRODUCT_ID["yarbo-snow-blower"] ?? "prod-yarbo-snow-blower",
    purpose: "Yarbo Snow Blower — review figure: four snow conditions",
    exactModel: "Yarbo Snow Blower (YARBO S1)",
    type: "educational_diagram",
    checksum: "sha256:38567a9811f5a9eba64a68b8a1cea2ff4b73c6351931dcd73f482849626c5a96",
    width: 1122,
    height: 1402,
    src: "/media/reviews/yarbo-snow-blower/conditions.webp",
    altText:
      "Four panels of the same machine in different snow: dry powder in an " +
      "open field, heavy falling snow beside a lit house, wet slush on a " +
      "streaming wet driveway, and a shoulder-high plough bank across a garage " +
      "door.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
    notes:
      "Placed against the section listing what this review could NOT " +
      "establish, because those four conditions are precisely what nobody has " +
      "measured this machine across. The caption says so rather than letting " +
      "four confident renders read as four results.",
  },
  {
    ...base("yarbo-snow-blower-daylight-driveway", "illustration"),
    productId: PRODUCT_ID["yarbo-snow-blower"] ?? "prod-yarbo-snow-blower",
    purpose: "Yarbo Snow Blower — review figure: deep snow, daylight",
    exactModel: "Yarbo Snow Blower (YARBO S1)",
    type: "educational_diagram",
    checksum: "sha256:cad64385e941ae915eb812e6227e44f3ab3b1ef963efb4bc45f9747b7a4c92f7",
    width: 1122,
    height: 1402,
    src: "/media/reviews/yarbo-snow-blower/daylight-driveway.webp",
    altText:
      "The machine working a long driveway in bright daylight under a blue " +
      "sky, deep snow banked either side of the cleared strip, a timber house " +
      "and snow-laden conifers behind.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    presentation: "bleed",
  },
];

export const QREVO_S5V_ARTWORK_HELD = [
  { file: "Multifunctional Dock", headline: "ROBOROCK SAROS 10" },
  { file: "FlexiArm Edge Mopping", headline: "ROBOROCK SAROS 10" },
  { file: "Smart Navigation & Obstacle Avoidance", headline: "ROBOROCK SAROS 10" },
] as const;


/* Betta SE Plus listing images supplied by the owner, 1 October 2026. Real product
   photography and the maker's own panels; every claim in a panel is attributed to
   Betta in the alt text rather than asserted. */
export const SOLAR_SKIMMER_UPLOAD_ASSETS: MediaAssetRecord[] = [
  {
    ...base("betta-se-plus-photo-top", "depiction"),
    productId: PRODUCT_ID["betta-se-plus"] ?? "prod-betta-se-plus",
    purpose: "Betta SE Plus \u2014 clean product photograph (the maker's listing image)",
    exactModel: "Betta SE Plus — Solar-Powered Robotic Pool Skimmer",
    type: "product_hero",
    checksum: "sha256:3ce12269b91e77153aef370aa73d37c7ebc253dba80a51c50714e186296e69dc",
    width: 1500,
    height: 1044,
    src: "/media/reviews/betta-se-plus/photo-top.webp",
    altText: "Front view of the blue and black Betta solar skimmer on a white background: a dark solar panel across the top, the Betta name on the front lip above the open intake, and two small blue propellers underneath.",
    altTextStatus: "approved",
    schema: DEPICTION_SCHEMA,
    depictsRealProduct: true,
    notes: "Owner-supplied from the Amazon listing images; panel text is the maker's marketing.",
  },
  {
    ...base("betta-se-plus-non-stop-30h", "illustration"),
    productId: PRODUCT_ID["betta-se-plus"] ?? "prod-betta-se-plus",
    purpose: "Betta SE Plus \u2014 maker panel on continuous running time",
    exactModel: "Betta SE Plus — Solar-Powered Robotic Pool Skimmer",
    type: "educational_diagram",
    checksum: "sha256:cfa6154abb646ec039c8c024a2e30f436b670e16b86d47e6ac4573ab1729fdb7",
    width: 1455,
    height: 1455,
    src: "/media/reviews/betta-se-plus/non-stop-30h.webp",
    altText: "Betta's own marketing panel for non-stop cleaning, stating that the skimmer runs up to 30 hours; the 30-hour figure is Betta's claim, not a measurement made here.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: true,
    notes: "Owner-supplied from the Amazon listing images; panel text is the maker's marketing.",
  },
  {
    ...base("betta-se-plus-charging-modes", "illustration"),
    productId: PRODUCT_ID["betta-se-plus"] ?? "prod-betta-se-plus",
    purpose: "Betta SE Plus \u2014 maker panel on solar and adapter charging",
    exactModel: "Betta SE Plus — Solar-Powered Robotic Pool Skimmer",
    type: "educational_diagram",
    checksum: "sha256:8478410b5c9b942fd6d794815c5939eaa571a45ebbf98795c2e0ca8d4c913207",
    width: 1080,
    height: 1080,
    src: "/media/reviews/betta-se-plus/charging-modes.webp",
    altText: "Betta's marketing panel for cordless charging: the skimmer from above with its solar panel, beside the mains adapter option Betta offers for days without sun.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: true,
    notes: "Owner-supplied from the Amazon listing images; panel text is the maker's marketing.",
  },
  {
    ...base("betta-se-plus-motors-sct", "illustration"),
    productId: PRODUCT_ID["betta-se-plus"] ?? "prod-betta-se-plus",
    purpose: "Betta SE Plus \u2014 maker panel on the twin salt-tolerant motors",
    exactModel: "Betta SE Plus — Solar-Powered Robotic Pool Skimmer",
    type: "educational_diagram",
    checksum: "sha256:56cdcd70985e300a217d18cd8d50731107b51181d173e06aeb08a862dea9483c",
    width: 1080,
    height: 1080,
    src: "/media/reviews/betta-se-plus/motors-sct.webp",
    altText: "Betta's marketing panel for its twin Salt Chlorine Tolerant motors, showing the skimmer from the rear with its two blue propellers, on a pool-grey surface.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: true,
    notes: "Owner-supplied from the Amazon listing images; panel text is the maker's marketing.",
  },
  {
    ...base("betta-se-plus-fall-winter", "illustration"),
    productId: PRODUCT_ID["betta-se-plus"] ?? "prod-betta-se-plus",
    purpose: "Betta SE Plus \u2014 maker panel on short winter run times",
    exactModel: "Betta SE Plus — Solar-Powered Robotic Pool Skimmer",
    type: "educational_diagram",
    checksum: "sha256:287c1703c6d9e78c03e038addd53b1f2d283832d7607f7d9c3432e3fdf4ad29a",
    width: 1080,
    height: 1058,
    src: "/media/reviews/betta-se-plus/fall-winter.webp",
    altText: "Betta's marketing panel explaining why shorter run times in autumn and winter come from less sunlight, not from battery wear; that explanation is Betta's.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: true,
    notes: "Owner-supplied from the Amazon listing images; panel text is the maker's marketing.",
  },
  {
    ...base("betta-se-plus-basket-photo", "illustration"),
    productId: PRODUCT_ID["betta-se-plus"] ?? "prod-betta-se-plus",
    purpose: "Betta SE Plus \u2014 the removable debris basket",
    exactModel: "Betta SE Plus — Solar-Powered Robotic Pool Skimmer",
    type: "filtration_detail",
    checksum: "sha256:b831156912e42ee71e4e40557847d72f4637bf204e08492e744eda634b82cdb3",
    width: 1080,
    height: 1080,
    src: "/media/reviews/betta-se-plus/basket-photo.webp",
    altText: "The skimmer's black debris basket lifted out and holding a handful of brown leaves, with a red gear wheel at one end and a grey handle across the middle.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: true,
    notes: "Owner-supplied from the Amazon listing images; panel text is the maker's marketing.",
  },
  {
    ...base("betta-se-plus-radar-uv", "illustration"),
    productId: PRODUCT_ID["betta-se-plus"] ?? "prod-betta-se-plus",
    purpose: "Betta SE Plus \u2014 maker panel on the sensors and the UV-resistant body",
    exactModel: "Betta SE Plus — Solar-Powered Robotic Pool Skimmer",
    type: "educational_diagram",
    checksum: "sha256:624b864f54eec83f2acdc04a62ed63b4230f61e3ea7e86e9413778c99080d4d8",
    width: 1080,
    height: 1080,
    src: "/media/reviews/betta-se-plus/radar-uv.webp",
    altText: "Betta's marketing panel showing the skimmer beside pool steps with ultrasonic sensor arcs and a UV symbol drawn over it; the radar and UV-resistance wording is Betta's.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: true,
    notes: "Owner-supplied from the Amazon listing images; panel text is the maker's marketing.",
  },
];


/* Owner-supplied listing images for the three solar skimmers added on 1 October 2026.
   Aiper, Beatbot and BRINBO panels carry the maker's claim in their pixels, so every
   alt text attributes the figure to the maker rather than adopting it. The clean
   product shots are the only product-image eligible records. */
export const SOLAR_SKIMMER_NEW_ASSETS: MediaAssetRecord[] = [
  {
    ...base("aiper-ecosurfer-s2-hero", "illustration"),
    productId: PRODUCT_ID["aiper-ecosurfer-s2"] ?? "prod-aiper-ecosurfer-s2",
    purpose: "Aiper EcoSurfer S2 \u2014 review lead, Aiper's own panel on battery and solar charging",
    exactModel: "Aiper EcoSurfer S2",
    type: "educational_diagram",
    checksum: "sha256:eb1e9e65773a500460bce773dd3831f04fda9795559f8ade747983ed8ace6a04",
    width: 1500,
    height: 1500,
    src: "/media/reviews/aiper-ecosurfer-s2/hero.webp",
    altText: "Aiper's own marketing panel for the EcoSurfer S2: a blue skimmer floating in sunlit water beside a battery graphic, with the headline claiming a 35 hour battery and 24/7 cleaning with Aiper's SolarSeeker technology. The 35 hours and the 24/7 are Aiper's claims, not measurements made here.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: true,
    notes: "Owner-supplied from the Amazon listing images; any text in the picture is the maker's marketing.",
  },
  {
    ...base("aiper-ecosurfer-s2-edge-corner", "illustration"),
    productId: PRODUCT_ID["aiper-ecosurfer-s2"] ?? "prod-aiper-ecosurfer-s2",
    purpose: "Aiper EcoSurfer S2 \u2014 review figure: edge and corner cleaning",
    exactModel: "Aiper EcoSurfer S2",
    type: "educational_diagram",
    checksum: "sha256:fba48da979cb054d97d62cccacb74f38b7b010f49a20e4be6f03445ae879f304",
    width: 1500,
    height: 1500,
    src: "/media/reviews/aiper-ecosurfer-s2/edge-corner.webp",
    altText: "Aiper's marketing panel on edge and corner cleaning, showing the skimmer against a pool wall and naming two dToF sensors; the sensor count and the claim of precise edge and corner cleaning are Aiper's.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: true,
    notes: "Owner-supplied from the Amazon listing images; any text in the picture is the maker's marketing.",
  },
  {
    ...base("aiper-ecosurfer-s2-filtration", "illustration"),
    productId: PRODUCT_ID["aiper-ecosurfer-s2"] ?? "prod-aiper-ecosurfer-s2",
    purpose: "Aiper EcoSurfer S2 \u2014 review figure: filtration and the leak-proof baffle",
    exactModel: "Aiper EcoSurfer S2",
    type: "educational_diagram",
    checksum: "sha256:49e256b5fed2e3aaa85d9b692cdf1c613fc794b5a8f740264a364abab267188c",
    width: 1500,
    height: 1500,
    src: "/media/reviews/aiper-ecosurfer-s2/filtration.webp",
    altText: "Aiper's marketing panel on filtration, naming a 150 micron mesh and a DebrisGuard leak-proof baffle meant to keep debris from escaping when the skimmer reverses; both are Aiper's claims.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: true,
    notes: "Owner-supplied from the Amazon listing images; any text in the picture is the maker's marketing.",
  },
  {
    ...base("aiper-ecosurfer-s2-anti-stranding", "illustration"),
    productId: PRODUCT_ID["aiper-ecosurfer-s2"] ?? "prod-aiper-ecosurfer-s2",
    purpose: "Aiper EcoSurfer S2 \u2014 review figure: the underside and the anti-stranding columns",
    exactModel: "Aiper EcoSurfer S2",
    type: "educational_diagram",
    checksum: "sha256:d0af9fb095a8915860860bfb91d58416a771fb177960e103178325d12f51fb31",
    width: 1500,
    height: 1500,
    src: "/media/reviews/aiper-ecosurfer-s2/anti-stranding.webp",
    altText: "The underside of the skimmer seen from below at a pool wall, with adjustable black columns that Aiper says prevent stranding on a pool step or ledge, set between zero and two inches. The adjustment range and the claim are Aiper's.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: true,
    notes: "Owner-supplied from the Amazon listing images; any text in the picture is the maker's marketing.",
  },
  {
    ...base("beatbot-iskim-hero", "depiction"),
    productId: PRODUCT_ID["beatbot-iskim"] ?? "prod-beatbot-iskim",
    purpose: "Beatbot iSkim \u2014 review lead, listing card and social preview",
    exactModel: "Beatbot iSkim",
    type: "product_hero",
    checksum: "sha256:69f36d69099dd957d994a38cf63daed7e32c49940397fde71ec373bd5444e617",
    width: 1500,
    height: 1172,
    src: "/media/reviews/beatbot-iskim/hero.webp",
    altText: "The dark blue Beatbot iSkim on a white background at a three-quarter angle: a square solar panel on top, a black float along each side, the Beatbot name on the right-hand float, and its mains charger and charging dock lying beside it.",
    altTextStatus: "approved",
    schema: DEPICTION_SCHEMA,
    depictsRealProduct: true,
    notes: "Owner-supplied from the Amazon listing images; any text in the picture is the maker's marketing.",
  },
  {
    ...base("beatbot-iskim-basket-9l", "illustration"),
    productId: PRODUCT_ID["beatbot-iskim"] ?? "prod-beatbot-iskim",
    purpose: "Beatbot iSkim \u2014 review figure: the 9 litre basket",
    exactModel: "Beatbot iSkim",
    type: "filtration_detail",
    checksum: "sha256:c66d4ceff61bdfcfcfbb59c7673fec8ff80ed0715032f7ba6fe10a85bce29234",
    width: 1500,
    height: 1500,
    src: "/media/reviews/beatbot-iskim/basket-9l.webp",
    altText: "Beatbot's marketing panel for the iSkim's 9 litre debris basket, shown full of leaves and petals, with a day-by-day fill chart comparing it to a basket Beatbot says holds 4.5 litres. The comparison and the fill estimates are Beatbot's own.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: true,
    notes: "Owner-supplied from the Amazon listing images; any text in the picture is the maker's marketing.",
  },
  {
    ...base("beatbot-iskim-rain-24-7", "illustration"),
    productId: PRODUCT_ID["beatbot-iskim"] ?? "prod-beatbot-iskim",
    purpose: "Beatbot iSkim \u2014 review figure: 24/7 cleaning and the battery",
    exactModel: "Beatbot iSkim",
    type: "educational_diagram",
    checksum: "sha256:ca6c8f28468c736853546e3ca1f4293e1acd581793583075e75bdb40943b590a",
    width: 1500,
    height: 1500,
    src: "/media/reviews/beatbot-iskim/rain-24-7.webp",
    altText: "Beatbot's marketing panel splitting a pool between sunshine and a rainy night, with the iSkim floating on the line, and the claim of 24/7 cleaning even in moderate rain from a 24 watt solar panel and a 10,000 mAh battery. Those figures are Beatbot's.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: true,
    notes: "Owner-supplied from the Amazon listing images; any text in the picture is the maker's marketing.",
  },
  {
    ...base("beatbot-iskim-sonicsense", "illustration"),
    productId: PRODUCT_ID["beatbot-iskim"] ?? "prod-beatbot-iskim",
    purpose: "Beatbot iSkim \u2014 review figure: SonicSense obstacle detection",
    exactModel: "Beatbot iSkim",
    type: "educational_diagram",
    checksum: "sha256:b51ac94a8234bc0c966d1df884edf4368b649bf92ea052fdc3d314d774c89aeb",
    width: 1500,
    height: 1500,
    src: "/media/reviews/beatbot-iskim/sonicsense.webp",
    altText: "Beatbot's marketing panel showing the iSkim steering away from pool steps, with sensor arcs drawn from its front, beside a smaller picture of an unnamed other skimmer snagged on the steps. The comparison is Beatbot's, and Beatbot's name for the sensing is SonicSense.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: true,
    notes: "Owner-supplied from the Amazon listing images; any text in the picture is the maker's marketing.",
  },
  {
    ...base("beatbot-iskim-edge-following", "illustration"),
    productId: PRODUCT_ID["beatbot-iskim"] ?? "prod-beatbot-iskim",
    purpose: "Beatbot iSkim \u2014 review figure: guide-wheel edge following",
    exactModel: "Beatbot iSkim",
    type: "educational_diagram",
    checksum: "sha256:62111fff37bcb3d63b90f5d3fd6c52a055af6e8b50602803d47e08f801225dbd",
    width: 1500,
    height: 1500,
    src: "/media/reviews/beatbot-iskim/edge-following.webp",
    altText: "Beatbot's marketing panel showing the iSkim running along a pool edge with leaves ahead of its intake, and an inset of a guide wheel against the pool wall. Beatbot says the guide wheel helps it follow edges for more complete surface cleaning.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: true,
    notes: "Owner-supplied from the Amazon listing images; any text in the picture is the maker's marketing.",
  },
  {
    ...base("beatbot-iskim-anti-spill", "illustration"),
    productId: PRODUCT_ID["beatbot-iskim"] ?? "prod-beatbot-iskim",
    purpose: "Beatbot iSkim \u2014 review figure: anti-spill intake",
    exactModel: "Beatbot iSkim",
    type: "educational_diagram",
    checksum: "sha256:48c06dde07657f3ba334568c98cfdf90b81116b08457ff83dbb32b44b9c8355e",
    width: 1500,
    height: 1500,
    src: "/media/reviews/beatbot-iskim/anti-spill.webp",
    altText: "Beatbot's marketing panel contrasting the iSkim's covered intake with an unnamed other skimmer shedding leaves behind it while reversing. The claim that debris stays inside even when reversing, and the comparison, are Beatbot's.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: true,
    notes: "Owner-supplied from the Amazon listing images; any text in the picture is the maker's marketing.",
  },
  {
    ...base("beatbot-iskim-solartrack", "illustration"),
    productId: PRODUCT_ID["beatbot-iskim"] ?? "prod-beatbot-iskim",
    purpose: "Beatbot iSkim \u2014 review figure: SolarTrack",
    exactModel: "Beatbot iSkim",
    type: "educational_diagram",
    checksum: "sha256:79f59617e7c993575f9065704c1cbb60d3bb41e30bfd85d437c0d5f44c881b35",
    width: 1500,
    height: 1500,
    src: "/media/reviews/beatbot-iskim/solartrack.webp",
    altText: "Beatbot's marketing panel showing one iSkim with a low battery in shade and a second with a full battery in sun, linked by an arrow. Beatbot's claim is that its patented SolarTrack follows sunlight to maximise charging; we have not tested it.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: true,
    notes: "Owner-supplied from the Amazon listing images; any text in the picture is the maker's marketing.",
  },
  {
    ...base("beatbot-iskim-auto-park", "illustration"),
    productId: PRODUCT_ID["beatbot-iskim"] ?? "prod-beatbot-iskim",
    purpose: "Beatbot iSkim \u2014 review figure: auto-park and the app",
    exactModel: "Beatbot iSkim",
    type: "educational_diagram",
    checksum: "sha256:a7fbc76176b145fbc5253e515c86c92a06f2159a3858b98affed432485dd55ab",
    width: 1500,
    height: 1500,
    src: "/media/reviews/beatbot-iskim/auto-park.webp",
    altText: "Beatbot's marketing panel with a woman at a poolside holding a phone that shows an app button labelled one-tap parking, and the iSkim stopped at the pool edge below her. Beatbot says it parks itself after cleaning or on one tap in the Beatbot app.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: true,
    notes: "Owner-supplied from the Amazon listing images; any text in the picture is the maker's marketing.",
  },
  {
    ...base("brinbo-sk01-hero", "depiction"),
    productId: PRODUCT_ID["brinbo-sk01"] ?? "prod-brinbo-sk01",
    purpose: "BRINBO SK01 \u2014 review lead, listing card and social preview",
    exactModel: "BRINBO SK01",
    type: "product_hero",
    checksum: "sha256:f00af736bcc4e26a4ff09d474a6fa0b951af04a61b13f3ee33734a0c42d70d32",
    width: 1500,
    height: 1156,
    src: "/media/reviews/brinbo-sk01/hero.webp",
    altText: "The grey and black BRINBO SK01 solar skimmer on a white background: a dark panel on top under a clear lid, two large teal-ringed propellers at the front, teal feet, and a phone beside it showing the SK01 app with a pause button, a battery reading of 42 per cent and a temperature of 21 degrees.",
    altTextStatus: "approved",
    schema: DEPICTION_SCHEMA,
    depictsRealProduct: true,
    notes: "Owner-supplied from the Amazon listing images; any text in the picture is the maker's marketing.",
  },
  {
    ...base("brinbo-sk01-surface-cleaning", "illustration"),
    productId: PRODUCT_ID["brinbo-sk01"] ?? "prod-brinbo-sk01",
    purpose: "BRINBO SK01 \u2014 review figure: what it picks up",
    exactModel: "BRINBO SK01",
    type: "educational_diagram",
    checksum: "sha256:130e04e4c532a95568e150911e79cc87338f8380651a0ec9c297e6d73abf340d",
    width: 1500,
    height: 1500,
    src: "/media/reviews/brinbo-sk01/surface-cleaning.webp",
    altText: "BRINBO's marketing panel headed Auto Surface Cleaning: the skimmer's front at the waterline with leaves streaming toward its intake, and four icons naming leaves, dust, hair and twigs. What it picks up is BRINBO's list; we have not tested it.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: true,
    notes: "Owner-supplied from the Amazon listing images; any text in the picture is the maker's marketing.",
  },
  {
    ...base("brinbo-sk01-charging", "illustration"),
    productId: PRODUCT_ID["brinbo-sk01"] ?? "prod-brinbo-sk01",
    purpose: "BRINBO SK01 \u2014 review figure: solar and adapter charging",
    exactModel: "BRINBO SK01",
    type: "educational_diagram",
    checksum: "sha256:9516d308a04a37050d1b7b7a078ebe9c9e009d818fc2b7f16c04ce2068c8c25d",
    width: 1500,
    height: 1500,
    src: "/media/reviews/brinbo-sk01/charging.webp",
    altText: "BRINBO's marketing panel split between sunlit water and a mains socket, with the skimmer on the dividing line. It names 100 per cent solar charging and a 2.5 hour adapter charge; both figures are BRINBO's.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: true,
    notes: "Owner-supplied from the Amazon listing images; any text in the picture is the maker's marketing.",
  },
  {
    ...base("brinbo-sk01-app-support", "illustration"),
    productId: PRODUCT_ID["brinbo-sk01"] ?? "prod-brinbo-sk01",
    purpose: "BRINBO SK01 \u2014 review figure: the app",
    exactModel: "BRINBO SK01",
    type: "educational_diagram",
    checksum: "sha256:2e63f2437c366bf47596c5b75e457306c56374a6197a0057241d4cae2ab1e472",
    width: 1500,
    height: 1500,
    src: "/media/reviews/brinbo-sk01/app-support.webp",
    altText: "BRINBO's marketing panel headed APP Support: a hand holding a phone that shows the SK01 app mid-run, with a battery reading, a temperature, a park button and a pause button, beside the skimmer floating in the pool behind.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: true,
    notes: "Owner-supplied from the Amazon listing images; any text in the picture is the maker's marketing.",
  },
  {
    ...base("brinbo-sk01-ultrasonic", "illustration"),
    productId: PRODUCT_ID["brinbo-sk01"] ?? "prod-brinbo-sk01",
    purpose: "BRINBO SK01 \u2014 review figure: ultrasonic obstacle avoidance",
    exactModel: "BRINBO SK01",
    type: "educational_diagram",
    checksum: "sha256:efc918f10ddbd771ef81f3e9f90a9eb867e1ee469f27ab36fa0cad17802f77eb",
    width: 1500,
    height: 1500,
    src: "/media/reviews/brinbo-sk01/ultrasonic.webp",
    altText: "BRINBO's marketing panel showing the skimmer with sensor arcs fanning from its front toward an inflatable swan. The panel's headline misspells radar as Rader; the obstacle avoidance is BRINBO's claim and the sensor type is as BRINBO states it.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: true,
    notes: "Owner-supplied from the Amazon listing images; any text in the picture is the maker's marketing.",
  },
  {
    ...base("brinbo-sk01-anti-stuck", "illustration"),
    productId: PRODUCT_ID["brinbo-sk01"] ?? "prod-brinbo-sk01",
    purpose: "BRINBO SK01 \u2014 review figure: the anti-stuck bars",
    exactModel: "BRINBO SK01",
    type: "educational_diagram",
    checksum: "sha256:5b4500b2b70a362d9232d24fbf6466915ece8140b7c728aca16370675fe6269a",
    width: 1500,
    height: 1500,
    src: "/media/reviews/brinbo-sk01/anti-stuck.webp",
    altText: "BRINBO's marketing panel of the skimmer's underside beside a pool wall, with adjustable black bars that BRINBO says you set to avoid getting stuck, and an inset circle picking out one bar.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: true,
    notes: "Owner-supplied from the Amazon listing images; any text in the picture is the maker's marketing.",
  },
  {
    ...base("brinbo-sk01-two-modes", "illustration"),
    productId: PRODUCT_ID["brinbo-sk01"] ?? "prod-brinbo-sk01",
    purpose: "BRINBO SK01 \u2014 review figure: slow and fast modes",
    exactModel: "BRINBO SK01",
    type: "educational_diagram",
    checksum: "sha256:9436017f749bb3609e8ded79787d8139da4a4f9afc579ebd6f6781860991849a",
    width: 1500,
    height: 1500,
    src: "/media/reviews/brinbo-sk01/two-modes.webp",
    altText: "BRINBO's marketing panel for two cleaning modes, with a close-up of the skimmer's button panel and the text slow-speed mode on one press and fast-speed mode on two presses.",
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: true,
    notes: "Owner-supplied from the Amazon listing images; any text in the picture is the maker's marketing.",
  },
];

/* Owner artwork sits ahead of the placeholders so a product that has both
   resolves to the artwork; the placeholder stays as the fallback if the
   artwork is ever withdrawn. */
export const MEDIA_ASSETS: MediaAssetRecord[] = [
  ...ORIGINAL_ASSETS,
  ...OWNER_PRODUCT_ARTWORK,
  ...AUGUST_UPLOAD_ASSETS,
  ...CODING_UPLOAD_ASSETS,
  ...AUGUST_11_UPLOAD_ASSETS,
  ...YARBO_UPLOAD_ASSETS,
  ...SOLAR_SKIMMER_UPLOAD_ASSETS,
  ...SOLAR_SKIMMER_NEW_ASSETS,
  ...REVIEW_FIGURE_ASSETS,
  ...PLACEHOLDER_ASSETS,
];


/**
 * Responsive derivatives, generated by scripts/gen-derivatives.mjs.
 *
 * These are not an optimisation detail — they were the reason the pool category
 * page shipped roughly 2.5 MB of images. Every picture was served at its
 * authored size no matter how small it rendered: a 360px product card was
 * downloading a 1200px file. The registry has always been able to build a
 * srcset from this table; it was simply empty.
 *
 * Built by matching each manifest entry back to the asset it came from, so a
 * derivative can never be attached to an asset that does not exist, and a
 * withdrawn asset takes its derivatives out of every srcset with it.
 *
 * The vector placeholders deliberately have none: an SVG serves every width
 * from one file, and raster copies of it would add bytes for no benefit.
 */
interface DerivativeManifestEntry {
  source: string;
  sourceWidth: number;
  sourceHeight: number;
  derivatives: { id: string; src: string; width: number; height: number; checksum: string }[];
}

const DERIVATIVE_MANIFEST = DERIVATIVES_JSON as DerivativeManifestEntry[];

export const DERIVATIVES: import("./types").Derivative[] = DERIVATIVE_MANIFEST.flatMap((entry) => {
  // Every group that can own a raster. Leaving one out does not fail loudly —
  // the derivative files still exist on disk, they just never reach a srcset,
  // and the product silently drops out of responsive-variant readiness.
  const parent = [
    ...ORIGINAL_ASSETS,
    ...OWNER_PRODUCT_ARTWORK,
    ...AUGUST_UPLOAD_ASSETS,
    ...CODING_UPLOAD_ASSETS,
    ...AUGUST_11_UPLOAD_ASSETS,
    ...YARBO_UPLOAD_ASSETS,
    ...SOLAR_SKIMMER_UPLOAD_ASSETS,
    ...SOLAR_SKIMMER_NEW_ASSETS,
    ...REVIEW_FIGURE_ASSETS,
  ].find(
    (a) => a.src === entry.source,
  );
  if (!parent) return [];
  return entry.derivatives.map((d) => ({
    id: d.id,
    parentAssetId: parent.id,
    format: "webp" as const,
    width: d.width,
    height: d.height,
    src: d.src,
    crop: "native" as const,
  }));
});
