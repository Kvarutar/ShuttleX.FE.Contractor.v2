import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Button, GroupedBrandIcon, sizes, Text, useTheme } from 'shuttlex-integration';

const AuthScreen = (): JSX.Element => {
  const { colors } = useTheme();

  const computedStyles = StyleSheet.create({
    container: {
      backgroundColor: colors.backgroundPrimaryColor,
    },
  });

  return (
    <View style={[styles.container, computedStyles.container]}>
      <View style={styles.groupedBrandIconContainer}>
        <GroupedBrandIcon />
        <Text style={styles.titleApp}>Driver App</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <Button
          text="Get started" // TODO: Adjust after implementing https://www.notion.so/shuttlex/i18n-install-library-to-support-i18n-77e236ccfc344d67b9d370e400d45557
        />
        <Pressable style={styles.alreadyHaveAccountContainer} onPress={() => {}} hitSlop={20}>
          {/* // TODO: Adjust after implementing https://www.notion.so/shuttlex/i18n-install-library-to-support-i18n-77e236ccfc344d67b9d370e400d45557 */}
          <Text style={styles.alreadyHaveAccountText}>I already have an account</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: sizes.paddingHorizontal,
    paddingVertical: sizes.paddingVertical,
  },
  groupedBrandIconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
  },
  titleApp: {
    textTransform: 'uppercase',
    fontFamily: 'Inter SemiBold',
  },
  buttonsContainer: {
    gap: 28,
  },
  alreadyHaveAccountContainer: {
    alignSelf: 'center',
  },
  alreadyHaveAccountText: {
    fontFamily: 'Inter Medium',
  },
});

export default AuthScreen;
