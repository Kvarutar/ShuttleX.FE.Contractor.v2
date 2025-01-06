import { useRef } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Carousel, { CarouselRenderItem, ICarouselInstance } from 'react-native-reanimated-carousel';
import { useSelector } from 'react-redux';
import { sizes, Skeleton, TariffIconData, Text, useTariffsIcons, useTheme } from 'shuttlex-integration';

import {
  availableTariffsSelector,
  contractorStatusSelector,
  isTariffsInfoLoadingSelector,
  selectedTariffsSelector,
} from '../../../core/contractor/redux/selectors';
import { TariffInfoFromAPI } from '../../../core/contractor/redux/types';

const windowWidth = Dimensions.get('window').width;

const sliderItemParams = {
  width: windowWidth - sizes.paddingHorizontal * 2,
  height: 186,
};

const carouselAnimationDurations = {
  scroll: 500,
  opacity: 200,
};

const TariffsCarousel = () => {
  const tariffsIconsData = useTariffsIcons();
  const carouselRef = useRef<ICarouselInstance>(null);
  const availableTariffs = useSelector(availableTariffsSelector);
  const selectedTariffs = useSelector(selectedTariffsSelector);
  const contractorStatus = useSelector(contractorStatusSelector);

  const isTariffsInfoLoading = useSelector(isTariffsInfoLoadingSelector);

  const tariffsForRender = contractorStatus === 'offline' ? availableTariffs : selectedTariffs;

  const computedStyles = StyleSheet.create({
    carousel: {
      width: windowWidth,
      marginLeft: sizes.paddingHorizontal,
    },
  });

  const renderCarousel = (data: TariffInfoFromAPI[], renderItem: CarouselRenderItem<TariffInfoFromAPI>) => {
    return (
      <Carousel
        loop
        width={sliderItemParams.width} // width of SliderItem
        height={sliderItemParams.height} // height of SliderItem
        style={computedStyles.carousel}
        data={data}
        scrollAnimationDuration={carouselAnimationDurations.scroll}
        ref={carouselRef}
        renderItem={renderItem}
      />
    );
  };

  if (isTariffsInfoLoading || tariffsForRender.length === 0) {
    return renderCarousel(Array.from({ length: 6 }), ({ index }) => (
      <Skeleton key={index} skeletonContainerStyle={styles.skeleton} />
    ));
  }

  if (tariffsForRender.length > 1) {
    return renderCarousel(tariffsForRender, ({ item }) => <SliderItem iconData={tariffsIconsData[item.name]} />);
  }

  return <SliderItem iconData={tariffsIconsData[tariffsForRender[0].name]} isSingleItem />;
};

const SliderItem = ({ iconData, isSingleItem }: { iconData: TariffIconData; isSingleItem?: boolean }) => {
  const { colors } = useTheme();
  const IconComponent = iconData.icon;

  const computedStyles = StyleSheet.create({
    title: {
      color: colors.textPrimaryColor,
    },
    carouselItemWrapper: {
      borderColor: colors.borderColor,
      marginRight: isSingleItem ? sizes.paddingHorizontal : 8,
      marginLeft: isSingleItem ? sizes.paddingHorizontal : 0,
      height: isSingleItem ? sliderItemParams.height : undefined,
    },
  });

  return (
    <View style={[styles.carouselItemWrapper, computedStyles.carouselItemWrapper]}>
      <Text style={[computedStyles.title, styles.title]}>{iconData.text}</Text>
      <View style={styles.carImageContainer}>
        <IconComponent style={styles.carImage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    flex: 1,
    borderRadius: 12,
    width: windowWidth - sizes.paddingHorizontal * 2 - 8,
  },
  carouselItemWrapper: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    marginRight: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingBottom: 16,
  },
  title: {
    alignSelf: 'flex-start',
    fontFamily: 'Inter Medium',
    fontSize: 17,
    lineHeight: 22,
  },
  carImageContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  carImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 3,
    resizeMode: 'contain',
  },
});

export default TariffsCarousel;
