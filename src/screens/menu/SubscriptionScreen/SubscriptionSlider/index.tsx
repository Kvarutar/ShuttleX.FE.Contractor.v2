import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Image, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { Shadow } from 'react-native-shadow-2';
import { useSelector } from 'react-redux';
import { getCurrencySign, HeaderWithTwoTitles, ScrollViewWithCustomScroll, Text, useTheme } from 'shuttlex-integration';

import { DailyCarImage, DebtCarImage, MonthlyCarImage } from '../../../../../assets/images/subscriptionCars';
import { subscriptionsSelector } from '../../../../core/menu/redux/subscription/selectors';
import { GetSubscriptionsAPIResponse } from '../../../../core/menu/redux/subscription/types';

const windowWidth = Dimensions.get('window').width;
const itemHeight = 455;

const subscriptionImageData = {
  Daily: DailyCarImage,
  Debt: DebtCarImage,
  Monthly: MonthlyCarImage,
};

const SubscriptionSlider = () => {
  const sliderRef = useRef<ICarouselInstance>(null);

  const { colors } = useTheme();
  const { t } = useTranslation();

  const subscriptions = useSelector(subscriptionsSelector);

  const [currentIndex, setCurrentIndex] = useState(0);

  const computedStyles = StyleSheet.create({
    item: {
      backgroundColor: colors.backgroundPrimaryColor,
    },
    descriptionText: {
      color: colors.textSecondaryColor,
    },
  });

  const renderItem = useCallback(
    ({ item }: { item: GetSubscriptionsAPIResponse[0] }) => {
      const firstTitle = t(`menu_Subscription_titleFirst${item.subscriptionType}`);
      const secondTitle = t(`menu_Subscription_titleSecond${item.subscriptionType}`);
      const description = t(`menu_Subscription_description${item.subscriptionType}`, {
        price: `${getCurrencySign(item.currency)}${item.amount}`,
      });

      return (
        <Animated.View entering={FadeIn} style={[styles.item, computedStyles.item]}>
          <Shadow stretch distance={19} offset={[2, 2]} startColor={colors.weakShadowColor} />
          <View style={styles.itemContainer}>
            <View>
              <HeaderWithTwoTitles firstTitle={firstTitle} secondTitle={secondTitle} />
              <Image source={subscriptionImageData[item.subscriptionType]} style={styles.image} />
            </View>
            <ScrollViewWithCustomScroll
              contentContainerStyle={styles.scrollViewContentContainer}
              wrapperStyle={styles.scrollViewWrapper}
            >
              <Text style={styles.itemDescriptionText}>{description}</Text>
            </ScrollViewWithCustomScroll>
          </View>
        </Animated.View>
      );
    },
    [colors.weakShadowColor, computedStyles.item, t],
  );

  const handleDotPress = (index: number) => () => {
    setCurrentIndex(index);
    sliderRef.current?.scrollTo({ index, animated: true });
  };

  const renderDots = subscriptions.map((_, index) => {
    const renderDotsComputedStyles = StyleSheet.create({
      dot: {
        opacity: currentIndex === index ? 1 : 0.3,
        backgroundColor: colors.iconPrimaryColor,
      },
    });

    return (
      <Pressable onPress={handleDotPress(index)} hitSlop={5} key={index}>
        <View style={[styles.dot, renderDotsComputedStyles.dot]} />
      </Pressable>
    );
  });

  return (
    <View style={styles.wrapper}>
      <View style={styles.carouselContainer}>
        <Carousel
          ref={sliderRef}
          width={windowWidth}
          height={itemHeight}
          loop={false}
          onSnapToItem={setCurrentIndex}
          data={subscriptions}
          renderItem={renderItem}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.85,
            parallaxScrollingOffset: 40,
            parallaxAdjacentItemScale: 0.85,
          }}
        />
      </View>
      <View style={styles.dotsContainer}>{renderDots}</View>
      <Text style={[styles.descriptionText, computedStyles.descriptionText]}>{t('menu_Subscription_description')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 34,
  },
  carouselContainer: {
    height: itemHeight,
  },
  itemDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  scrollView: {
    maxHeight: 60,
  },
  dotsContainer: {
    gap: 10,
    flexDirection: 'row',
    marginTop: -12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 100,
  },
  item: {
    flex: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 28,
    justifyContent: 'space-between',
  },
  itemDescriptionText: {
    fontFamily: 'Inter Bold',
    fontSize: 15,
    lineHeight: 18,
    opacity: 0.6,
  },
  itemContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  image: {
    width: '95%',
    height: undefined,
    aspectRatio: 2,
    resizeMode: 'contain',
    marginTop: 30,
    alignSelf: 'center',
  },
  descriptionText: {
    fontFamily: 'Inter Medium',
    fontSize: 14,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 10,
  },
  scrollViewContentContainer: {
    justifyContent: 'flex-end',
    flexGrow: 1,
  },
  scrollViewWrapper: {
    marginRight: 5,
    maxHeight: 92,
  },
});

export default SubscriptionSlider;
