import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { ContainedButton, GroupedBrandIcon, TextButton } from 'shuttlex-integration';

const AuthScreen = (): JSX.Element => (
  <View style={styles.container}>
    <View style={styles.groupedBrandIconContainer}>
      <GroupedBrandIcon />
      <Text style={styles.titleApp}>Driver App</Text>
    </View>

    <View style={styles.buttonsContainer}>
      <ContainedButton
        text="Get started" //TODO: Adjust after implement https://www.notion.so/shuttlex/React-Native-Paper-Theme-setup-d194000d1d594e688831b0e5d81cf038
        style={styles.containedButton} //TODO: Adjust after implement https://www.notion.so/shuttlex/React-Native-Paper-Theme-setup-d194000d1d594e688831b0e5d81cf038
      />
      <TextButton
        text="I already have an account" //TODO: Adjust after implement https://www.notion.so/shuttlex/React-Native-Paper-Theme-setup-d194000d1d594e688831b0e5d81cf038
        style={styles.textButton} //TODO: Adjust after implement https://www.notion.so/shuttlex/React-Native-Paper-Theme-setup-d194000d1d594e688831b0e5d81cf038
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 34,
  },
  containedButton: {
    width: 374,
    height: 48,
  },
  textButton: {
    width: 374,
    height: 48,
  },
  buttonsContainer: {
    gap: 10,
  },
  groupedBrandIconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 22,
  },
  titleApp: {
    textTransform: 'uppercase',
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
    letterSpacing: 0.64,
  },
});

export default AuthScreen;
