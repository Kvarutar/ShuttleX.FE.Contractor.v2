import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from 'shuttlex-integration';

import Navigate from './Navigate';

const App = (): JSX.Element => (
  <ThemeProvider>
    <GestureHandlerRootView style={styles.gestureHandlerRootView}>
      <Navigate />
    </GestureHandlerRootView>
  </ThemeProvider>
);

const styles = StyleSheet.create({
  gestureHandlerRootView: {
    flex: 1,
  },
});

export default App;
