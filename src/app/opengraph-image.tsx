import { ImageResponse } from "next/og";
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

export default async function OpenGraphImage() {
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
            "radial-gradient(1000px 500px at 15% -10%, #1c2025 0%, #0e1013 60%, #08090b 100%)",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Accent rule — the single strategic green, used as a marker */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              width: 96,
              height: 5,
              backgroundColor: "#059669",
              marginBottom: 36,
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: 20,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#94a3b8",
              fontWeight: 600,
            }}
          >
            Agricultural Machinery · Custom Engineering
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 76,
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.05,
              letterSpacing: -2,
              marginBottom: 22,
            }}
          >
            {DEFAULT_SITE_CONFIG.businessName}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              color: "#cbd5e1",
              lineHeight: 1.35,
              maxWidth: 900,
            }}
          >
            {DEFAULT_SITE_CONFIG.tagline}
          </div>
        </div>

        {/* Footer band: real location + real contact, nothing invented */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #262b31",
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex", fontSize: 24, color: "#94a3b8" }}>
            Mirzapur, Uttar Pradesh, India
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 24,
              color: "#34d399",
              fontWeight: 700,
            }}
          >
            raew.in
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
