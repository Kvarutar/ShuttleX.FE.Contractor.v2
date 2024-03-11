export enum RequirementDocsType {
  BackgroundCheck = 'backgroundCheck',
  ProfilePhoto = 'profilePhoto',
  DriversLicense = 'driversLicense',
  VehicleInsurance = 'vehicleInsurance',
  VehicleRegistration = 'vehicleRegistration',
  VehicleInspection = 'vehicleInspection',
}

type DocsPhoto = {
  name: string;
  type: string;
  uri: string;
};

export type RequirementDocs = DocsPhoto | string | null;

export type DocsType = {
  requirements: RequirementDocs[];
};
