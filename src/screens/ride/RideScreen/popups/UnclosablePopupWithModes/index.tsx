import { useTranslation } from 'react-i18next';
import { UnclosablePopup } from 'shuttlex-integration';

import { UnclosablePopupInfo, UnclosablePopupModes, UnclosablePopupProps } from './props';

const popupInfo: UnclosablePopupInfo = {
  warning: {
    subTitle: 'ride_Ride_UnclosablePopup_warningSubtitle',
    title: 'ride_Ride_UnclosablePopup_warningTitle',
    secondTitle: null,
    description: 'ride_Ride_UnclosablePopup_warningDescription',
  },
  banned: {
    subTitle: 'ride_Ride_UnclosablePopup_bannedSubtitle',
    title: 'ride_Ride_UnclosablePopup_bannedTitle',
    secondTitle: null,
    description: 'ride_Ride_UnclosablePopup_bannedDescription',
  },
  accountIsNotActive: {
    subTitle: 'ride_Ride_UnclosablePopup_accountIsNotActiveSubtitle',
    title: 'ride_Ride_UnclosablePopup_accountIsNotActiveTitle',
    secondTitle: 'ride_Ride_UnclosablePopup_accountIsNotActiveSecondTitle',
    description: 'ride_Ride_UnclosablePopup_accountIsNotActiveDescription',
  },
  passengerPaidTripViaCash: {
    subTitle: null,
    title: 'ride_Ride_UnclosablePopup_paidViaCashTitle',
    secondTitle: null,
    description: 'ride_Ride_UnclosablePopup_paidViaCashSubTitle',
  },
};

const UnclosablePopupWithModes = ({
  mode = UnclosablePopupModes.Warning,
  bottomAdditionalContent,
}: UnclosablePopupProps) => {
  const { t } = useTranslation();
  return (
    <UnclosablePopup
      subTitle={t(popupInfo[mode].title ?? '')}
      title={t(popupInfo[mode].title || '')}
      secondTitle={t(popupInfo[mode].secondTitle || '')}
      description={t(popupInfo[mode].description || '')}
      bottomAdditionalContent={bottomAdditionalContent}
    />
  );
};

export default UnclosablePopupWithModes;
