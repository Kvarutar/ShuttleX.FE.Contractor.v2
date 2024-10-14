import { StyleSheet } from 'react-native';
import { Text, useTheme } from 'shuttlex-integration';

const BalancePerDayText = ({ title, sumPerDay }: { title: string; sumPerDay: number }) => {
  const { colors } = useTheme();
  const computedStyles = StyleSheet.create({
    container: {
      color: colors.textPrimaryColor,
      opacity: sumPerDay === 0 ? 0.3 : 0.6,
    },
  });
  return <Text style={[styles.container, computedStyles.container]}>{title}</Text>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Inter Medium',
    letterSpacing: -0.52,
    textAlign: 'center',
    fontSize: 12,
  },
});

export default BalancePerDayText;
