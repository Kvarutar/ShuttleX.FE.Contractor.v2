export type AddressWithMetaProps = {
  tripPoints: string[];
  startTime: number | null;
  endTime: number;
};

export type AddressWithPassengerAndOrderInfoProps = {
  tripPoints: string[];
  withGoogleMapButton?: boolean;
  isWaiting?: boolean;
  timeForTimer: number;
  setWaitingTime?: (newState: number) => void;
};
