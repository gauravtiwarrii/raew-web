import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { DEFAULT_SITE_CONFIG } from "@/lib/config";

/* Generates the Open Graph / Twitter card at build time. Next.js wires
   this into `openGraph.images` and `twitter.images` automatically, which
   closes the missing-social-image gap without shipping stock photography
   or inventing imagery of a facility we have no photographs of.

   Rendered via Satori, which supports only a flexbox subset of CSS —
   avoid grid, background-size tiling and external font fetches here. */

export const alt =
  "M/s Raj Agro Engineering Works — agricultural machinery and custom engineering, Mirzapur, Uttar Pradesh";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* The artwork is inlined as a data URI rather than referenced by URL.
   Satori resolves remote and root-relative sources by fetching them, and
   at build time there is no origin to fetch from — a self-referential
   URL to this same app fails the build. Reading the file and handing
   Satori the bytes takes the network out of the path.

   Wrapped in try/catch deliberately: if the artwork is ever moved, or
   this route is rendered where `public/` is not on disk, the card must
   still render. A card without a mark is a smaller failure than no card. */
async function loadLockup(): Promise<string | null> {
  try {
    const file = await readFile(
      path.join(process.cwd(), "public", "branding", "raew-logo-inverse.png")
    );
    return `data:image/png;base64,${file.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function OpenGraphImage() {
  const lockup = await loadLockup();
  // Checked inline rather than through `isPlaceholderValue`: that helper lives
  // in lib/site-settings.ts, which imports the Prisma client, and dragging a
  // database module into an image route to test one string is not a trade
  // worth making.
  const gstinValue = DEFAULT_SITE_CONFIG.gstin || "";
  const gstin = gstinValue.includes("[REPLACE") ? null : gstinValue;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0e1013",
          backgroundImage:
            "radial-gradient(1000px 500px at 15% -10%, #1f2b25 0%, #0e1013 60%, #08090b 100%)",
          padding: "64px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Masthead: the stacked lockup, which carries the mark, the wordmark,
            the company name and the tagline. Placing the real identity here
            means the card is instantly recognisable next to a competitor's on
            the same feed, which is the entire job of a social card. */}
        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          {lockup ? (
            <img src={lockup} alt="" width={132} height={113} />
          ) : (
            <div
              style={{ display: "flex", width: 96, height: 5, backgroundColor: "#70db99" }}
            />
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 19,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#94a3b8",
              fontWeight: 600,
            }}
          >
            <div style={{ display: "flex" }}>Agricultural Machinery</div>
            <div style={{ display: "flex", color: "#70db99", marginTop: 6 }}>
              Custom Engineering
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 72,
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.05,
              letterSpacing: -2,
              marginBottom: 20,
            }}
          >
            Precision farm machinery, built to order
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: "#cbd5e1",
              lineHeight: 1.35,
              maxWidth: 900,
            }}
          >
            {DEFAULT_SITE_CONFIG.brandTagline}
          </div>
        </div>

        {/* Footer band: real location, real registration, real domain —
            nothing invented. GSTIN is dropped when the setting still holds
            its placeholder, so a template value can never reach a card. */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #262b31",
            paddingTop: 26,
            fontSize: 22,
            color: "#94a3b8",
          }}
        >
          <div style={{ display: "flex" }}>Mirzapur, Uttar Pradesh, India</div>
          {gstin && <div style={{ display: "flex" }}>GSTIN {gstin}</div>}
          <div style={{ display: "flex", color: "#70db99", fontWeight: 700 }}>raew.in</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
