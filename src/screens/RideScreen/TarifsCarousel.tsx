import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import { Text, useTheme } from 'shuttlex-integration';

const carouselAnimationDurations = {
  scroll: 500,
  opacity: 200,
};

const imgHeight = 51;

const TarifsCarousel = ({ selectedTarifs }: { selectedTarifs: string[] }) => {
  const { colors } = useTheme();
  const [activeSlide, setActiveSlide] = useState(0);

  const computedStyles = StyleSheet.create({
    paginationActiveItem: {
      backgroundColor: colors.primaryColor,
    },
    paginationItem: {
      backgroundColor: colors.borderColor,
    },
    separator: {
      backgroundColor: colors.borderColor,
    },
  });

  const paginationItem = selectedTarifs.map((_, i) => (
    <PaginationItem key={i} internalIndex={i} activeSlideIndex={activeSlide} />
  ));

  return selectedTarifs.length > 1 ? (
    <View>
      <View style={styles.carouselWrapper}>
        <Carousel
          loop
          width={180}
          height={imgHeight}
          data={selectedTarifs}
          scrollAnimationDuration={carouselAnimationDurations.scroll}
          onSnapToItem={index => setActiveSlide(index)}
          renderItem={({ item, animationValue }) => <SliderItem item={item} animationValue={animationValue} />}
        />
        <View style={[styles.separator, computedStyles.separator]} />
      </View>
      <View style={styles.carouselPagination}>{paginationItem}</View>
    </View>
  ) : (
    <SliderItem item={selectedTarifs[0]} />
  );
};

const SliderItem = ({ item, animationValue }: { item: string; animationValue?: SharedValue<number> }) => {
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
      <Image source={require('shuttlex-integration/src/assets/img/BasicX.png')} style={styles.img} />
      <View style={styles.textWrapper}>
        <Text style={[computedStyles.title, styles.title]}>{item}</Text>
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
  img: {
    width: 80,
    height: imgHeight,
  },
  title: {
    fontFamily: 'Inter Medium',
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
  },
  carouselPaginationItem: {
    width: 17,
    height: 3,
    borderRadius: 50,
  },
  separator: {
    width: 1,
    height: '100%',
    borderRadius: 100,
  },
});

export default TarifsCarousel;
