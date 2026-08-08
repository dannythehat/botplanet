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
      ["dgm-pool-zones", "components/PoolDiagram.astro", "Pool cross-section showing floor, wall, waterline and water-surface cleaning zones"],
      ["dgm-coverage", "components/diagrams/CoverageZones.astro", "Pool cross-section highlighting floor, wall and waterline cleaning zones"],
      ["dgm-corded-cordless", "components/diagrams/CordedVsCordless.astro", "Diagram comparing corded and cordless robotic pool cleaners"],
      ["dgm-size-shape", "components/diagrams/PoolSizeShape.astro", "Diagram showing how pool size and shape affect robot suitability"],
      ["dgm-botmatch", "components/diagrams/BotMatchExplainer.astro", "Diagram of how BotMatch produces a deterministic suitability result"],
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

/* Owner artwork sits ahead of the placeholders so a product that has both
   resolves to the artwork; the placeholder stays as the fallback if the
   artwork is ever withdrawn. */
export const MEDIA_ASSETS: MediaAssetRecord[] = [
  ...ORIGINAL_ASSETS,
  ...OWNER_PRODUCT_ARTWORK,
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
  const parent = [...ORIGINAL_ASSETS, ...OWNER_PRODUCT_ARTWORK, ...REVIEW_FIGURE_ASSETS].find(
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
