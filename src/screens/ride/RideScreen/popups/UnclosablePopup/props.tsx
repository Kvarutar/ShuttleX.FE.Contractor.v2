export enum UnclosablePopupModes {
  Warning = 'warning',
  Banned = 'banned',
  AccountIsNotActive = 'accountIsNotActive',
}

export type UnclosablePopupInfo = Record<
  UnclosablePopupModes,
  { subTitle: string | null; title: string | null; secondTitle: string | null; description: string | null }
>;

export type UnclosablePopupProps = {
  mode?: UnclosablePopupModes;
  bottomAdditionalContent?: React.ReactNode;
};
