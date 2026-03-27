import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
  try {
    const ses = new SESClient({
      region: process.env.AWS_REGION || "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Email inválido" },
        { status: 400 }
      );
    }

    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

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

    // Send email via AWS SES
    await ses.send(
      new SendEmailCommand({
        Source: process.env.SES_FROM_EMAIL || "noreply@luxutech.com",
        Destination: { ToAddresses: [email] },
        Message: {
          Subject: { Data: "Tu código de verificación - LuxuTech" },
          Body: {
            Html: {
              Data: `
                <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;">
                  <h2 style="color: #2563eb;">LuxuTech</h2>
                  <p>Tu código de verificación es:</p>
                  <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1f2937;">${code}</span>
                  </div>
                  <p style="color: #6b7280; font-size: 14px;">Este código expira en 10 minutos.</p>
                </div>
              `,
            },
          },
        },
      })
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    console.error("Error sending verification:", message);
    return NextResponse.json(
      { error: `Error al enviar el código: ${message}` },
      { status: 500 }
    );
  }
}
