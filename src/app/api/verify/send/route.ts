import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { Resend } from "resend";

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Email inválido" },
        { status: 400 }
      );
    }

    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Upsert user with verification code
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(users)
        .set({
          verificationCode: code,
          verificationCodeExpiresAt: expiresAt,
        })
        .where(eq(users.email, email));
    } else {
      await db.insert(users).values({
        email,
        verificationCode: code,
        verificationCodeExpiresAt: expiresAt,
      });
    }

    // Send email via Resend
    await resend.emails.send({
      from: "BackhaulMatch <noreply@backhaulMatch.cl>",
      to: email,
      subject: "Tu código de verificación - BackhaulMatch",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">BackhaulMatch</h2>
          <p>Tu código de verificación es:</p>
          <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1f2937;">${code}</span>
          </div>
          <p style="color: #6b7280; font-size: 14px;">Este código expira en 10 minutos.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending verification:", error);
    return NextResponse.json(
      { error: "Error al enviar el código" },
      { status: 500 }
    );
  }
}
