export type UnitImage = {
  id: number;
  unit_id: number;
  image_url: string;
  storage_path: string | null;
  is_cover: boolean;
  sort_order: number;
  created_at: string;
};

export type Unit = {
  id: number;
  owner_id: string | null;
  name: string;
  slug: string;
  short_description: string | null;
  full_description: string | null;
  capacity: number;
  size_m2: number | null;
  base_price: number;
  cover_image: string | null;
  city: string | null;
  country: string | null;
  address: string | null;
  bedroom_count: number | null;
  bathroom_count: number | null;
  bed_count: number | null;
  check_in_time: string | null;
  check_out_time: string | null;
  amenities: string[] | null;
  is_active: boolean;
  created_at: string;
  unit_images?: UnitImage[];
};