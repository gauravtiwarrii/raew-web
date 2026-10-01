"use client";

import { FormEvent, useState } from "react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

export default function QuoteForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const response = await fetch("/api/enquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, quantity: payload.quantity || 1, source: "QUOTE_FORM" }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to send your requirement.");
      setStatus("success");
      setMessage(data.message || "Your requirement has been received.");
      event.currentTarget.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to send your requirement.");
    }
  }

  if (status === "success") return <div className="quote-success" role="status"><CheckCircle2 size={30} /><h2>Requirement received.</h2><p>{message}</p><button type="button" onClick={() => setStatus("idle")}>Send another requirement</button></div>;

  return <form className="quote-form" onSubmit={submit} noValidate>
    <div className="form-row"><label>Name<input required name="name" placeholder="Your name" /></label><label>Company<input name="company" placeholder="Company or farm" /></label></div>
    <div className="form-row"><label>Phone<input required name="phone" placeholder="+91 00000 00000" /></label><label>Email<input type="email" name="email" placeholder="name@company.com" /></label></div>
    <label>What are you looking to build?<textarea required name="message" rows={5} placeholder="Tell us about the crop, tractor, dimensions or problem." /></label>
    <div className="form-row"><label>Location<input required name="location" placeholder="City / State" /></label><label>Quantity<input name="quantity" type="number" min="1" placeholder="Optional" /></label></div>
    <input name="website" className="honeypot" tabIndex={-1} autoComplete="off" aria-hidden="true" />
    {status === "error" && <p className="form-error" role="alert">{message}</p>}
    <button type="submit" className="dark-pill" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Send requirement"} <ArrowUpRight size={16} /></button>
  </form>;
}
