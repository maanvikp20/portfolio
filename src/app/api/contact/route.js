import { NextResponse } from "next/server";
import { Resend } from "resend";
import { rateLimit, getClientIp } from "@/src/lib/rateLimit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MAX_LENGTHS = {
  firstName: 100,
  lastName: 100,
  email: 254,
  subject: 150,
  message: 5000,
};

// escape user input before putting it in the HTML email
const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );

// handles contact form submissions and send email via resend
export async function POST(req) {
  try {
    // 5 messages per 10 minutes per IP
    const limit = rateLimit(`contact:${getClientIp(req)}`, {
      limit: 5,
      windowMs: 10 * 60 * 1000,
    });
    if (!limit.ok) {
      return NextResponse.json(
        { error: "Too many messages. Please try again later." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
      );
    }

    // malformed JSON is the caller's mistake (400), not a server error
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }
    const fields = {};

    // every field must be a non-empty string within its length limit
    for (const [name, max] of Object.entries(MAX_LENGTHS)) {
      const value = body?.[name];
      if (typeof value !== "string" || !value.trim()) {
        return NextResponse.json(
          { error: "All fields are required." },
          { status: 400 },
        );
      }
      if (value.trim().length > max) {
        return NextResponse.json(
          { error: `${name} is too long (max ${max} characters).` },
          { status: 400 },
        );
      }
      fields[name] = value.trim();
    }

    const { firstName, lastName, email, subject, message } = fields;

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    // where messages go, and who they are sent from (set both in .env / Vercel)
    const toEmail = process.env.CONTACT_TO_EMAIL;
    if (!toEmail || !process.env.RESEND_API_KEY) {
      console.error(
        "Contact form is missing CONTACT_TO_EMAIL or RESEND_API_KEY.",
      );
      return NextResponse.json(
        { error: "Message could not be sent. Please try again later." },
        { status: 500 },
      );
    }
    const fromEmail =
      process.env.CONTACT_FROM_EMAIL ||
      "Portfolio Contact Form <onboarding@resend.dev>";

    const resend = new Resend(process.env.RESEND_API_KEY);

    // resend returns { data, error } instead of throwing on API failures
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: email,
      subject: `[Portfolio Contact] ${subject.replace(/[\r\n]+/g, " ")}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="border-bottom: 1px solid #eee; padding-bottom: 10px;">New message from your portfolio</h2>
          <p><strong>Name:</strong> ${escapeHtml(firstName)} ${escapeHtml(lastName)}</p>
          <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
          <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
          <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 6px; white-space: pre-wrap;">
            <strong>Message:</strong><br/><br/>${escapeHtml(message)}
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Message could not be sent. Please try again later." },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 },
    );
  }
}
