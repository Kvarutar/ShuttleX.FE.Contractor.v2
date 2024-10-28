import ProfileInfo from './ProfileInfo';
import Status from './Status';
import { VisiblePartProps } from './types';

const VisiblePart = ({
  isOpened,
  bottomWindowRef,
  setIsPreferencesPopupVisible,
  setIsAchievementsPopupVisible,
  lineState,
}: VisiblePartProps) => {
  if (isOpened) {
    return (
      <ProfileInfo
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
