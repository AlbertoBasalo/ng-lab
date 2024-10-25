export interface TravelerDto {
  id: string;
  contactPhone: string;
  contactEmail: string;
  emergencyContact: string;
  travelPreferences: {
    preferredDestination: string;
    dietaryRestrictions?: string;
    medicalConditions?: string;
  };
}
