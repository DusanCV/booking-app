export type Unit = {
  id: number;
  name: string;
  slug: string;
  short_description: string | null;
  full_description: string | null;
  capacity: number;
  size_m2: number | null;
  base_price: number;
  cover_image: string | null;
  is_active: boolean;
  created_at: string;
};