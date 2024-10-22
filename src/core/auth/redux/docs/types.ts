export type RequirementDocsType = keyof DocsState;

export type DocsState = {
  profilePhoto: DocsFile | null;
  passport: DocsFile[];
  driversLicense: DocsFile[];
  vehicleInsurance: DocsFile[];
  vehicleRegistration: DocsFile[];
};

export type DocsFile = {
  name: string;
  type: string;
  uri: string;
};

export type RequirementDocs = DocsFile[] | DocsFile | null;
