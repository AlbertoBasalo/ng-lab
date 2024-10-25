export type LaunchStatus = 'scheduled' | 'confirmed' | 'launched' | 'delayed' | 'aborted';

export interface LaunchDto {
  id: string;
  agencyId: string;
  rocketId: string;
  date: Date | string;
  mission: string;
  destination: string;
  pricePerSeat: number;
  status: LaunchStatus | string;
}

export const NULL_LAUNCH: LaunchDto = {
  id: '',
  agencyId: '',
  rocketId: '',
  date: '',
  mission: '',
  destination: '',
  pricePerSeat: 0,
  status: '',
};
