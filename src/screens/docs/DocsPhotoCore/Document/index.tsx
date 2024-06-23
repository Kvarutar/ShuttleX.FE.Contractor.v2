import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Bar, CloseIconMini, DocumentIcon, RoundButton, Text } from 'shuttlex-integration';

import { docsConsts } from '../props';
import { DocumentProps } from './props';

const Document = ({ selectedDocument, onCloseButtonPress }: DocumentProps) => {
  return (
    <Animated.View style={styles.barWrapper} entering={FadeIn.duration(docsConsts.fadeAnimationDuration)}>
      <Bar style={styles.bar}>
        <View style={styles.content}>
          <DocumentIcon />
          <Text style={styles.fileName}>{selectedDocument.name}</Text>
        </View>
        <RoundButton onPress={onCloseButtonPress} roundButtonStyle={styles.roundButton}>
          <CloseIconMini />
        </RoundButton>
      </Bar>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bar: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  barWrapper: {
    marginTop: 40,
    marginBottom: 10,
  },
  content: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  fileName: {
    fontFamily: 'Inter Medium',
  },
  roundButton: {
    width: 32,
    height: 32,
  },
});

export default Document;
