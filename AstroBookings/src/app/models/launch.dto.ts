export type LaunchStatus = 'scheduled' | 'confirmed' | 'launched' | 'delayed' | 'aborted';

export interface LaunchDto {
  id: string;
  agencyId: string;
  rocketId: string;
  date: Date;
  mission: string;
  destination: string;
  pricePerSeat: number;
  status: LaunchStatus;
}
