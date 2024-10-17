export type BookingStatus = 'pending' | 'confirmed' | 'canceled';

export interface BookingDto {
  id: string;
  travelerId: string;
  launchId: string;
  numberOfSeats: number;
  totalPrice: number;
  status: BookingStatus;
}
