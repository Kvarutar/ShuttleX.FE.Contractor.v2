export type AddressWithMetaProps = {
  tripPoints: string[];
};

export type AddressWithPassengerAndOrderInfoProps = {
  tripPoints: string[];
  withGoogleMapButton?: boolean;
  isWaiting?: boolean;
  timeForTimer: number;
  setWaitingTime?: (newState: number) => void;
};
