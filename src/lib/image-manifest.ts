export type ImageType = "REAL_COMPANY_PHOTO" | "AI_GENERATED_CONCEPT" | "STOCK_LICENSED" | "USER_UPLOADED";

export interface ImageBrief {
  key: string;
  placement: string;
  ratio: string;
  imageType: ImageType;
  source: string;
  alt: string;
  prompt: string;
}

/**
 * Central visual inventory. The source can be replaced by an admin-managed URL
 * without changing page composition. Prompts are retained so a future image
 * generation pass stays consistent across the campaign.
 */
export const imageManifest: ImageBrief[] = [
  {
    key: "home.hero",
    placement: "Full-bleed homepage hero",
    ratio: "21:9 desktop, 9:16 mobile",
    imageType: "STOCK_LICENSED",
    source: "/visuals/hero.jpg",
    alt: "Agricultural field and working machinery",
    prompt: "Photorealistic premium industrial commercial photograph of a heavy-duty agricultural implement constructed from realistic fabricated steel in an Indian agricultural field at golden hour, three-quarter front camera angle, warm natural reflections on metal, realistic soil and crops, machine occupying the right half with clean negative space on the left for website typography, cinematic depth of field, natural shadows, no text, no logos, no watermark, ultrawide 21:9.",
  },
  {
    key: "home.workshop",
    placement: "Full-width manufacturing section",
    ratio: "21:9",
    imageType: "STOCK_LICENSED",
    source: "/visuals/workshop.jpg",
    alt: "Industrial metal fabrication workshop",
    prompt: "Photorealistic premium industrial photograph inside a believable Indian agricultural equipment fabrication workshop, steel implement component in the foreground, welding and assembly activity in the middle ground, practical workshop benches and machinery behind, natural roof light with subtle cinematic green and steel color grade, no futuristic factory, no text, no logos, no watermark, 21:9.",
  },
  {
    key: "home.application",
    placement: "Agricultural application feature",
    ratio: "4:3",
    imageType: "STOCK_LICENSED",
    source: "/visuals/field.jpg",
    alt: "Agricultural field prepared for crop planting",
    prompt: "Photorealistic commercial agriculture photograph of a heavy agricultural implement naturally working Indian farmland, realistic dark soil, modest crop rows, warm overcast daylight, believable machine scale and tire tracks, natural shadows and dust, premium but documentary industrial photography, no logos, no text, no watermark, 4:3.",
  },
  {
    key: "product.rotavator",
    placement: "Rotavator catalogue and detail image",
    ratio: "4:3",
    imageType: "STOCK_LICENSED",
    source: "/visuals/machine.jpg",
    alt: "Agricultural machinery in a field",
    prompt: "Photorealistic conceptual product visualization of a generic heavy-duty multi-speed agricultural rotavator, realistic fabricated steel housing and rotary blades, three-quarter product angle in a prepared Indian field, clean natural daylight, neutral green and steel palette, clearly conceptual and without brand marks, text, specifications or watermark, 4:3.",
  },
];

export function getImageBrief(key: string) {
  return imageManifest.find((brief) => brief.key === key);
}
