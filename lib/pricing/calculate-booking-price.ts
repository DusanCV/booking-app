import { differenceInCalendarDays, parseISO } from "date-fns";

type CalculateBookingPriceInput = {
  checkIn: string;
  checkOut: string;
  basePrice: number;
};

export function calculateBookingPrice({
  checkIn,
  checkOut,
  basePrice,
}: CalculateBookingPriceInput) {
  const nights = differenceInCalendarDays(parseISO(checkOut), parseISO(checkIn));

  if (nights <= 0) {
    return {
      nights: 0,
      totalPrice: 0,
    };
  }

  return {
    nights,
    totalPrice: nights * basePrice,
  };
}