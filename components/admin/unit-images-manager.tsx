"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { UnitImage } from "@/types/unit";

type Props = {
  unitId: number;
  initialImages: UnitImage[];
};

function sortImages(images: UnitImage[]) {
  return [...images].sort((a, b) => a.sort_order - b.sort_order);
}

function safeFileName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9.\-_]/g, "-");
}

export function UnitImagesManager({ unitId, initialImages }: Props) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [images, setImages] = useState<UnitImage[]>(sortImages(initialImages));
  const [uploading, setUploading] = useState(false);
  const [workingId, setWorkingId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const coverImageId = useMemo(
    () => images.find((image) => image.is_cover)?.id ?? null,
    [images]
  );

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    try {
      setUploading(true);
      setMessage(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Moraš biti prijavljen za upload slika.");
      }

      let nextSortOrder = images.length;
      const uploadedImages: UnitImage[] = [];

      for (const file of files) {
        const path = `${user.id}/${unitId}/${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}-${safeFileName(file.name)}`;

        const { error: uploadError } = await supabase.storage
          .from("unit-images")
          .upload(path, file);

        if (uploadError) {
          throw new Error(`Upload nije uspio: ${uploadError.message}`);
        }

        const { data: publicUrlData } = supabase.storage
          .from("unit-images")
          .getPublicUrl(path);

        const isFirstImage = images.length === 0 && uploadedImages.length === 0;

        const { data: inserted, error: insertError } = await supabase
          .from("unit_images")
          .insert({
            unit_id: unitId,
            image_url: publicUrlData.publicUrl,
            storage_path: path,
            is_cover: isFirstImage,
            sort_order: nextSortOrder,
          })
          .select()
          .single();

        if (insertError) {
          throw new Error(`Spremanje slike nije uspjelo: ${insertError.message}`);
        }

        if (isFirstImage) {
          const { error: coverError } = await supabase
            .from("units")
            .update({ cover_image: publicUrlData.publicUrl })
            .eq("id", unitId);

          if (coverError) {
            throw new Error(
              `Postavljanje cover slike nije uspjelo: ${coverError.message}`
            );
          }
        }

        uploadedImages.push(inserted as UnitImage);
        nextSortOrder += 1;
      }

      setImages((prev) => sortImages([...prev, ...uploadedImages]));
      setMessage("Slike su uspješno dodane.");
      router.refresh();
      event.target.value = "";
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Greška pri uploadu slika."
      );
    } finally {
      setUploading(false);
    }
  }

  async function setAsCover(image: UnitImage) {
    try {
      setWorkingId(image.id);
      setMessage(null);

      const { error: resetError } = await supabase
        .from("unit_images")
        .update({ is_cover: false })
        .eq("unit_id", unitId);

      if (resetError) {
        throw new Error(resetError.message);
      }

      const { error: imageError } = await supabase
        .from("unit_images")
        .update({ is_cover: true })
        .eq("id", image.id);

      if (imageError) {
        throw new Error(imageError.message);
      }

      const { error: unitError } = await supabase
        .from("units")
        .update({ cover_image: image.image_url })
        .eq("id", unitId);

      if (unitError) {
        throw new Error(unitError.message);
      }

      setImages((prev) =>
        prev.map((item) => ({
          ...item,
          is_cover: item.id === image.id,
        }))
      );

      setMessage("Cover slika je postavljena.");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Greška pri postavljanju cover slike."
      );
    } finally {
      setWorkingId(null);
    }
  }

  async function deleteImage(image: UnitImage) {
    try {
      setWorkingId(image.id);
      setMessage(null);

      if (image.storage_path) {
        const { error: storageError } = await supabase.storage
          .from("unit-images")
          .remove([image.storage_path]);

        if (storageError) {
          throw new Error(storageError.message);
        }
      }

      const { error: deleteError } = await supabase
        .from("unit_images")
        .delete()
        .eq("id", image.id);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      const remaining = images.filter((item) => item.id !== image.id);

      if (image.is_cover) {
        if (remaining.length > 0) {
          const nextCover = remaining[0];

          const { error: nextCoverError } = await supabase
            .from("unit_images")
            .update({ is_cover: true })
            .eq("id", nextCover.id);

          if (nextCoverError) {
            throw new Error(nextCoverError.message);
          }

          const { error: updateUnitError } = await supabase
            .from("units")
            .update({ cover_image: nextCover.image_url })
            .eq("id", unitId);

          if (updateUnitError) {
            throw new Error(updateUnitError.message);
          }

          setImages(
            remaining.map((item) => ({
              ...item,
              is_cover: item.id === nextCover.id,
            }))
          );
        } else {
          const { error: clearCoverError } = await supabase
            .from("units")
            .update({ cover_image: null })
            .eq("id", unitId);

          if (clearCoverError) {
            throw new Error(clearCoverError.message);
          }

          setImages([]);
        }
      } else {
        setImages(remaining);
      }

      setMessage("Slika je obrisana.");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Greška pri brisanju slike."
      );
    } finally {
      setWorkingId(null);
    }
  }

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/5 p-7 backdrop-blur">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/40">
          Galerija
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-white">
          Upravljanje slikama
        </h2>
        <p className="mt-2 text-base text-white/65">
          Dodaj više slika, obriši ih ili postavi jednu kao glavnu.
        </p>
      </div>

      <label className="block cursor-pointer rounded-[1.6rem] border border-dashed border-white/20 bg-white/5 p-6 text-center transition hover:bg-white/10">
        <span className="block text-base font-semibold text-white">
          {uploading ? "Uploadam slike..." : "Klikni za upload slika"}
        </span>
        <span className="mt-2 block text-sm text-white/55">
          Možeš odabrati više slika odjednom
        </span>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          className="hidden"
          disabled={uploading}
        />
      </label>

      {message && (
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85">
          {message}
        </div>
      )}

      {images.length === 0 ? (
        <div className="mt-6 rounded-[1.6rem] border border-white/10 bg-white/5 p-5 text-white/60">
          Trenutno nema dodanih slika.
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {images.map((image) => (
            <div
              key={image.id}
              className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/5"
            >
              <div className="relative h-56">
                <Image
                  src={image.image_url}
                  alt="Unit image"
                  fill
                  className="object-cover"
                />

                {coverImageId === image.id && (
                  <div className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-950">
                    Cover
                  </div>
                )}
              </div>

              <div className="flex gap-3 p-4">
                <button
                  type="button"
                  onClick={() => setAsCover(image)}
                  disabled={workingId === image.id || coverImageId === image.id}
                  className="flex-1 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-50"
                >
                  {coverImageId === image.id ? "Glavna slika" : "Postavi cover"}
                </button>

                <button
                  type="button"
                  onClick={() => deleteImage(image)}
                  disabled={workingId === image.id}
                  className="flex-1 rounded-full border border-rose-400/30 bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20 disabled:opacity-50"
                >
                  Obriši
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}