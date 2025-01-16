export enum AccountIsNotActivePopupModes {
  Default = 'default',
  Confirm = 'confirm',
}

export type AccountIsNotActivePopupProps = {
  setIsAccountIsNotActivePopupVisible: (newState: boolean) => void;
  onPressLaterHandler?: () => void;
  mode?: AccountIsNotActivePopupModes;
};
