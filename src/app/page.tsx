import Link from "next/link";
import Image from "next/image";
import {
  Wrench,
  ShieldCheck,
  Users,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Zap,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  ChevronRight,
  Tractor,
} from "lucide-react";
import { prisma } from "@/lib/db";
import ProductShowcase from "@/components/products/ProductShowcase";
import ProcessTimeline from "@/components/process/ProcessTimeline";
import AnimatedSection, { StaggerContainer, StaggerItem } from "@/components/AnimatedSection";
import TrustBar from "@/components/TrustBar";
import MachineFinder from "@/components/MachineFinder";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import Hero from "@/components/hero/Hero";
import { isAuthenticImage } from "@/lib/images";
import { toSpecPairs } from "@/lib/safe-json";
import { DEFAULT_SITE_CONFIG } from "@/lib/config";
import { getWhatsAppLink } from "@/lib/whatsapp";

export const revalidate = 60; // ISR 60s

/* Title and description come from the root layout's defaults; only the
   canonical is declared here, because the layout no longer sets one. */
export const metadata = {
  alternates: { canonical: "/" },
};

async function getHomePageData() {
  try {
    const [featuredProducts, categories, allMachines, totalProductCount] =
      await Promise.all([
        prisma.product.findMany({
          where: { active: true, featured: true },
          include: { category: true },
          take: 6,
        }),
        prisma.category.findMany({
          where: { active: true },
          orderBy: { sortOrder: "asc" },
          take: 4,
        }),
        // Name + slug only: this feeds <MachineFinder />, which matches the
        // requested field operation against real product names so it can never
        // link to a product that does not exist.
        prisma.product.findMany({
          where: { active: true },
          select: { name: true, slug: true },
          orderBy: { name: "asc" },
        }),
        prisma.product.count({ where: { active: true } }),
      ]);

    return { featuredProducts, categories, allMachines, totalProductCount };
  } catch (error) {
    console.error("Home page data fetch error:", error);
    return {
      featuredProducts: [],
      categories: [],
      allMachines: [],
      totalProductCount: 0,
    };
  }
}

export default async function HomePage() {
  const { featuredProducts, categories, allMachines, totalProductCount } =
    await getHomePageData();
  const waUrl = getWhatsAppLink();

  const cleanPhone = DEFAULT_SITE_CONFIG.phonePrimary.split("[")[0].trim();
  const cleanEmail = DEFAULT_SITE_CONFIG.emailPrimary.split("[")[0].trim();
  const cleanAddress = DEFAULT_SITE_CONFIG.address.split("[")[0].trim();

  return (
    <div className="pb-12">
      {/* ═══════════════════════════════════════════════════
          1. HERO SECTION
          Extracted to `components/hero/Hero.tsx`. It has to be a client
          component (pointer parallax, magnetic CTAs, scroll-linked
          recession), and keeping it inline would have forced this whole
          page — which is an async server component doing Prisma queries —
          to become one. The rationale for the composition itself is
          documented in that file.

          The build-characteristics list that used to close the hero moved
          to the spec strip below, so the hero stays a single clear
          statement rather than a statement plus a table.
         ═══════════════════════════════════════════════════ */}
      <Hero />

      {/* ═══════════════════════════════════════════════════
          1b. SPEC STRIP
          The three build characteristics from the old hero. Facts
          unchanged — construction details, not performance figures.
         ═══════════════════════════════════════════════════ */}
      <section
        aria-label="How the machines are built"
        className="cinema border-b border-[var(--cinema-edge)] bg-[var(--cinema-stage)]"
      >
        <div className="shell">
          <dl className="grid grid-cols-1 divide-y divide-[var(--cinema-edge)] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {[
              { k: "Wear parts", v: "Heat-treated boron steel" },
              { k: "Transmission", v: "Heavy-duty gearboxes" },
              { k: "Build", v: "Made to your specification" },
            ].map((spec, i) => (
              <div key={spec.k} className={i === 0 ? "py-7 sm:pr-8" : "py-7 sm:px-8"}>
                <dt className="spec-label">{spec.k}</dt>
                <dd className="mt-2 flex items-start gap-2 text-sm font-semibold text-[var(--text-inverse)]">
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-on-dark)]"
                    aria-hidden="true"
                  />
                  {spec.v}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          2. TRUST STRIP
          TrustBar was imported here but never rendered, so it has
          never appeared on the site. Wired in below the hero.
         ═══════════════════════════════════════════════════ */}
      <TrustBar />

      {/* ═══════════════════════════════════════════════════
          3. BUILT AROUND ENGINEERING (about)
         ═══════════════════════════════════════════════════ */}
      <section aria-labelledby="about-heading" className="shell py-20 md:py-28">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <AnimatedSection variant="fadeUp" className="lg:col-span-6">
            <p className="eyebrow text-[var(--accent)]">
              About {DEFAULT_SITE_CONFIG.businessName}
            </p>

            <h2
              id="about-heading"
              className="mt-4 text-display-2 font-bold text-[var(--text)]"
            >
              Built Around Engineering.
            </h2>

            <p className="mt-5 text-[15px] leading-relaxed text-[var(--text-muted)]">
              {DEFAULT_SITE_CONFIG.businessName} is a GST-registered manufacturer based in
              Mirzapur, Uttar Pradesh, building farm machinery and heavy engineering
              equipment to order. Machines are fabricated on structural steel channel
              chassis, with heat-treated wear components and gear transmissions selected
              for the load they will actually see.
            </p>

            <p className="mt-4 text-[15px] leading-relaxed text-[var(--text-muted)]">
              We are not a reseller. The people who quote your machine are the people who
              fabricate it, which is why specifications get confirmed in writing before
              anything is cut.
            </p>

            <dl className="mt-8 grid grid-cols-1 gap-px border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2">
              {[
                {
                  icon: ShieldCheck,
                  t: "Structural steel construction",
                  d: "ISMC channel chassis and heavy plate where the load goes.",
                },
                {
                  icon: Cpu,
                  t: "Gear transmissions",
                  d: "Multi-speed gearboxes sized to your tractor's PTO output.",
                },
                {
                  icon: Wrench,
                  t: "Custom fabrication",
                  d: "Working width, hitch and capacity altered to your requirement.",
                },
                {
                  icon: Users,
                  t: "Direct factory contact",
                  d: `Enquiries answered ${DEFAULT_SITE_CONFIG.businessHours}.`,
                },
              ].map((item) => (
                <div key={item.t} className="bg-[var(--surface)] p-5">
                  <dt className="flex items-center gap-2.5 text-sm font-bold text-[var(--text)]">
                    <item.icon
                      className="h-4 w-4 shrink-0 text-[var(--accent)]"
                      aria-hidden="true"
                    />
                    {item.t}
                  </dt>
                  <dd className="mt-1.5 text-xs leading-relaxed text-[var(--text-muted)]">
                    {item.d}
                  </dd>
                </div>
              ))}
            </dl>

            <Link
              href="/about"
              className="group mt-8 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--text)] underline decoration-[var(--accent)] decoration-2 underline-offset-4 transition-colors hover:text-[var(--accent)]"
            >
              Read the full company background
              <ChevronRight
                className="h-4 w-4 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </AnimatedSection>

          <AnimatedSection variant="fadeUp" delay={0.1} className="lg:col-span-6">
            {/*
              This slot held an Unsplash photograph of an unrelated fabrication
              workshop, captioned "Manufacturing Standards — Rigorous multi-point
              quality inspections conducted on every piece of equipment prior to
              delivery." Neither the plant nor the inspection process was RAEW's.
              Until the owner supplies real factory photography it shows an honest
              placeholder instead of another company's shop floor.
            */}
            <ImagePlaceholder
              label="Fabrication bay — Mirzapur works"
              hint="Add a real photograph at /public/images/company/"
              className="aspect-4/3 w-full"
            />
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          4. PRODUCT CATEGORIES
          This section and the showcase below it are deliberately ONE dark
          act rather than two adjacent dark sections. The narrative runs
          "here are the four lines of work" → "here are the machines", and
          the tone descends with it: this panel sits on --cinema-riser
          (#111413), its plates are cut down to --cinema-void (#070707),
          and the showcase's own top gradient carries #0b0d0c into #070707.
          Two darks that step downward read as depth; two unrelated darks
          of the same value read as a mistake.
         ═══════════════════════════════════════════════════ */}
      <section
        aria-labelledby="categories-heading"
        className="cinema relative overflow-x-clip bg-[var(--cinema-riser)] py-20 md:py-28"
      >
        <div
          className="blueprint-grid-dark pointer-events-none absolute inset-0 opacity-60"
          aria-hidden="true"
        />
        <div className="shell relative">
          <AnimatedSection variant="fadeUp">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <p className="eyebrow text-[var(--accent-on-dark)]">What we build</p>
                <h2
                  id="categories-heading"
                  className="mt-4 text-display-2 font-bold text-[var(--text-inverse)]"
                >
                  Four lines of work.
                </h2>
              </div>
              <Link
                href="/categories"
                data-cursor="Browse"
                className="inline-flex shrink-0 items-center gap-1.5 border border-[rgb(255_255_255/0.22)] px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] text-[var(--text-inverse)] transition-colors duration-200 hover:border-[var(--accent-on-dark)] hover:text-[var(--accent-on-dark)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-inverse)]"
              >
                All categories
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </AnimatedSection>

          <StaggerContainer
            className="mt-12 grid grid-cols-1 gap-px bg-[var(--cinema-edge)] sm:grid-cols-2 lg:grid-cols-4"
            staggerDelay={0.08}
          >
            {categories.map((cat, index) => (
              <StaggerItem key={cat.id}>
                <Link
                  href={`/products?category=${encodeURIComponent(cat.slug)}`}
                  data-cursor="Browse"
                  /* Plates are cut to the darkest value in the ramp and lift
                     one step on hover. Hovering something to make it *lighter*
                     than its surround is the only direction that reads as
                     "picked up" rather than "pressed in". */
                  className="group relative flex h-full min-h-72 flex-col justify-end overflow-hidden bg-[var(--cinema-void)] p-6 transition-colors duration-300 hover:bg-[var(--cinema-stage)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--focus-inverse)]"
                >
                  {isAuthenticImage(cat.image) ? (
                    <>
                      <Image
                        src={cat.image as string}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover opacity-30 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:scale-[1.05]"
                      />
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/60 to-transparent"
                        aria-hidden="true"
                      />
                    </>
                  ) : (
                    /* No authentic category photograph: fall back to the
                       drawing-grid texture rather than a stock image of
                       somebody else's machinery. See lib/images.ts. */
                    <div className="blueprint-grid-dark absolute inset-0" aria-hidden="true" />
                  )}

                  {/* Plate number, drafting convention. It is an index into
                      this list and nothing more — it makes no claim about
                      catalogue size or sequence. */}
                  <span
                    aria-hidden="true"
                    className="absolute left-6 top-6 font-mono text-[11px] tabular-nums tracking-[0.18em] text-[var(--text-subtle)]"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="relative">
                    <h3 className="text-lg font-bold tracking-tight text-[var(--text-inverse)] transition-colors duration-200 group-hover:text-[var(--accent-on-dark)]">
                      {cat.name}
                    </h3>
                    {cat.description && (
                      <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[var(--text-inverse-muted)]">
                        {cat.description}
                      </p>
                    )}
                    {/* The rule grows from nothing to full width on hover.
                        It replaces a nudged arrow as the primary cue because
                        a drawn line is the visual language of the rest of
                        this page — and it costs one scaleX. */}
                    <span className="mt-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-[var(--accent-on-dark)]">
                      Browse machinery
                      <span
                        aria-hidden="true"
                        className="h-px w-6 origin-left scale-x-0 bg-[var(--accent-on-dark)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:scale-x-100"
                      />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          5. MACHINERY SHOWCASE
          Was a three-column grid of six ProductCards, which is the exact
          "section, whitespace, card grid" rhythm the brief rules out — and
          it presented the company's own machines at 380px wide, smaller
          than the hero's decorative artwork.

          It is now a pinned, scroll-driven stage on desktop and a
          horizontal snap strip on mobile. `ProductCard` itself is not
          gone: the /products catalogue is where a grid is the right
          answer, because there the reader is comparing, not being shown.

          The spec pairs are read here, on the server, so the raw JSON
          string never reaches the browser and the client stage has no
          chance to fabricate a value for a key it does not have.

          Four pairs is the cap because that is what fits the desktop
          stage's height floor; the mobile card shows the first three.
          Nothing is padded when a product records fewer.
         ═══════════════════════════════════════════════════ */}
      <ProductShowcase
        items={featuredProducts.map((product) => ({
          id: product.id,
          name: product.name,
          slug: product.slug,
          categoryName: product.category.name,
          shortDescription: product.shortDescription,
          image: product.image,
          specs: toSpecPairs(product.specifications, 4),
        }))}
        totalProductCount={totalProductCount}
      />

      {/* ═══════════════════════════════════════════════════
          5b. MACHINE FINDER
          Split out of the showcase when that section went dark. It is a
          light-surface form, and it is a different job from the showcase:
          the showcase presents, this one routes a visitor who already
          knows the field operation they need.

          MachineFinder had been imported into this file since it was
          written but was never rendered, so its eight hardcoded product
          links — every one of them a 404 — were never exercised. It now
          receives the live product list.
         ═══════════════════════════════════════════════════ */}
      {allMachines.length > 0 && (
        <section aria-label="Find the right machine" className="shell py-20 md:py-24">
          <AnimatedSection variant="fadeUp">
            <MachineFinder machines={allMachines} />
          </AnimatedSection>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════
          6. ENGINEERED WITH PURPOSE (bento)
          Was six cells at 4-2-2-2-2 — nominally a bento, actually a grid
          of near-identical boxes, because a 4-wide and a 2-wide cell of
          the same height read as one row of equal cards. This version
          varies both axes: a 4×2 feature plate, two 2×1 cells beside it,
          and two 3×1 cells beneath. Different footprints mean different
          amounts of copy fit, which is the point — the layout now encodes
          which capability matters most instead of implying they are equal.

          It is also LIGHT. The showcase above and the process below are
          the page's dark acts; making this dark too would have given four
          dark sections in the back half and turned the contrast into
          wallpaper. The drama here comes from the single inverted feature
          plate inside a light grid, not from another black section.
         ═══════════════════════════════════════════════════ */}
      <section
        aria-labelledby="capabilities-heading"
        className="border-y border-[var(--border)] bg-[var(--surface-2)] py-20 md:py-28"
      >
        <div className="shell">
          <AnimatedSection variant="fadeUp">
            <div className="max-w-2xl">
              <p className="eyebrow text-[var(--accent)]">Capabilities</p>
              {/* Sentence case, not the brief's all-caps, for one reason:
                  the other four h2s on this page are sentence case, and an
                  all-caps display-2 in Space Grotesk Bold at -0.025em also
                  overflows a 288px content box at 320px. */}
              <h2
                id="capabilities-heading"
                className="mt-4 text-display-2 font-bold text-[var(--text)]"
              >
                Engineered with purpose.
              </h2>
              <p className="mt-5 text-[15px] leading-relaxed text-[var(--text-muted)]">
                Machines are specified around durability and low field downtime, because a
                machine that stops in the middle of a season costs more than it saved.
              </p>
            </div>
          </AnimatedSection>

          <StaggerContainer
            className="mt-12 grid grid-cols-1 gap-px border border-[var(--border)] bg-[var(--border)] md:grid-cols-6"
            staggerDelay={0.06}
          >
            {/* ── Feature plate, 4 × 2 ──
                The one inverted cell on the page's light half. `.cinema`
                rebinds the token layer for this subtree, so the copy inside
                is written against --text / --text-muted exactly as the light
                cells are and still resolves correctly. */}
            <StaggerItem className="md:col-span-4 md:row-span-2">
              <div className="cinema relative flex h-full flex-col justify-between gap-10 overflow-hidden bg-[var(--cinema-void)] p-8 sm:p-10">
                <div
                  className="blueprint-grid-dark pointer-events-none absolute inset-0 opacity-50"
                  aria-hidden="true"
                />
                {/* A radial `blur-[110px]` accent glow used to sit in this
                    corner. Removed: it is the "generic gradient blob /
                    random glowing circle" pattern, and on a plate that is
                    already carrying a blueprint grid it was doing nothing
                    the grid was not doing better. */}
                <div className="relative flex items-center gap-3">
                  {/* The only lime on the site. --accent-highlight (#a3e635)
                      is reserved for exactly this: one mark, in the one cell
                      that is meant to be looked at first. Spending it twice
                      would make it a brand colour, and this is not a lime
                      brand. */}
                  <span
                    aria-hidden="true"
                    className="h-px w-10 bg-[var(--accent-highlight)]"
                  />
                  <p className="spec-label text-[var(--accent-highlight)]">Material</p>
                </div>

                <div className="relative">
                  <Wrench
                    className="h-7 w-7 text-[var(--accent-on-dark)]"
                    aria-hidden="true"
                  />
                  <h3 className="mt-6 max-w-lg text-2xl font-bold leading-tight tracking-tight text-[var(--text-inverse)] sm:text-3xl">
                    Heat-treated boron steel where it wears
                  </h3>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--text-inverse-muted)]">
                    Rotary tiller blades, harrow plates and land-leveler edges are the parts
                    that meet the soil, so they are made from heat-treated boron steel for
                    abrasion resistance. Everything behind them is built on structural steel
                    channel chassis.
                  </p>
                </div>
              </div>
            </StaggerItem>

            {/* ── Two narrow cells, 2 × 1, stacked beside the plate ── */}
            <StaggerItem className="md:col-span-2">
              <div className="group relative flex h-full flex-col overflow-hidden bg-[var(--surface)] p-7">
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-[var(--accent)] transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:scale-x-100"
                />
                <Zap className="h-5 w-5 text-[var(--accent)]" aria-hidden="true" />
                <h3 className="mt-5 text-base font-bold tracking-tight text-[var(--text)]">
                  Efficient power transfer
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                  Multi-speed gearboxes specified to minimise loss between the tractor PTO
                  and the implement.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem className="md:col-span-2">
              <div className="group relative flex h-full flex-col overflow-hidden bg-[var(--surface)] p-7">
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-[var(--accent)] transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:scale-x-100"
                />
                <Tractor className="h-5 w-5 text-[var(--accent)]" aria-hidden="true" />
                <h3 className="mt-5 text-base font-bold tracking-tight text-[var(--text)]">
                  Built to your specification
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                  Chassis dimensions, working width, trailer tonnage and attachments
                  fabricated to the requirement you give us.
                </p>
              </div>
            </StaggerItem>

            {/* ── Two wide cells, 3 × 1, across the bottom.
                Wider than they are tall, so the icon sits inline with the
                heading rather than above it — a different reading rhythm
                from the cells above, which is what stops five cells with
                the same internal layout from reading as five cards. ── */}
            <StaggerItem className="md:col-span-3">
              <div className="group relative flex h-full flex-col overflow-hidden bg-[var(--surface)] p-7">
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-[var(--accent)] transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:scale-x-100"
                />
                <h3 className="flex items-center gap-2.5 text-base font-bold tracking-tight text-[var(--text)]">
                  <Cpu className="h-5 w-5 shrink-0 text-[var(--accent)]" aria-hidden="true" />
                  Inspected before dispatch
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--text-muted)]">
                  Machines are checked at the works before they leave, and the final figures
                  go on your quotation.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem className="md:col-span-3">
              <div className="group relative flex h-full flex-col overflow-hidden bg-[var(--surface)] p-7">
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-[var(--accent)] transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:scale-x-100"
                />
                <h3 className="flex items-center gap-2.5 text-base font-bold tracking-tight text-[var(--text)]">
                  <ShieldCheck
                    className="h-5 w-5 shrink-0 text-[var(--accent)]"
                    aria-hidden="true"
                  />
                  Priced direct by the factory
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--text-muted)]">
                  You deal with the works, not a dealer chain. The people quoting the machine
                  are the ones fabricating it.
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          7. INDUSTRIES & APPLICATIONS SERVED
         ═══════════════════════════════════════════════════ */}
      <section
        id="industries"
        aria-labelledby="industries-heading"
        className="shell scroll-mt-28 py-20 md:py-28"
      >
        <AnimatedSection variant="fadeUp">
          <div className="max-w-2xl">
            <p className="eyebrow text-[var(--accent)]">Industries</p>
            <h2
              id="industries-heading"
              className="mt-4 text-display-2 font-bold text-[var(--text)]"
            >
              Where these machines work.
            </h2>
          </div>
        </AnimatedSection>

        <StaggerContainer
          className="mt-12 grid grid-cols-2 gap-px bg-[var(--border)] sm:grid-cols-3 lg:grid-cols-6"
          staggerDelay={0.06}
        >
          {[
            { title: "Paddy & Wheat", desc: "Seedbed preparation and threshing" },
            { title: "Sugarcane", desc: "Heavy stubble tillage" },
            { title: "Land Levelling", desc: "Laser grade systems" },
            { title: "Commercial Haulage", desc: "Hydraulic tipping" },
            { title: "Custom Fabrication", desc: "Industrial chassis work" },
            { title: "Custom Contracting", desc: "High-output machines" },
          ].map((app) => (
            <StaggerItem key={app.title}>
              <div className="h-full bg-[var(--surface)] p-5 transition-colors duration-200 hover:bg-[var(--surface-2)]">
                <h3 className="text-sm font-bold tracking-tight text-[var(--text)]">
                  {app.title}
                </h3>
                <p className="mt-1.5 text-[11px] leading-relaxed text-[var(--text-muted)]">
                  {app.desc}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* ═══════════════════════════════════════════════════
          8. HOW AN ORDER IS BUILT (5-step process)
          Was five equal bordered boxes in a row, which reads as five
          options rather than five stages. It is now a drawn timeline —
          horizontal on desktop, vertical on mobile — with the line filling
          as the section crosses the viewport. See ProcessTimeline for why
          the fill costs no React renders.

          This section carries the dark treatment now. It sits between two
          light sections, which is what keeps the page from alternating so
          regularly that the rhythm becomes its own pattern.
         ═══════════════════════════════════════════════════ */}
      <section
        aria-labelledby="process-heading"
        className="cinema relative overflow-x-clip border-t border-[var(--cinema-edge)] py-20 md:py-28"
      >
        <div
          className="blueprint-grid-dark pointer-events-none absolute inset-0 opacity-40"
          aria-hidden="true"
        />
        <div className="shell relative">
          <AnimatedSection variant="fadeUp">
            <div className="max-w-2xl">
              <p className="eyebrow text-[var(--accent-on-dark)]">Process</p>
              <h2
                id="process-heading"
                className="mt-4 text-display-2 font-bold text-[var(--text-inverse)]"
              >
                How an order gets built.
              </h2>
              <p className="mt-5 text-[15px] leading-relaxed text-[var(--text-inverse-muted)]">
                Five steps, in this order, every time. Nothing is cut before the
                specification is agreed in writing.
              </p>
            </div>
          </AnimatedSection>

          <ProcessTimeline />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          9. LET'S BUILD WHAT'S NEXT (closing CTA)
          Was a bordered dark panel floating inside a light section — the
          "promotional banner dropped into a page" pattern. It is now
          full-bleed and tonally continuous with the process section above
          it: no rule between them, just a step from #070707 up to #0b0d0c.
          Process → enquiry is one closing act, so it should look like one.

          The headline runs at text-display-1, one step above every section
          h2 and one below the hero's mega. That is the whole hierarchy:
          the page opens with a statement, closes with a statement, and
          everything between is a section heading.
         ═══════════════════════════════════════════════════ */}
      <section
        aria-labelledby="cta-heading"
        className="cinema relative overflow-x-clip bg-[var(--cinema-stage)] py-24 md:py-32"
      >
        <div
          className="blueprint-grid-dark pointer-events-none absolute inset-0 opacity-30"
          aria-hidden="true"
        />
        {/* A 860×380 radial `blur-[140px]` glow used to sit across the top of
            this section. Removed for the same reason as its twin in the bento
            plate: a soft coloured bloom behind a headline is the single most
            recognisable "generated landing page" tell, and the tonal step from
            the section above already does the work of separating the two. */}
        <div className="shell relative">
          {/* Full-width hairline that dissolves at both ends rather than
              butting into the gutter. `mask-fade-x` exists for exactly this. */}
          <div
            aria-hidden="true"
            className="mask-fade-x h-px w-full bg-[rgb(255_255_255/0.22)]"
          />

          <AnimatedSection variant="fadeUp">
            <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-7">
                <p className="eyebrow text-[var(--accent-on-dark)]">Enquiries</p>
                <h2
                  id="cta-heading"
                  className="mt-5 text-display-1 font-bold text-[var(--text-inverse)]"
                >
                  Let&apos;s build what&apos;s next.
                </h2>
                <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-[var(--text-inverse-muted)]">
                  Send us the operation, your tractor horsepower and the working width. We
                  will confirm what fits, what it costs and how long it takes to build.
                </p>

                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/quote"
                    data-cursor="Quote"
                    className="inline-flex items-center justify-center gap-2 bg-[var(--accent)] px-8 py-4 text-sm font-bold uppercase tracking-[0.08em] text-[var(--accent-fg)] transition-colors duration-200 hover:bg-[var(--accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-inverse)]"
                  >
                    Request a quotation
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 border border-[rgb(255_255_255/0.22)] px-8 py-4 text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-inverse)] transition-colors duration-200 hover:border-[var(--accent-on-dark)] hover:text-[var(--accent-on-dark)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-inverse)]"
                  >
                    <MessageSquare className="h-4 w-4" aria-hidden="true" />
                    <span>
                      WhatsApp
                      <span className="sr-only"> the works (opens in a new tab)</span>
                    </span>
                  </a>
                </div>
              </div>

              {/* Direct lines, on the drawing-sheet pattern: label above
                  value, hairline between rows. A visitor who would rather
                  phone than fill in a form should not have to scroll past
                  the form to find the number. */}
              <dl className="lg:col-span-5 lg:border-l lg:border-[var(--cinema-edge)] lg:pl-12">
                <div className="border-t border-[var(--cinema-edge)] py-5">
                  <dt className="spec-label">Telephone</dt>
                  <dd className="mt-2">
                    <a
                      href={`tel:${cleanPhone.replace(/[^\d+]/g, "")}`}
                      className="text-lg font-bold tracking-tight text-[var(--text-inverse)] underline-offset-4 transition-colors duration-200 hover:text-[var(--accent-on-dark)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-inverse)]"
                    >
                      {cleanPhone}
                    </a>
                  </dd>
                </div>
                <div className="border-t border-[var(--cinema-edge)] py-5">
                  <dt className="spec-label">Email</dt>
                  <dd className="mt-2">
                    <a
                      href={`mailto:${cleanEmail}`}
                      className="break-all text-sm font-bold text-[var(--text-inverse)] underline-offset-4 transition-colors duration-200 hover:text-[var(--accent-on-dark)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-inverse)]"
                    >
                      {cleanEmail}
                    </a>
                  </dd>
                </div>
                <div className="border-y border-[var(--cinema-edge)] py-5">
                  <dt className="spec-label">Enquiries answered</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-[var(--text-inverse-muted)]">
                    {DEFAULT_SITE_CONFIG.businessHours}
                  </dd>
                </div>
              </dl>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          10. LOCATION & CONTACT PREVIEW
          No top border: it used to sit below a light section, where a
          hairline marked the change. It now follows the dark closing act,
          where a #e2e8f0 rule against #0b0d0c would read as a bright seam
          nobody asked for. The tonal jump is the boundary.

          This is deliberately the quietest section on the page — an h2 at
          text-xl, below every other section heading. It is wayfinding, not
          an argument, and the map is the content.
         ═══════════════════════════════════════════════════ */}
      <section
        aria-labelledby="location-heading"
        className="bg-[var(--surface-2)] py-20"
      >
        <div className="shell">
        <AnimatedSection variant="fadeUp">
            <div className="grid grid-cols-1 gap-px bg-[var(--border)] lg:grid-cols-3">
              <div className="bg-[var(--surface)] p-8">
                <p className="eyebrow text-[var(--accent)]">Visit the works</p>
                <h2
                  id="location-heading"
                  className="mt-3 text-xl font-bold leading-tight tracking-tight text-[var(--text)]"
                >
                  M/s Raj Agro Engineering Works
                </h2>

                <dl className="mt-6 space-y-4 text-xs leading-relaxed">
                  <div className="flex items-start gap-3">
                    <dt className="mt-0.5 shrink-0">
                      <span className="sr-only">Address</span>
                      <MapPin
                        className="h-4 w-4 text-[var(--accent)]"
                        aria-hidden="true"
                      />
                    </dt>
                    <dd className="text-[var(--text-muted)]">{cleanAddress}</dd>
                  </div>
                  <div className="flex items-start gap-3">
                    <dt className="mt-0.5 shrink-0">
                      <span className="sr-only">Telephone</span>
                      <Phone
                        className="h-4 w-4 text-[var(--accent)]"
                        aria-hidden="true"
                      />
                    </dt>
                    <dd>
                      <a
                        href={`tel:${cleanPhone.replace(/[^\d+]/g, "")}`}
                        className="font-semibold text-[var(--text-muted)] underline-offset-4 transition-colors hover:text-[var(--accent)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
                      >
                        {cleanPhone}
                      </a>
                    </dd>
                  </div>
                  <div className="flex items-start gap-3">
                    <dt className="mt-0.5 shrink-0">
                      <span className="sr-only">Email</span>
                      <Mail
                        className="h-4 w-4 text-[var(--accent)]"
                        aria-hidden="true"
                      />
                    </dt>
                    <dd>
                      <a
                        href={`mailto:${cleanEmail}`}
                        className="break-all font-semibold text-[var(--text-muted)] underline-offset-4 transition-colors hover:text-[var(--accent)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
                      >
                        {cleanEmail}
                      </a>
                    </dd>
                  </div>
                </dl>

                <Link
                  href="/contact"
                  className="group mt-7 inline-flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
                >
                  Full contact details and map
                  <ChevronRight
                    className="h-4 w-4 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </div>

              <div className="relative min-h-[280px] bg-[var(--surface)] lg:col-span-2">
                <iframe
                  title="Map showing the location of M/s Raj Agro Engineering Works, Mirzapur, Uttar Pradesh"
                  src="https://www.google.com/maps?q=Madawa+Newada%2C+Post-Rehi%2C+Mirzapur%2C+Uttar+Pradesh%2C+India+231211&output=embed"
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
        </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
