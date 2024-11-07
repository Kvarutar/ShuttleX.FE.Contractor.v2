export type VerificationState = {
  isVerificationDone: boolean;
  isBlocked: boolean;
  lockoutChangesTimestamp: number;
  lockoutChangesAttempts: number;
};
