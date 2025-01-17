import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Button, LoadingSpinner, LoadingSpinnerIconModes, MenuHeader, SafeAreaView, Text } from 'shuttlex-integration';

import { isSubscriptionsLoadingSelector } from '../../../core/menu/redux/subscription/selectors';
import { getSubscriptions } from '../../../core/menu/redux/subscription/thunks';
import { useAppDispatch } from '../../../core/redux/hooks';
import Menu from '../../ride/Menu';
import SubscriptionSlider from './SubscriptionSlider';

const SubscriptionScreen = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const isSubscriptionLoading = useSelector(isSubscriptionsLoadingSelector);

  const [isMenuVisible, setIsMenuVisible] = useState(false);

  useEffect(() => {
    dispatch(getSubscriptions());
  }, [dispatch]);

  return (
    <>
      <SafeAreaView withTransparentBackground>
        <MenuHeader onMenuPress={() => setIsMenuVisible(true)} style={styles.menuHeader}>
          <Text>{t('menu_Subscription_headerTitle')}</Text>
        </MenuHeader>
        {isSubscriptionLoading ? (
          <LoadingSpinner iconMode={LoadingSpinnerIconModes.Large} />
        ) : (
          <View style={styles.container}>
            <SubscriptionSlider />
            <Button
              onPress={() => Linking.openURL('https://t.me/ShuttleX_Support')}
              text={t('menu_Subscription_supportButton')}
            />
          </View>
        )}
      </SafeAreaView>
      {isMenuVisible && <Menu onClose={() => setIsMenuVisible(false)} />}
    </>
  );
};

const styles = StyleSheet.create({
  menuHeader: {
    zIndex: -1,
  },
  container: {
    flex: 1,
  },
});

export default SubscriptionScreen;
