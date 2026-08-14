import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed for M/s Raj Agro Engineering Works...");

  // 1. Create Default Admin User
  const passwordHash = await bcrypt.hash("Admin@RajAgro2026!", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@rajagro.com" },
    update: {},
    create: {
      email: "admin@rajagro.com",
      name: "Raj Agro Administrator",
      passwordHash: passwordHash,
      role: "ADMIN",
    },
  });
  console.log(`✅ Admin user initialized: ${admin.email}`);

  // 2. Default Site Settings
  const settings = [
    { key: "BUSINESS_NAME", value: "M/s Raj Agro Engineering Works", group: "GENERAL" },
    { key: "TAGLINE", value: "Precision Agricultural Machinery & Custom Engineering Solutions", group: "GENERAL" },
    { key: "PHONE_PRIMARY", value: "9794427644", group: "CONTACT" },
    { key: "PHONE_SECONDARY", value: "[REPLACE WITH SECONDARY PHONE]", group: "CONTACT" },
    { key: "WHATSAPP_NUMBER", value: "919794427644", group: "CONTACT" },
    { key: "EMAIL_PRIMARY", value: "info@raew.in", group: "CONTACT" },
    { key: "EMAIL_SALES", value: "[REPLACE WITH SALES EMAIL]", group: "CONTACT" },
    {
      key: "ADDRESS",
      value: "Madawa Newada, Post- Rehi, Mirzapur, Uttar Pradesh, India - 231211",
      group: "CONTACT",
    },
    { key: "GSTIN", value: "09BAZPT1519D1Z8", group: "CONTACT" },
    { key: "GOOGLE_MAPS_URL", value: "[REPLACE WITH GOOGLE MAPS EMBED URL]", group: "CONTACT" },
    { key: "BUSINESS_HOURS", value: "[REPLACE WITH BUSINESS HOURS]", group: "BUSINESS" },
    { key: "ESTABLISHED_YEAR", value: "[REPLACE WITH ESTABLISHED YEAR OR LEAVE BLANK]", group: "BUSINESS" },
    { key: "FACEBOOK_URL", value: "[REPLACE WITH FACEBOOK URL]", group: "SOCIAL" },
    { key: "INSTAGRAM_URL", value: "[REPLACE WITH INSTAGRAM URL]", group: "SOCIAL" },
    { key: "YOUTUBE_URL", value: "[REPLACE WITH YOUTUBE URL]", group: "SOCIAL" },
  ];

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value, group: s.group },
      create: s,
    });
  }
  console.log("✅ Site settings seeded successfully.");

  // 3. Create Categories
  const categoriesData = [
    {
      name: "Agricultural Machinery",
      slug: "agricultural-machinery",
      description: "Heavy-duty power machines for soil preparation, harvesting, and crop handling.",
      image: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80",
      sortOrder: 1,
    },
    {
      name: "Farm Implements",
      slug: "farm-implements",
      description: "Tractor-mounted implements engineered for high yield and operational endurance.",
      image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80",
      sortOrder: 2,
    },
    {
      name: "Engineering & Fabrication",
      slug: "engineering-fabrication",
      description: "Custom heavy structural fabrication, laser levelers, and specialized industrial equipment.",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      sortOrder: 3,
    },
    {
      name: "Haulage & Transport",
      slug: "haulage-transport",
      description: "Tipping tractor trailers and agricultural transport chassis built for heavy loads.",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
      sortOrder: 4,
    },
  ];

  const categoriesMap: Record<string, string> = {};

  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { description: cat.description, image: cat.image, sortOrder: cat.sortOrder },
      create: cat,
    });
    categoriesMap[cat.slug] = created.id;
  }
  console.log("✅ Categories seeded.");

  // 4. Create Seed Products
  const productsData = [
    {
      name: "Multi-Speed Heavy Duty Rotavator",
      slug: "multi-speed-heavy-duty-rotavator",
      categoryId: categoriesMap["farm-implements"],
      shortDescription: "High-performance rotary tiller engineered for superior soil seedbed preparation and stubble incorporation.",
      description: "The M/s Raj Agro Multi-Speed Heavy Duty Rotavator is specifically built for challenging soil conditions. Equipped with high-grade boron steel blades, a robust gear drive, and multi-speed gear box options, this machine ensures effortless seedbed preparation in both wet and dry fields. Saves fuel and reduces tractor engine wear.",
      specifications: JSON.stringify({
        "Working Width": "5 ft / 6 ft / 7 ft / 8 ft options",
        "Number of Blades": "36 / 42 / 48 / 54 L & C Type Blades",
        "Tractor Power Required": "40 HP - 75 HP",
        "Gearbox Type": "Multi-Speed Heavy Duty Gearbox",
        "Transmission": "Side Gear Drive (Boron Steel Gears)",
        "Overall Weight": "420 kg - 560 kg",
        "Blade Material": "High Carbon Boron Steel (Long Life)"
      }),
      features: JSON.stringify([
        "Multi-speed gearbox for variable rotor RPM settings",
        "Boron steel heat-treated blades for 3x longer lifespan",
        "Heavy-duty trailing board for smooth seedbed finishing",
        "Viton double oil seals preventing dust entry and oil leakage",
        "Compatible with all standard Category II tractor hitches"
      ]),
      applications: JSON.stringify([
        "Paddy field puddling and tillage",
        "Sugarcane and wheat stubble mulching",
        "Soil aeration and seedbed preparation",
        "Organic matter mixing into deep soil"
      ]),
      image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80",
      galleryImages: JSON.stringify([
        "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
      ]),
      priceDisplay: "Price on Request",
      availability: "In Stock",
      featured: true,
      active: true,
    },
    {
      name: "High-Capacity Multi-Crop Thresher",
      slug: "high-capacity-multi-crop-thresher",
      categoryId: categoriesMap["agricultural-machinery"],
      shortDescription: "Heavy-duty agricultural thresher designed for fast, clean grain separation across wheat, paddy, mustard, and pulses.",
      description: "Engineered for maximum grain output with zero seed damage, the Raj Agro Multi-Crop Thresher handles high-volume post-harvest processing effortlessly. Features an adjustable concave screen, dual high-pressure blower fans, and automatic straw elevation for seamless farm operation.",
      specifications: JSON.stringify({
        "Compatible Crops": "Wheat, Paddy, Mustard, Soybean, Bengal Gram, Maize",
        "Output Capacity": "1200 kg - 2500 kg per hour (crop dependent)",
        "Required Power": "35 HP - 60 HP Tractor PTO / Electric Motor",
        "Blower System": "Dual Balanced High-CFM Blower Fans",
        "Drum Diameter": "30 inches (760 mm)",
        "Chassis Frame": "Heavy Duty Channel Iron Structural Steel Frame"
      }),
      features: JSON.stringify([
        "Zero-grain breakage spike tooth mechanism",
        "Dual blower design ensuring 99.5% grain purity output",
        "Adjustable feed hopper with emergency safety reverse lever",
        "Reinforced heavy-gauge flywheel for smooth power transfer",
        "Heavy pneumatic tires for easy field transport"
      ]),
      applications: JSON.stringify([
        "Wheat and paddy post-harvest threshing",
        "Mustard and soybean grain separation",
        "Commercial grain processing hubs & custom farm contracting"
      ]),
      image: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80",
      galleryImages: JSON.stringify([
        "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80"
      ]),
      priceDisplay: "Price on Request",
      availability: "In Stock",
      featured: true,
      active: true,
    },
    {
      name: "Precision Laser Land Leveler",
      slug: "precision-laser-land-leveler",
      categoryId: categoriesMap["engineering-fabrication"],
      shortDescription: "Advanced laser guided land leveling system designed for precision grade control, saving up to 35% irrigation water.",
      description: "Our Precision Laser Land Leveler is an essential engineering tool for modern water-smart agriculture. Featuring a heavy-duty hardox scraper blade, high-precision laser receiver transmitter system, and hydraulic elevation control, it levels farmlands with millimeter precision.",
      specifications: JSON.stringify({
        "Working Bucket Width": "7 ft / 8 ft / 9 ft options",
        "Laser Control Range": "400 meter radius (800m diameter)",
        "Hydraulic Valve": "High Precision Proportional Oil Control Valve",
        "Required Tractor Power": "50 HP - 90 HP",
        "Scraper Blade": "Hardox High Wear-Resistant Reversible Blade",
        "Mast Assembly": "Hydraulic / Manual Telescopic Mast"
      }),
      features: JSON.stringify([
        "Saves up to 35% irrigation water and improves crop yield uniformity",
        "Reduces weeding costs and optimizes fertilizer distribution",
        "Heavy-duty reinforced bucket chassis built to resist flexing",
        "Weatherproof IP67 rated laser receiver and transmitter",
        "User-friendly digital control box mounted inside tractor cabin"
      ]),
      applications: JSON.stringify([
        "Farmland laser grading and precision leveling",
        "Industrial plot grading and road bed site preparation",
        "Sports field and commercial site surface leveling"
      ]),
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      galleryImages: JSON.stringify([
        "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80"
      ]),
      priceDisplay: "Price on Request",
      availability: "In Stock",
      featured: true,
      active: true,
    },
    {
      name: "Hydraulic Tipping Tractor Trailer",
      slug: "hydraulic-tipping-tractor-trailer",
      categoryId: categoriesMap["haulage-transport"],
      shortDescription: "Heavy-duty agricultural tipping trailer engineered with high-strength steel chassis for rugged off-road transport.",
      description: "Built for heavy industrial and agricultural transport, the Raj Agro Hydraulic Tipping Trailer delivers extreme strength and safety. Features a heavy channel frame, multi-stage hydraulic telescopic ram, heavy axle assembly, and reinforced side drops.",
      specifications: JSON.stringify({
        "Payload Capacity": "5 Ton / 8 Ton / 10 Ton / 12 Ton",
        "Tipping Mechanism": "Single / Twin Telescopic Hydraulic Cylinder",
        "Chassis Frame": "ISMC 150/200 Structural Channel Steel",
        "Floor Plate": "4mm High-Tensile Steel Sheet",
        "Axle Type": "Heavy Duty Round Solid Axle with Tapered Roller Bearings",
        "Brake System": "Hydraulic / Pneumatic Braking Options"
      }),
      features: JSON.stringify([
        "Heavy-duty multi-stage telescopic ram for smooth 50-degree tipping",
        "Removable side panels and tailgate for versatile cargo loading",
        "Anti-corrosive industrial epoxy primer & polyurethane paint finish",
        "Reflective safety striping and heavy rear light guards",
        "Compatible with all commercial agricultural tractor hitches"
      ]),
      applications: JSON.stringify([
        "Agricultural crop harvest haulage (Sugarcane, Grains, Fodder)",
        "Sand, gravel, and construction aggregate transport",
        "Municipal waste handling and earth moving"
      ]),
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
      galleryImages: JSON.stringify([]),
      priceDisplay: "Price on Request",
      availability: "In Stock",
      featured: true,
      active: true,
    },
    {
      name: "Automatic Seed Cum Fertilizer Drill",
      slug: "automatic-seed-cum-fertilizer-drill",
      categoryId: categoriesMap["farm-implements"],
      shortDescription: "Precision sowing implement with dual hopper system for simultaneous seed drilling and fertilizer placement.",
      description: "Designed for uniform depth control and seed placement, the Raj Agro Automatic Seed Cum Fertilizer Drill maximizes germination rates. Features adjustable seed metering rollers, heavy-duty fluted feed cups, and inverted-T tynes for smooth operation in tilled soil.",
      specifications: JSON.stringify({
        "Number of Rows": "9 Row / 11 Row / 13 Row / 15 Row",
        "Row-to-Row Spacing": "Adjustable (6 to 9 inches)",
        "Hopper Capacity": "100 kg Seed + 100 kg Fertilizer",
        "Metering Mechanism": "Aluminum Fluted Feed Rollers",
        "Tyne Type": "Inverted T-Type / Shoe Type High Carbon Steel",
        "Power Required": "35 HP - 55 HP Tractor"
      }),
      features: JSON.stringify([
        "Dual hopper compartments with separate seed and fertilizer calibration",
        "Zero-clogging fluted feed cups for consistent metering",
        "Depth adjustment wheels for accurate seed depth control",
        "Heavy-duty tubular frame with protective powder coating",
        "Suitable for wheat, barley, mustard, gram, and pulses"
      ]),
      applications: JSON.stringify([
        "Sowing wheat and coarse grains",
        "Direct seed planting in prepared seedbeds",
        "Simultaneous basal fertilizer application"
      ]),
      image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80",
      galleryImages: JSON.stringify([]),
      priceDisplay: "Price on Request",
      availability: "In Stock",
      featured: false,
      active: true,
    },
    {
      name: "Heavy Duty Spring Loaded Cultivator",
      slug: "heavy-duty-spring-loaded-cultivator",
      categoryId: categoriesMap["farm-implements"],
      shortDescription: "Rugged primary tillage implement designed to break hardpan soil and uproot stubborn weeds efficiently.",
      description: "The Raj Agro Heavy Duty Spring Loaded Cultivator is built for tough field operations. Each tyne is supported by high-tensile dual coil springs that allow the tyne to ride over obstacles without breaking, protecting both the implement and the tractor.",
      specifications: JSON.stringify({
        "Number of Tynes": "9 Tyne / 11 Tyne / 13 Tyne",
        "Main Frame": "75x75mm Heavy Tubular / Channel Frame",
        "Tyne Thickness": "28mm Solid Forged Medium Carbon Steel",
        "Springs": "High Tensile Dual Heavy Wire Coil Springs",
        "Shovels": "Reversible Forged Boron Steel Shovels",
        "Required HP": "40 HP - 75 HP"
      }),
      features: JSON.stringify([
        "Spring relief safety system prevents tyne deformation over rocks",
        "Reversible forged shovels for double working lifespan",
        "Heavy box frame with high ground clearance to avoid clogging",
        "Fully adjustable row spacing to suit different cropping patterns",
        "Durable automotive polyurethane paint"
      ]),
      applications: JSON.stringify([
        "Primary tillage and hard soil loosening",
        "Deep weed uprooting between crop seasons",
        "Mixing manure and compost into subsoil"
      ]),
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      galleryImages: JSON.stringify([]),
      priceDisplay: "Price on Request",
      availability: "In Stock",
      featured: false,
      active: true,
    }
  ];

  for (const p of productsData) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }
  console.log("✅ Products seeded.");

  // 5. Create Gallery Items
  const galleryData = [
    {
      title: "Heavy Structural Fabrication Workshop",
      category: "Infrastructure",
      imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      description: "State-of-the-art manufacturing plant equipped with CNC cutting and precision welding.",
    },
    {
      title: "Rotavator Assembly Line",
      category: "Workshop",
      imageUrl: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80",
      description: "Quality inspection and assembly of heavy-duty rotary tillers.",
    },
    {
      title: "Field Demonstration & Customer Handover",
      category: "Machinery",
      imageUrl: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80",
      description: "On-site performance test of laser land levelers in farming fields.",
    },
    {
      title: "Quality Inspection & Stress Testing",
      category: "Quality",
      imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
      description: "Rigorous load testing of agricultural tipping trailer frames.",
    },
  ];

  for (const item of galleryData) {
    const existing = await prisma.galleryItem.findFirst({ where: { title: item.title } });

    if (existing) {
      await prisma.galleryItem.update({
        where: { id: existing.id },
        data: item,
      });
    } else {
      await prisma.galleryItem.create({
        data: item,
      });
    }
  }
  console.log("✅ Gallery items seeded.");

  console.log("🎉 Seed finished successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
