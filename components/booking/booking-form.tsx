"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Unit } from "@/types/unit";
import { checkAvailability } from "@/lib/availability/check-availability";
import { createBooking } from "@/lib/booking";
import { calculateBookingPrice } from "@/lib/pricing/calculate-booking-price";
import { sendBookingEmail } from "@/lib/send-booking-email";

const bookingFormSchema = z
  .object({
    unitId: z.coerce.number().min(1, "Odaberi jedinicu."),
    checkIn: z.string().min(1, "Odaberi datum dolaska."),
    checkOut: z.string().min(1, "Odaberi datum odlaska."),
    adults: z.coerce.number().min(1, "Mora biti barem 1 odrasla osoba."),
    children: z.coerce.number().min(0),
    guestName: z.string().min(2, "Unesi ime i prezime."),
    guestEmail: z.email("Unesi ispravan email."),
    guestPhone: z.string().optional(),
  })
  .refine((data) => data.checkOut > data.checkIn, {
    message: "Datum odlaska mora biti nakon datuma dolaska.",
    path: ["checkOut"],
  });

type BookingFormValues = z.infer<typeof bookingFormSchema>;

type BookingFormProps = {
  units: Unit[];
};

export function BookingForm({ units }: BookingFormProps) {
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [canSubmitBooking, setCanSubmitBooking] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
    reset,
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      unitId: units[0]?.id ?? 0,
      checkIn: "",
      checkOut: "",
      adults: 2,
      children: 0,
      guestName: "",
      guestEmail: "",
      guestPhone: "",
    },
  });

  const selectedUnitId = watch("unitId");
  const watchedCheckIn = watch("checkIn");
  const watchedCheckOut = watch("checkOut");

  const selectedUnit = useMemo(
    () => units.find((unit) => unit.id === Number(selectedUnitId)) ?? null,
    [units, selectedUnitId]
  );

  const pricing = useMemo(() => {
    if (!selectedUnit || !watchedCheckIn || !watchedCheckOut) {
      return {
        nights: 0,
        totalPrice: 0,
      };
    }

    return calculateBookingPrice({
      checkIn: watchedCheckIn,
      checkOut: watchedCheckOut,
      basePrice: Number(selectedUnit.base_price),
    });
  }, [selectedUnit, watchedCheckIn, watchedCheckOut]);

  const onCheckAvailability = async (values: BookingFormValues) => {
    try {
      setIsChecking(true);
      setResultMessage(null);
      setIsAvailable(null);
      setCanSubmitBooking(false);

      const result = await checkAvailability({
        unitId: values.unitId,
        checkIn: values.checkIn,
        checkOut: values.checkOut,
      });

      if (result.isAvailable) {
        setIsAvailable(true);
        setCanSubmitBooking(true);
        setResultMessage("Termin je dostupan. Možeš poslati booking upit.");
      } else {
        setIsAvailable(false);
        setCanSubmitBooking(false);
        setResultMessage("Termin nije dostupan za odabranu jedinicu.");
      }
    } catch (error) {
      setIsAvailable(false);
      setCanSubmitBooking(false);
      setResultMessage(
        error instanceof Error
          ? error.message
          : "Došlo je do greške pri provjeri dostupnosti."
      );
    } finally {
      setIsChecking(false);
    }
  };

  const onSubmitBooking = async () => {
  const values = getValues();

  try {
    setIsSubmittingBooking(true);
    setResultMessage(null);

    await createBooking({
      unitId: values.unitId,
      guestName: values.guestName,
      guestEmail: values.guestEmail,
      guestPhone: values.guestPhone,
      checkIn: values.checkIn,
      checkOut: values.checkOut,
      adults: values.adults,
      children: values.children,
      totalPrice: pricing.totalPrice,
    });

    await sendBookingEmail({
      unitName: selectedUnit?.name ?? "Jedinica",
      guestName: values.guestName,
      guestEmail: values.guestEmail,
      guestPhone: values.guestPhone,
      checkIn: values.checkIn,
      checkOut: values.checkOut,
      adults: values.adults,
      children: values.children,
      totalPrice: pricing.totalPrice,
    });

    setIsAvailable(true);
    setCanSubmitBooking(false);
    setResultMessage("Booking upit je uspješno poslan.");
    reset({
      unitId: units[0]?.id ?? 0,
      checkIn: "",
      checkOut: "",
      adults: 2,
      children: 0,
      guestName: "",
      guestEmail: "",
      guestPhone: "",
    });
  } catch (error) {
    setResultMessage(
      error instanceof Error
        ? error.message
        : "Došlo je do greške pri spremanju booking upita."
    );
  } finally {
    setIsSubmittingBooking(false);
  }
};

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Booking forma
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Ispuni podatke i provjeri raspoloživost termina.
        </p>
      </div>

      <form onSubmit={handleSubmit(onCheckAvailability)} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-800">
            Jedinica
          </label>
          <select
            {...register("unitId")}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900"
          >
            {units.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.name}
              </option>
            ))}
          </select>
          {errors.unitId && (
            <p className="mt-1 text-sm text-red-600">{errors.unitId.message}</p>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-800">
              Check-in
            </label>
            <input
              type="date"
              {...register("checkIn")}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900"
            />
            {errors.checkIn && (
              <p className="mt-1 text-sm text-red-600">
                {errors.checkIn.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-800">
              Check-out
            </label>
            <input
              type="date"
              {...register("checkOut")}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900"
            />
            {errors.checkOut && (
              <p className="mt-1 text-sm text-red-600">
                {errors.checkOut.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-800">
              Broj odraslih
            </label>
            <input
              type="number"
              min={1}
              {...register("adults")}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900"
            />
            {errors.adults && (
              <p className="mt-1 text-sm text-red-600">
                {errors.adults.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-800">
              Broj djece
            </label>
            <input
              type="number"
              min={0}
              {...register("children")}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900"
            />
            {errors.children && (
              <p className="mt-1 text-sm text-red-600">
                {errors.children.message}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <h3 className="text-sm font-semibold text-gray-900">
            Sažetak cijene
          </h3>

          <div className="mt-3 space-y-2 text-sm text-gray-700">
            <div className="flex items-center justify-between">
              <span>Odabrana jedinica</span>
              <span className="font-medium">
                {selectedUnit?.name ?? "-"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span>Cijena po noći</span>
              <span className="font-medium">
                {selectedUnit ? `${selectedUnit.base_price} €` : "-"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span>Broj noćenja</span>
              <span className="font-medium">{pricing.nights}</span>
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 pt-2 text-base font-semibold text-gray-900">
              <span>Ukupno</span>
              <span>{pricing.totalPrice} €</span>
            </div>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-800">
            Ime i prezime
          </label>
          <input
            type="text"
            {...register("guestName")}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900"
          />
          {errors.guestName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.guestName.message}
            </p>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-800">
              Email
            </label>
            <input
              type="email"
              {...register("guestEmail")}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900"
            />
            {errors.guestEmail && (
              <p className="mt-1 text-sm text-red-600">
                {errors.guestEmail.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-800">
              Telefon
            </label>
            <input
              type="text"
              {...register("guestPhone")}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            disabled={isChecking}
            className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium text-gray-900 transition hover:bg-gray-50 disabled:opacity-50"
          >
            {isChecking ? "Provjeravam..." : "Provjeri dostupnost"}
          </button>

          <button
            type="button"
            onClick={onSubmitBooking}
            disabled={!canSubmitBooking || isSubmittingBooking || pricing.nights <= 0}
            className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
          >
            {isSubmittingBooking ? "Šaljem..." : "Pošalji booking upit"}
          </button>
        </div>
      </form>

      {resultMessage && (
        <div
          className={`mt-6 rounded-2xl border p-4 text-sm ${
            isAvailable
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {resultMessage}
        </div>
      )}
    </div>
  );
}