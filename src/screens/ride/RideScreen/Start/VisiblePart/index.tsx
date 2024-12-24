import ProfileInfo from './ProfileInfo';
import Status from './Status';
import { VisiblePartProps } from './types';

const VisiblePart = ({
  isOpened,
  bottomWindowRef,
  setIsPreferencesPopupVisible,
  setIsAchievementsPopupVisible,
  lineState,
  setIsAccountIsNotActivePopupVisible,
}: VisiblePartProps) => {
  if (isOpened) {
    return (
      <ProfileInfo
        setIsAccountIsNotActivePopupVisible={setIsAccountIsNotActivePopupVisible}
        bottomWindowRef={bottomWindowRef}
        setIsAchievementsPopupVisible={setIsAchievementsPopupVisible}
        lineState={lineState}
      />
    );
  }
  return (
    <Status
      bottomWindowRef={bottomWindowRef}
      setIsPreferencesPopupVisible={setIsPreferencesPopupVisible}
      lineState={lineState}
    />
  );
};

export default VisiblePart;
