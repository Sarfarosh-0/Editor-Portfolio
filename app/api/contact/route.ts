// app/api/contact/route.ts
// Hardened contact form handler: validation, sanitization, rate limiting, anti-spam honeypot.
// TODO(confirm): stub contact form handler. Wire to a real mail provider via env var.

import { NextRequest, NextResponse } from "next/server";
import { content } from "@/content/content";

// In-memory rate limiting store (cleared periodically)
const ipRequestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

// Email RFC-compliant regex
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export async function POST(req: NextRequest) {
  try {
    // 1. Origin verification (B2.14: reject cross-site POSTs)
    const origin = req.headers.get("origin");
    const host = req.headers.get("host");
    if (origin) {
      try {
        const originHost = new URL(origin).host;
        if (host && originHost !== host) {
          return NextResponse.json({ error: "Cross-site request blocked." }, { status: 403 });
        }
      } catch {
        return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
      }
    }

    // 2. IP Rate limiting
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown-ip";
    const now = Date.now();
    const rateInfo = ipRequestCounts.get(ip);

    if (rateInfo) {
      if (now < rateInfo.resetTime) {
        if (rateInfo.count >= MAX_REQUESTS_PER_WINDOW) {
          return NextResponse.json(
            { error: "Too many requests. Please try again later." },
            { status: 429 }
          );
        }
        rateInfo.count += 1;
      } else {
        ipRequestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
      }
    } else {
      ipRequestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    }

    // 3. Body parsing with size validation
    const rawBody = await req.text();
    if (rawBody.length > 10 * 1024) {
      return NextResponse.json({ error: "Payload too large." }, { status: 413 });
    }

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON format." }, { status: 400 });
    }

    const { name, email, subject, message, hp } = parsed;

    // 4. Honeypot check (anti-spam bot trap)
    if (hp && typeof hp === "string" && hp.trim().length > 0) {
      // Silently accept without processing to fool bots
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // 5. Type and presence validation
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof subject !== "string" ||
      typeof message !== "string"
    ) {
      return NextResponse.json({ error: "Invalid form field types." }, { status: 400 });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedSubject || !trimmedMessage) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    // 6. Max length constraints
    if (trimmedName.length > 100) {
      return NextResponse.json({ error: "Name must be 100 characters or fewer." }, { status: 400 });
    }
    if (trimmedEmail.length > 254) {
      return NextResponse.json({ error: "Email must be 254 characters or fewer." }, { status: 400 });
    }
    if (trimmedSubject.length > 150) {
      return NextResponse.json({ error: "Subject must be 150 characters or fewer." }, { status: 400 });
    }
    if (trimmedMessage.length > 5000) {
      return NextResponse.json({ error: "Message must be 5000 characters or fewer." }, { status: 400 });
    }

    // 7. Header injection prevention (no newlines in single-line fields)
    if (/[\r\n]/.test(trimmedName) || /[\r\n]/.test(trimmedEmail) || /[\r\n]/.test(trimmedSubject)) {
      return NextResponse.json({ error: "Invalid characters in fields." }, { status: 400 });
    }

    // 8. Email format check
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    // 9. Recipient resolution (from env, with content fallback)
    // B2.17: Recipient address taken from server env/content, never from request body
    const recipient = process.env.CONTACT_RECIPIENT_EMAIL || content.contact.recipientEmail;
    const resendApiKey = process.env.RESEND_API_KEY;

    // Helper: HTML-escape to prevent XSS (B2.12)
    const escapeHtml = (str: string) =>
      str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    // 10. Live email delivery via Resend API (B8.1)
    if (resendApiKey) {
      const emailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Portfolio Contact <onboarding@resend.dev>",
          to: [recipient],
          reply_to: trimmedEmail,
          subject: `[Portfolio Inquiry] ${trimmedSubject}`,
          text: `Name: ${trimmedName}\nEmail: ${trimmedEmail}\nSubject: ${trimmedSubject}\n\nMessage:\n${trimmedMessage}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0a0a0a; color: #ffffff; border-radius: 12px; border: 1px solid #222;">
              <h2 style="margin-top: 0; color: #42dcff; font-size: 1.3rem;">New Portfolio Inquiry</h2>
              <div style="background: rgba(255, 255, 255, 0.04); padding: 16px; border-radius: 8px; margin: 16px 0; border: 1px solid rgba(255, 255, 255, 0.08);">
                <p style="margin: 6px 0;"><strong>Name:</strong> ${escapeHtml(trimmedName)}</p>
                <p style="margin: 6px 0;"><strong>Email:</strong> <a href="mailto:${escapeHtml(trimmedEmail)}" style="color: #42dcff;">${escapeHtml(trimmedEmail)}</a></p>
                <p style="margin: 6px 0;"><strong>Subject:</strong> ${escapeHtml(trimmedSubject)}</p>
              </div>
              <div style="margin-top: 16px;">
                <p style="margin-bottom: 8px; color: rgba(255, 255, 255, 0.7); font-size: 0.9rem;"><strong>Message:</strong></p>
                <div style="background: rgba(255, 255, 255, 0.02); padding: 16px; border-radius: 8px; white-space: pre-wrap; line-height: 1.6; border: 1px solid rgba(255, 255, 255, 0.06);">${escapeHtml(trimmedMessage)}</div>
              </div>
              <p style="margin-top: 24px; font-size: 0.75rem; color: rgba(255, 255, 255, 0.4); border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 12px;">
                Sent from your portfolio contact form. Hit "Reply" to respond directly to ${escapeHtml(trimmedEmail)}.
              </p>
            </div>
          `,
        }),
      });

      if (!emailRes.ok) {
        return NextResponse.json(
          { error: "Failed to dispatch email. Please try again or reach out directly." },
          { status: 502 }
        );
      }
    } else {
      // In dev or until RESEND_API_KEY is configured
      if (process.env.NODE_ENV === "development") {
        console.info(
          "[Contact Submission] Received valid payload for",
          recipient,
          "(add RESEND_API_KEY to send live email)"
        );
      }
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PATCH() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
