import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  const { name, email, subject, message } = await request.json();

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
  }

  const toEmail = process.env.CONTACT_TO_EMAIL;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!toEmail || !smtpUser || !smtpPass) {
    return NextResponse.json({ error: 'Email service is not configured.' }, { status: 500 });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: false,
    auth: { user: smtpUser, pass: smtpPass },
  });

  await transporter.sendMail({
    from: `"Asmaul Husna Contact" <${smtpUser}>`,
    to: toEmail,
    replyTo: `"${name}" <${email}>`,
    subject: subject?.trim() || `Message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><hr/><p>${message.replace(/\n/g, '<br/>')}</p>`,
  });

  return NextResponse.json({ success: true });
}
