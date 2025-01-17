export enum AccountIsNotActivePopupModes {
  FirstUse = 'firstUse',
  Confirm = 'confirm',
  AfterUse = 'afterUse',
}

export type AccountIsNotActivePopupProps = {
  setIsAccountIsNotActivePopupVisible: (newState: boolean) => void;
  onPressLaterHandler?: () => void;
  mode?: AccountIsNotActivePopupModes;
};
