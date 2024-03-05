import React from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Feedback, FeedbackType, sizes, useTheme } from 'shuttlex-integration';

import { RatingScreenProps } from './props';

const RatingScreen = ({ navigation }: RatingScreenProps): JSX.Element => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const computedStyles = StyleSheet.create({
    container: {
      backgroundColor: colors.backgroundPrimaryColor,
    },
  });

  const onSendFeedback = (feedback: FeedbackType) => {
    console.log(feedback);
  };

  return (
    <SafeAreaView style={[styles.container, computedStyles.container]}>
      <Feedback
        onBackButtonPress={() => navigation.goBack()}
        title={t('ride_Rating_Feedback_title', { name: 'John' })}
        userImageUrl="https://sun9-34.userapi.com/impg/ZGuJiFBAp-93En3yLK7LWZNPxTGmncHrrtVgbg/hd6uHaUv1zE.jpg?size=1200x752&quality=96&sign=e79799e4b75c839d0ddb1a2232fe5d60&type=album"
        onSendFeedback={onSendFeedback}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: sizes.paddingHorizontal,
    paddingVertical: sizes.paddingVertical,
    justifyContent: 'space-between',
  },
});

export default RatingScreen;
