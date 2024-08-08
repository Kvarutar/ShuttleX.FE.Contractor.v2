import {
  FreeTimeAlertProps,
  PaidTimeAlertProps,
  PlannedTripAlertProps,
  RideHasFinishedAlertProps,
} from 'shuttlex-integration';

export enum AlertPriority {
  Low = 0,
  High = 1,
  System = 2,
}

export type AlertData = {
  id: string;
  priority: AlertPriority;
};

export type FreeTimeAlertOptions = FreeTimeAlertProps;
export type PaidTimeAlertOptions = PaidTimeAlertProps;
export type RideHasFinishedAlertOptions = RideHasFinishedAlertProps;
export type PlannedTripAlertOptions = Omit<PlannedTripAlertProps, 'date' | 'locale' | 'onCancelPress'> & {
  date: string;
};

type AlertTypes =
  | { type: 'free_time_ends'; options: FreeTimeAlertOptions }
  | { type: 'paid_time_starts'; options: PaidTimeAlertOptions }
  | { type: 'ride_has_finished'; options: RideHasFinishedAlertOptions }
  | { type: 'second_ride' }
  | { type: 'internet_disconnected' };

export type AlertType = AlertData & AlertTypes;
export type AlertTypeWithOptionalId = Omit<AlertData, 'id'> & { id?: AlertData['id'] } & AlertTypes;

export type AlertsState = {
  list: AlertType[];
};
