import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import QuoteForm from "./QuoteForm";

export default function QuotePage() {
  return <main className="quote-page"><div className="shell quote-page-grid"><div><Link href="/" className="back-link"><ArrowLeft size={15} /> Back to RAEW</Link><p className="eyebrow">Requirement / 01</p><h1>Tell us what<br /><i>needs doing.</i></h1><p>Share the machine, implement or engineering problem you are trying to solve. We will take it from there.</p><div className="contact-note">Prefer a direct conversation?<br /><a href="tel:+917651861335">+91 76518 61335</a></div></div><QuoteForm /></div></main>;
}
