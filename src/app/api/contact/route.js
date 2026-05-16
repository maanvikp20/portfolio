import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// handles contact form submissions and send email via resend
export async function POST(req) {
  try {
    const { firstName, lastName, email, subject, message } = await req.json();

    // validate req fields
    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All input fields are explicitly marked as required fields." },
        { status: 400 }
      );
    }

    // send email via resend
    const data = await resend.emails.send({
      from: "Portfolio Contact Form <onboarding@resend.dev>",
      to: ["maanvikpoddar@gmail.com"],
      replyTo: email,
      subject: `[Portfolio Contact] ${subject}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #eee; rounded: 8px;">
          <h2 style="border-bottom: 1px solid #eee; padding-bottom: 10px;">New Message From Portfolio Workspace</h2>
          <p><strong>Sender Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Return Email Address:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Stated Subject Line:</strong> ${subject}</p>
          <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 6px; white-space: pre-wrap;">
            <strong>Message Content Payload:</strong><br/><br/>${message}
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}