import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { BottomWindowWithGesture } from 'shuttlex-integration';

import HiddenPart from './HiddenPart';
import { AchievementsPopupProps } from './props';

const AchievementsPopup = ({ setIsAchievementsPopupVisible, achievementsBottomWindowRef }: AchievementsPopupProps) => {
  useEffect(() => {
    achievementsBottomWindowRef.current?.openWindow();
  }, [achievementsBottomWindowRef]);

  return (
    <BottomWindowWithGesture
      withHiddenPartScroll={false}
      withShade
      ref={achievementsBottomWindowRef}
      hiddenPartStyle={styles.hiddenPartStyle}
      setIsOpened={setIsAchievementsPopupVisible}
      hiddenPart={<HiddenPart bottomWindowRef={achievementsBottomWindowRef} />}
    />
  );
};

const styles = StyleSheet.create({
  hiddenPartStyle: {
    paddingTop: 12,
  },
});

export default AchievementsPopup;
