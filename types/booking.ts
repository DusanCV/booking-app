export type BookingStatus = "pending" | "confirmed" | "cancelled";

export type BookingSource = "website" | "admin";

export type Booking = {
  id: number;
  unit_id: number;
  guest_name: string;
  guest_email: string;
  guest_phone: string | null;
  check_in: string;
  check_out: string;
  adults: number;
  children: number;
  total_price: number | null;
  status: BookingStatus;
  source: BookingSource;
  notes: string | null;
  created_at: string;
};

export type BlockedDate = {
  id: number;
  unit_id: number;
  start_date: string;
  end_date: string;
  reason: string | null;
  created_at: string;
};