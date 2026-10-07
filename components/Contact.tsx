"use client";
// components/Contact.tsx
// Contact section with heading, subtext, and form.
// TODO(confirm): POSTs to /api/contact stub; disabled while sending; aria-live for success/error.

import { useState } from "react";
import { motion } from "framer-motion";
import Reveal from "./Reveal";
import { content } from "@/content/content";

export default function Contact() {
  const { contact } = content;
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setStatus(null);
    const form = e.currentTarget;
    const hpInput = form.elements.namedItem("hp") as HTMLInputElement | null;
    const data = {
      name: (form.elements.namedItem("cf-name") as HTMLInputElement).value,
      email: (form.elements.namedItem("cf-email") as HTMLInputElement).value,
      subject: (form.elements.namedItem("cf-subject") as HTMLInputElement).value,
      message: (form.elements.namedItem("cf-message") as HTMLTextAreaElement).value,
      hp: hpInput?.value || "",
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus({ type: "success", msg: "Message sent! I'll get back to you soon." });
        form.reset();
      } else if (res.status === 429) {
        setStatus({
          type: "error",
          msg: "Too many messages sent. Please wait a minute and try again.",
        });
      } else {
        setStatus({
          type: "error",
          msg: typeof json.error === "string" ? json.error : "Something went wrong. Please try again.",
        });
      }
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof DOMException && err.name === "AbortError") {
        setStatus({ type: "error", msg: "Request timed out. Please try again." });
      } else {
        setStatus({ type: "error", msg: "Network error. Please try again." });
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="contact">
      {/* Heading block — errata: reveal from opacity:0, translateY(20px) */}
      <Reveal y={20} once={false} className="contact-heading">
        <h2>
          {contact.headingLead} <span className="accent">{contact.headingAccent}</span>
        </h2>
        <p>{contact.subtext}</p>
      </Reveal>

      {/* Form — errata: reveal from opacity:0, translateY(30px) */}
      <Reveal y={30} once={false} style={{ width: "100%", maxWidth: "680px" }}>
        <motion.form
          className="contact-form"
          onSubmit={handleSubmit}
          noValidate={false}
        >
          {/* Honeypot field (hidden from screen readers & visual visitors) */}
          <div style={{ position: "absolute", left: "-9999px", opacity: 0 }} aria-hidden="true">
            <input
              type="text"
              name="hp"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {/* Row 1: Name + Email */}
          <div className="form-row">
            <div className="field">
              <label className="field-label" htmlFor="cf-name">
                {contact.fields.name.label}
              </label>
              <input
                id="cf-name"
                name="cf-name"
                className="input"
                type="text"
                placeholder={contact.fields.name.placeholder}
                autoComplete="name"
                maxLength={100}
                required
                disabled={sending}
              />
            </div>
            <div className="field">
              <label className="field-label" htmlFor="cf-email">
                {contact.fields.email.label}
              </label>
              <input
                id="cf-email"
                name="cf-email"
                className="input"
                type="email"
                placeholder={contact.fields.email.placeholder}
                autoComplete="email"
                maxLength={254}
                required
                disabled={sending}
              />
            </div>
          </div>

          {/* Subject */}
          <div className="field">
            <label className="field-label" htmlFor="cf-subject">
              {contact.fields.subject.label}
            </label>
            <input
              id="cf-subject"
              name="cf-subject"
              className="input"
              type="text"
              placeholder={contact.fields.subject.placeholder}
              maxLength={150}
              required
              disabled={sending}
            />
          </div>

          {/* Message */}
          <div className="field">
            <label className="field-label" htmlFor="cf-message">
              {contact.fields.message.label}
            </label>
            <textarea
              id="cf-message"
              name="cf-message"
              className="textarea"
              placeholder={contact.fields.message.placeholder}
              maxLength={5000}
              required
              disabled={sending}
            />
          </div>

          {/* Submit */}
          <button type="submit" className="submit-btn" disabled={sending}>
            {sending ? "Sending…" : contact.submitLabel}
          </button>

          {/* aria-live status region */}
          <div
            aria-live="polite"
            aria-atomic="true"
            className={`form-status${status ? ` ${status.type}` : ""}`}
          >
            {status?.msg ?? ""}
          </div>
        </motion.form>
      </Reveal>
    </section>
  );
}
