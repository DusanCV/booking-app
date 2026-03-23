"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { Unit } from "@/types/unit";

type FormMode = "create" | "edit";

type Props =
  | {
      mode: "create";
      unit?: never;
    }
  | {
      mode: "edit";
      unit: Unit;
    };

type FormState = {
  name: string;
  slug: string;
  short_description: string;
  full_description: string;
  capacity: string;
  size_m2: string;
  base_price: string;
  cover_image: string;
  city: string;
  country: string;
  address: string;
  bedroom_count: string;
  bathroom_count: string;
  bed_count: string;
  check_in_time: string;
  check_out_time: string;
  amenities: string;
  is_active: boolean;
};

function createInitialState(mode: FormMode, unit?: Unit): FormState {
  if (mode === "edit" && unit) {
    return {
      name: unit.name ?? "",
      slug: unit.slug ?? "",
      short_description: unit.short_description ?? "",
      full_description: unit.full_description ?? "",
      capacity: String(unit.capacity ?? 1),
      size_m2: unit.size_m2 ? String(unit.size_m2) : "",
      base_price: String(unit.base_price ?? 0),
      cover_image: unit.cover_image ?? "",
      city: unit.city ?? "",
      country: unit.country ?? "",
      address: unit.address ?? "",
      bedroom_count: unit.bedroom_count ? String(unit.bedroom_count) : "1",
      bathroom_count: unit.bathroom_count ? String(unit.bathroom_count) : "1",
      bed_count: unit.bed_count ? String(unit.bed_count) : "1",
      check_in_time: unit.check_in_time ?? "",
      check_out_time: unit.check_out_time ?? "",
      amenities: (unit.amenities ?? []).join(", "),
      is_active: unit.is_active,
    };
  }

  return {
    name: "",
    slug: "",
    short_description: "",
    full_description: "",
    capacity: "1",
    size_m2: "",
    base_price: "0",
    cover_image: "",
    city: "",
    country: "",
    address: "",
    bedroom_count: "1",
    bathroom_count: "1",
    bed_count: "1",
    check_in_time: "",
    check_out_time: "",
    amenities: "",
    is_active: true,
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[čć]/g, "c")
    .replace(/[ž]/g, "z")
    .replace(/[š]/g, "s")
    .replace(/[đ]/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const inputClassName =
  "w-full rounded-2xl border border-white/15 bg-white px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-white focus:ring-2 focus:ring-white/20";

const textareaClassName =
  "w-full rounded-2xl border border-white/15 bg-white px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-white focus:ring-2 focus:ring-white/20 resize-y";

export function UnitForm(props: Props) {
  const mode = props.mode;
  const unit = mode === "edit" ? props.unit : undefined;

  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(createInitialState(mode, unit));

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleNameChange(value: string) {
    setForm((prev) => ({
      ...prev,
      name: value,
      slug:
        mode === "create" ||
        prev.slug.trim() === "" ||
        prev.slug === slugify(prev.name)
          ? slugify(value)
          : prev.slug,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoading(true);
      setMessage(null);

      const amenities = form.amenities
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("Moraš biti prijavljen.");
      }

      const payload = {
        owner_id: user.id,
        name: form.name.trim(),
        slug: form.slug.trim(),
        short_description: form.short_description.trim() || null,
        full_description: form.full_description.trim() || null,
        capacity: Number(form.capacity || 1),
        size_m2: form.size_m2 ? Number(form.size_m2) : null,
        base_price: Number(form.base_price || 0),
        cover_image: form.cover_image.trim() || null,
        city: form.city.trim() || null,
        country: form.country.trim() || null,
        address: form.address.trim() || null,
        bedroom_count: form.bedroom_count ? Number(form.bedroom_count) : 1,
        bathroom_count: form.bathroom_count ? Number(form.bathroom_count) : 1,
        bed_count: form.bed_count ? Number(form.bed_count) : 1,
        check_in_time: form.check_in_time.trim() || null,
        check_out_time: form.check_out_time.trim() || null,
        amenities,
        is_active: form.is_active,
      };

      if (mode === "create") {
        const { data, error } = await supabase
          .from("units")
          .insert(payload)
          .select("id")
          .single();

        if (error) {
          throw new Error(error.message);
        }

        router.push(`/admin/units/${data.id}`);
        router.refresh();
        return;
      }

      const { error } = await supabase
        .from("units")
        .update(payload)
        .eq("id", unit!.id);

      if (error) {
        throw new Error(error.message);
      }

      setMessage("Promjene su uspješno spremljene.");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : mode === "create"
            ? "Greška pri kreiranju jedinice."
            : "Greška pri spremanju jedinice."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/5 p-7 backdrop-blur">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/40">
          {mode === "create" ? "Nova jedinica" : "Detalji jedinice"}
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-white">
          {mode === "create" ? "Unesi informacije" : "Uredi informacije"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Naziv">
            <input
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className={inputClassName}
              placeholder="npr. Villa Matea"
            />
          </Field>

          <Field label="Slug">
            <input
              value={form.slug}
              onChange={(e) => updateField("slug", e.target.value)}
              className={inputClassName}
              placeholder="npr. villa-matea"
            />
          </Field>
        </div>

        <Field label="Kratki opis">
          <textarea
            value={form.short_description}
            onChange={(e) => updateField("short_description", e.target.value)}
            className={`${textareaClassName} min-h-28`}
            placeholder="Kratki opis jedinice..."
          />
        </Field>

        <Field label="Puni opis">
          <textarea
            value={form.full_description}
            onChange={(e) => updateField("full_description", e.target.value)}
            className={`${textareaClassName} min-h-40`}
            placeholder="Detaljan opis smještaja..."
          />
        </Field>

        <div className="grid gap-5 md:grid-cols-3">
          <Field label="Kapacitet">
            <input
              type="number"
              min={1}
              value={form.capacity}
              onChange={(e) => updateField("capacity", e.target.value)}
              className={inputClassName}
            />
          </Field>

          <Field label="Veličina m²">
            <input
              type="number"
              min={0}
              value={form.size_m2}
              onChange={(e) => updateField("size_m2", e.target.value)}
              className={inputClassName}
            />
          </Field>

          <Field label="Cijena po noći">
            <input
              type="number"
              min={0}
              value={form.base_price}
              onChange={(e) => updateField("base_price", e.target.value)}
              className={inputClassName}
            />
          </Field>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <Field label="Spavaće sobe">
            <input
              type="number"
              min={1}
              value={form.bedroom_count}
              onChange={(e) => updateField("bedroom_count", e.target.value)}
              className={inputClassName}
            />
          </Field>

          <Field label="Kupaonice">
            <input
              type="number"
              min={1}
              value={form.bathroom_count}
              onChange={(e) => updateField("bathroom_count", e.target.value)}
              className={inputClassName}
            />
          </Field>

          <Field label="Kreveti">
            <input
              type="number"
              min={1}
              value={form.bed_count}
              onChange={(e) => updateField("bed_count", e.target.value)}
              className={inputClassName}
            />
          </Field>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <Field label="Grad">
            <input
              value={form.city}
              onChange={(e) => updateField("city", e.target.value)}
              className={inputClassName}
              placeholder="npr. Split"
            />
          </Field>

          <Field label="Država">
            <input
              value={form.country}
              onChange={(e) => updateField("country", e.target.value)}
              className={inputClassName}
              placeholder="npr. Hrvatska"
            />
          </Field>

          <Field label="Adresa">
            <input
              value={form.address}
              onChange={(e) => updateField("address", e.target.value)}
              className={inputClassName}
              placeholder="npr. Ulica 1"
            />
          </Field>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Check-in vrijeme">
            <input
              value={form.check_in_time}
              onChange={(e) => updateField("check_in_time", e.target.value)}
              placeholder="npr. 15:00"
              className={inputClassName}
            />
          </Field>

          <Field label="Check-out vrijeme">
            <input
              value={form.check_out_time}
              onChange={(e) => updateField("check_out_time", e.target.value)}
              placeholder="npr. 10:00"
              className={inputClassName}
            />
          </Field>
        </div>

        <Field label="Amenities (odvojene zarezom)">
          <textarea
            value={form.amenities}
            onChange={(e) => updateField("amenities", e.target.value)}
            className={`${textareaClassName} min-h-28`}
            placeholder="Wi-Fi, Klima, Smart TV, Balkon"
          />
        </Field>

        <Field label="Fallback cover URL">
          <input
            value={form.cover_image}
            onChange={(e) => updateField("cover_image", e.target.value)}
            className={inputClassName}
            placeholder="https://..."
          />
        </Field>

        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => updateField("is_active", e.target.checked)}
          />
          <span className="text-sm font-medium text-white">
            Jedinica je aktivna i vidljiva javno
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3.5 text-base font-semibold text-slate-950 transition hover:scale-[1.01] disabled:opacity-60"
        >
          {loading
            ? mode === "create"
              ? "Kreiram..."
              : "Spremam..."
            : mode === "create"
              ? "Kreiraj jedinicu"
              : "Spremi promjene"}
        </button>

        {message && (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85">
            {message}
          </div>
        )}
      </form>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-white/80">
        {label}
      </span>
      {children}
    </label>
  );
}