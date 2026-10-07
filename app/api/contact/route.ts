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
    const _recipient = process.env.CONTACT_RECIPIENT_EMAIL || content.contact.recipientEmail;

    // TODO(confirm): replace this stub with a real mail provider (Resend, SendGrid, etc.)
    // B2.18 / B1.3: No PII logged in production logs
    if (process.env.NODE_ENV === "development") {
      console.info("[Contact Submission] Validated payload received (length:", trimmedMessage.length, ")");
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
