import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { useSelector } from 'react-redux';
import { Separator, TariffsCarImage, TariffType, Text, useTheme } from 'shuttlex-integration';

import { preferredTariffsSelector } from '../../../core/contractor/redux/selectors';

const carouselAnimationDurations = {
  scroll: 500,
  opacity: 200,
};

const TarifsCarousel = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const prefferedTariffs = useSelector(preferredTariffsSelector);
  const carouselRef = useRef<ICarouselInstance>(null);

  useEffect(() => {
    carouselRef.current?.scrollTo({ count: -carouselRef.current?.getCurrentIndex() });
    setActiveSlide(0);
  }, [prefferedTariffs]);

  const paginationItem = prefferedTariffs.map((_, i) => (
    <PaginationItem key={i} internalIndex={i} activeSlideIndex={activeSlide} />
  ));

  return prefferedTariffs.length > 1 ? (
    <View>
      <View style={styles.carouselWrapper}>
        <Carousel
          loop
          width={180}
          height={64}
          data={prefferedTariffs}
          scrollAnimationDuration={carouselAnimationDurations.scroll}
          onSnapToItem={index => setActiveSlide(index)}
          ref={carouselRef}
          renderItem={({ item, animationValue }) => (
            <SliderItem item={item} animationValue={animationValue} smallText />
          )}
        />
        <Separator mode="vertical" style={styles.separator} />
      </View>
      <View style={styles.carouselPagination}>{paginationItem}</View>
    </View>
  ) : (
    <SliderItem item={prefferedTariffs[0]} />
  );
};

const SliderItem = ({
  item,
  animationValue,
  smallText,
}: {
  item: TariffType;
  animationValue?: SharedValue<number>;
  smallText?: boolean;
}) => {
  const { colors } = useTheme();

  const computedStyles = StyleSheet.create({
    title: {
      color: colors.textPrimaryColor,
    },
  });

  const carouselItemWrapper = useAnimatedStyle(() => {
    const opacity = animationValue && interpolate(animationValue.value, [-1, 0, 1], [0, 1, 0]);

    return { opacity };
  }, [animationValue]);

  return (
    <Animated.View style={[styles.carouselItemWrapper, animationValue && carouselItemWrapper]}>
      <TariffsCarImage tariff={item} />
      <View style={styles.textWrapper}>
        <Text style={[computedStyles.title, styles.title, smallText ? styles.smallTitle : {}]}>{item}</Text>
      </View>
    </Animated.View>
  );
};

const PaginationItem = ({ internalIndex, activeSlideIndex }: { internalIndex: number; activeSlideIndex: number }) => {
  const { colors } = useTheme();
  const paginationBackgroundAnimation = useSharedValue(0);

  useEffect(() => {
    if (activeSlideIndex === internalIndex) {
      paginationBackgroundAnimation.value = withTiming(1 - paginationBackgroundAnimation.value, {
        duration: carouselAnimationDurations.opacity,
      });
    } else {
      paginationBackgroundAnimation.value = withTiming(0, { duration: carouselAnimationDurations.opacity });
    }
  }, [activeSlideIndex, internalIndex, paginationBackgroundAnimation]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      paginationBackgroundAnimation.value,
      [0, 1],
      [colors.borderColor, colors.primaryColor],
    ),
  }));

  return <Animated.View style={[styles.carouselPaginationItem, animatedStyle]} />;
};

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Inter Medium',
  },
  smallTitle: {
    fontSize: 14,
  },
  textWrapper: {
    marginRight: 20,
    marginLeft: 2,
  },
  carouselWrapper: {
    flexDirection: 'row',
  },
  carouselItemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  carouselPagination: {
    flexDirection: 'row',
    gap: 13,
    justifyContent: 'center',
    marginTop: 4,
  },
  carouselPaginationItem: {
    width: 17,
    height: 3,
    borderRadius: 50,
  },
  separator: {
    flex: 0,
  },
});

export default TarifsCarousel;
