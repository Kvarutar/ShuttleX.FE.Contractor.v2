import { StyleSheet, View } from 'react-native';
import { HeaderWithTwoTitles, Text, useTheme } from 'shuttlex-integration';

import { VerificationHeaderProps } from './props';

const VerificationHeader = ({
  windowTitle,
  firstHeaderTitle,
  secondHeaderTitle,
  description,
  containerStyle,
}: VerificationHeaderProps) => {
  const { colors } = useTheme();

  const computedStyles = StyleSheet.create({
    windowTitle: {
      color: colors.textTitleColor,
    },
    description: {
      color: colors.textSecondaryColor,
    },
  });

  return (
    <View style={containerStyle}>
      <Text style={[styles.windowTitle, computedStyles.windowTitle]}>{windowTitle}</Text>
      <HeaderWithTwoTitles firstTitle={firstHeaderTitle} secondTitle={secondHeaderTitle} />
      <Text style={[styles.description, computedStyles.description]}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  windowTitle: {
    fontFamily: 'Inter Bold',
    fontSize: 14,
    marginBottom: 14,
  },
  description: {
    maxWidth: 300,
    fontFamily: 'Inter Medium',
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
  },
});

export default VerificationHeader;
