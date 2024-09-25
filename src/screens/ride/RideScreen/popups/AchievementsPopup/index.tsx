import { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { BottomWindowWithGesture, BottomWindowWithGestureRef } from 'shuttlex-integration';

import HiddenPart from './HiddenPart';
import { AchievementsPopupProps } from './props';

const AchievementsPopup = ({ setIsAchievementsPopupVisible }: AchievementsPopupProps) => {
  const bottomWindowRef = useRef<BottomWindowWithGestureRef>(null);

  useEffect(() => {
    bottomWindowRef.current?.openWindow();
  }, []);

  return (
    <BottomWindowWithGesture
      withHiddenPartScroll={false}
      withShade
      ref={bottomWindowRef}
      hiddenPartStyle={styles.hiddenPartStyle}
      setIsOpened={setIsAchievementsPopupVisible}
      hiddenPart={<HiddenPart bottomWindowRef={bottomWindowRef} />}
    />
  );
};

const styles = StyleSheet.create({
  hiddenPartStyle: {
    paddingTop: 12,
  },
});

export default AchievementsPopup;
