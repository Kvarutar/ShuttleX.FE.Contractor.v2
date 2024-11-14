export enum UnclosablePopupModes {
  Warning = 'warning',
  WarningForTwoCancels = 'warningForTwoCancels',
  Banned = 'banned',
  PassengerPaidTripViaCash = 'passengerPaidTripViaCash',
  DocumentUnderReview = 'documentUnderReview',
  DocumentRejected = 'documentRejected',
  DocumentRejectedError = 'documentRejectedError',
  CompleteVerification = 'completeVerification',
}

export type UnclosablePopupInfo = Record<
  UnclosablePopupModes,
  { subTitle: string | null; title: string | null; secondTitle: string | null; description: string | null }
>;

export type UnclosablePopupProps = {
  mode?: UnclosablePopupModes;
  bottomAdditionalContent?: React.ReactNode;
};
