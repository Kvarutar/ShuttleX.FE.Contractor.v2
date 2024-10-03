import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Bar, BarModes, CloseIconMini, DocumentIcon, Text, TextElipsizeMode } from 'shuttlex-integration';

import { docsConsts } from '../props';
import { DocumentProps } from './props';

const Document = ({ selectedDocument, onCloseButtonPress }: DocumentProps) => {
  return (
    <Animated.View entering={FadeIn.duration(docsConsts.fadeAnimationDuration)}>
      <Bar style={styles.bar} mode={BarModes.Disabled}>
        <View style={styles.content}>
          <DocumentIcon />
          <Text style={styles.fileName} numberOfLines={1} elipsizeMode={TextElipsizeMode.Middle}>
            {selectedDocument.name}
          </Text>
        </View>
        <Pressable style={styles.closeButton} onPress={onCloseButtonPress}>
          <CloseIconMini />
        </Pressable>
      </Bar>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bar: {
    height: 64,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  fileName: {
    fontFamily: 'Inter Medium',
    fontSize: 14,
    flexShrink: 1,
  },
  closeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
  },
});

export default Document;
