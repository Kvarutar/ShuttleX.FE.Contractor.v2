import { useRef } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { useSelector } from 'react-redux';
import { TariffsCarImage, TariffType, Text, useTheme } from 'shuttlex-integration';

import { availableTariffsSelector } from '../../../core/contractor/redux/selectors';

const windowWidth = Dimensions.get('window').width;

const carouselAnimationDurations = {
  scroll: 500,
  opacity: 200,
};

const TariffsCarousel = () => {
  const carouselRef = useRef<ICarouselInstance>(null);
  const availableTariffs = useSelector(availableTariffsSelector);

  const computedStyles = StyleSheet.create({
    carouselWrapper: {
      width: windowWidth,
    },
    carousel: {
      width: windowWidth,
    },
  });

  if (availableTariffs.length === 0) {
    return;
  }

  if (availableTariffs.length > 1) {
    return (
      <View>
        <View style={[styles.carouselWrapper, computedStyles.carouselWrapper]}>
          <Carousel
            loop
            width={340}
            height={142}
            style={computedStyles.carousel}
            data={availableTariffs}
            scrollAnimationDuration={carouselAnimationDurations.scroll}
            ref={carouselRef}
            renderItem={({ item }) => <SliderItem item={item.name} smallText />}
          />
        </View>
      </View>
    );
  }

  return <SliderItem item={availableTariffs[0].name} />;
};

const SliderItem = ({ item, smallText }: { item: TariffType; smallText?: boolean }) => {
  const { colors } = useTheme();

  const computedStyles = StyleSheet.create({
    title: {
      color: colors.textPrimaryColor,
    },
    carouselItemWrapper: {
      borderColor: colors.borderColor,
    },
  });

  return (
    <View style={[styles.carouselItemWrapper, computedStyles.carouselItemWrapper]}>
      <Text style={[computedStyles.title, styles.title, smallText ? styles.smallTitle : {}]}>{item}</Text>
      <TariffsCarImage tariff={item} style={styles.carImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Inter Medium',
  },
  smallTitle: {
    fontSize: 14,
  },
  carouselWrapper: {
    flexDirection: 'row',
    paddingLeft: 24,
  },
  carouselItemWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: 332,
    borderWidth: 1,
    borderRadius: 12,
  },
  carImage: {
    height: 92,
    width: '100%',
  },
});

export default TariffsCarousel;
