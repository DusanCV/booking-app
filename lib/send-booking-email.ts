type SendBookingEmailInput = {
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

export async function sendBookingEmail(input: SendBookingEmailInput) {
  const response = await fetch("/api/send-booking-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error || "Greška pri slanju emaila.");
  }

  return response.json();
}