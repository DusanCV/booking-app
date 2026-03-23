import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type BookingEmailPayload = {
  unitName: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  totalPrice?: number;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as BookingEmailPayload;

    const adminEmail = process.env.BOOKING_ADMIN_EMAIL;

    if (!adminEmail) {
      return NextResponse.json(
        { error: "BOOKING_ADMIN_EMAIL nije postavljen." },
        { status: 500 }
      );
    }

    const nightsText =
      body.totalPrice !== undefined
        ? `<p><strong>Ukupno:</strong> ${body.totalPrice} €</p>`
        : "";

    const adminHtml = `
      <h2>Novi booking upit</h2>
      <p><strong>Jedinica:</strong> ${body.unitName}</p>
      <p><strong>Gost:</strong> ${body.guestName}</p>
      <p><strong>Email:</strong> ${body.guestEmail}</p>
      <p><strong>Telefon:</strong> ${body.guestPhone || "-"}</p>
      <p><strong>Check-in:</strong> ${body.checkIn}</p>
      <p><strong>Check-out:</strong> ${body.checkOut}</p>
      <p><strong>Odrasli:</strong> ${body.adults}</p>
      <p><strong>Djeca:</strong> ${body.children}</p>
      ${nightsText}
    `;

    const guestHtml = `
      <h2>Zaprimili smo vaš booking upit</h2>
      <p>Pozdrav ${body.guestName},</p>
      <p>vaš booking upit je uspješno zaprimljen.</p>
      <p><strong>Jedinica:</strong> ${body.unitName}</p>
      <p><strong>Check-in:</strong> ${body.checkIn}</p>
      <p><strong>Check-out:</strong> ${body.checkOut}</p>
      <p><strong>Odrasli:</strong> ${body.adults}</p>
      <p><strong>Djeca:</strong> ${body.children}</p>
      ${nightsText}
      <p>Javit ćemo vam se uskoro s potvrdom rezervacije.</p>
    `;

    await resend.emails.send({
      from: "Booking App <onboarding@resend.dev>",
      to: adminEmail,
      subject: `Novi booking upit - ${body.unitName}`,
      html: adminHtml,
    });

    await resend.emails.send({
      from: "Booking App <onboarding@resend.dev>",
      to: body.guestEmail,
      subject: "Potvrda zaprimljenog booking upita",
      html: guestHtml,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Greška pri slanju emaila.",
      },
      { status: 500 }
    );
  }
}