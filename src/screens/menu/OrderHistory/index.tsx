import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { MenuHeader, SafeAreaView, sizes, Skeleton, Text, useTheme } from 'shuttlex-integration';

import { clearOrdersHistory } from '../../../core/contractor/redux';
import {
  isOrdersHistoryLoadingSelector,
  isOrdersHistoryOffsetEmptySelector,
  ordersHistorySelector,
} from '../../../core/contractor/redux/selectors';
import { getOrdersHistory } from '../../../core/contractor/redux/thunks';
import { OrderWithTariffInfo } from '../../../core/contractor/redux/types';
import { useAppDispatch } from '../../../core/redux/hooks';
import Menu from '../../ride/Menu';
import OrderHistoryBar from './RecentAddressesBar';

const numberOfOrders = 10;

const OrderHistoryScreen = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const ordersHistory = useSelector(ordersHistorySelector);
  const isOrdersHistoryLoading = useSelector(isOrdersHistoryLoadingSelector);
  const isOrdersHistoryOffsetEmpty = useSelector(isOrdersHistoryOffsetEmptySelector);
  const [offset, setOffset] = useState(1);

  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const computedStyles = StyleSheet.create({
    emptyText: {
      color: colors.textSecondaryColor,
    },
  });

  useEffect(() => {
    dispatch(getOrdersHistory({ offset: 0, amount: numberOfOrders }));
    return () => {
      dispatch(clearOrdersHistory());
    };
  }, [dispatch]);

  const loadHistory = () => {
    if (!isOrdersHistoryLoading && !isOrdersHistoryOffsetEmpty) {
      dispatch(getOrdersHistory({ offset: offset, amount: numberOfOrders }));
      setOffset(value => value + 1);
    }
  };

  const renderItem = ({ item }: { item: OrderWithTariffInfo }) => <OrderHistoryBar key={item.id} order={item} />;

  const renderFooter = () => {
    if (isOrdersHistoryLoading) {
      return <Skeleton skeletonsAmount={6} skeletonContainerStyle={styles.skeletonOrderHistory} />;
    }
    return null;
  };

  const renderContent = () => {
    if (!isOrdersHistoryLoading && ordersHistory.length === 0) {
      return (
        <View style={styles.emptyWrapper}>
          <Text style={[styles.emptyText, computedStyles.emptyText]}>{t('menu_OrderHistory_empty')}</Text>
        </View>
      );
    }
    return (
      <FlatList
        data={ordersHistory}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        ListFooterComponent={renderFooter}
        onEndReached={loadHistory}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.orderHistoryContainer}
      />
    );
  };

  return (
    <>
      <SafeAreaView>
        <MenuHeader onMenuPress={() => setIsMenuVisible(true)}>
          <Text style={styles.headerText}>{t('menu_OrderHistory_title')}</Text>
        </MenuHeader>
        <View style={styles.orderHistoryWrapper}>{renderContent()}</View>
      </SafeAreaView>
      {isMenuVisible && <Menu onClose={() => setIsMenuVisible(false)} />}
    </>
  );
};

const styles = StyleSheet.create({
  skeletonOrderHistory: {
    height: 120,
    borderRadius: 12,
    paddingBottom: 8,
  },
  headerText: {
    fontSize: 17,
    fontFamily: 'Inter Medium',
  },
  orderHistoryWrapper: {
    paddingTop: 30,
    flex: 1,
  },
  orderHistoryContainer: {
    flexGrow: 1,
    gap: 8,
  },
  emptyWrapper: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: sizes.paddingHorizontal,
  },
  emptyText: {
    fontSize: 20,
    fontFamily: 'Inter Medium',
    textAlign: 'center',
  },
});

export default OrderHistoryScreen;
