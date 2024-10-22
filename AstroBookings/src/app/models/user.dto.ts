export type UserRole = 'agency' | 'traveler' | 'employee';
export interface UserDto {
  id: string;
  email: string;
  role: UserRole;
}
