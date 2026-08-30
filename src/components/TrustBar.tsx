import { ShieldCheck, Wrench, Cpu, Truck, HeartHandshake, Layers } from "lucide-react";

const trustItems = [
  {
    icon: ShieldCheck,
    label: "Heavy-Duty Engineering",
    sub: "Boron steel & structural ISMC chassis",
  },
  {
    icon: Layers,
    label: "Precision Manufacturing",
    sub: "Heat-treated parts & gear transmissions",
  },
  {
    icon: Wrench,
    label: "Custom Fabrication",
    sub: "Built to your tractor & field specs",
  },
  {
    icon: Cpu,
    label: "Quality Inspection",
    sub: "Inspected before dispatch",
  },
  {
    icon: Truck,
    label: "Direct Delivery",
    sub: "Dispatched from our Mirzapur works",
  },
  {
    icon: HeartHandshake,
    label: "After-Sales Support",
    sub: "Factory spare parts & support",
  },
];

export default function TrustBar() {
  return (
    /* This strip scrolls horizontally below `lg`, and `.no-scrollbar` hides the
       scrollbar. A div with `overflow-x: auto` is not focusable, so a keyboard
       user had no way to reach the items past the viewport edge and no visible
       scrollbar hinting that more existed — WCAG 2.1.1. `tabIndex={0}` makes
       the region focusable so the arrow keys scroll it. */
    <section
      className="no-scrollbar overflow-x-auto border-b border-[var(--border)] bg-[var(--surface)] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--focus)]"
      aria-label="Company strengths"
      tabIndex={0}
    >
      <div className="shell">
        <ul className="flex min-w-max items-stretch divide-x divide-[var(--border)] lg:min-w-0 lg:justify-between">
          {trustItems.map((item) => (
            <li
              key={item.label}
              className="flex shrink-0 items-center gap-3 py-4 pl-4 pr-6 first:pl-0 last:pr-0 lg:shrink lg:px-5"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--accent-quiet-bg)]">
                <item.icon className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block whitespace-nowrap text-xs font-bold text-[var(--text)]">
                  {item.label}
                </span>
                <span className="block whitespace-nowrap text-[11px] text-[var(--text-subtle)]">
                  {item.sub}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
