export enum RequirementDocsType {
  BackgroundCheck = 'backgroundCheck',
  ProfilePhoto = 'profilePhoto',
  Passport = 'passport',
  DriversLicense = 'driversLicense',
  VehicleInsurance = 'vehicleInsurance',
  VehicleRegistration = 'vehicleRegistration',
  VehicleInspection = 'vehicleInspection',
}

type DocsFile = {
  name: string;
  type: string;
  uri: string;
};

export type RequirementDocs = DocsFile | string | null;

export type DocsType = {
  requirements: RequirementDocs[];
};
