import { useRef } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { useSelector } from 'react-redux';
import { sizes, TariffIconData, Text, useTariffsIcons, useTheme } from 'shuttlex-integration';

import {
  availableTariffsSelector,
  contractorStatusSelector,
  selectedTariffsSelector,
} from '../../../core/contractor/redux/selectors';

const windowWidth = Dimensions.get('window').width;
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

  const tariffsForRender = contractorStatus === 'offline' ? availableTariffs : selectedTariffs;

  const computedStyles = StyleSheet.create({
    carousel: {
      width: windowWidth,
      marginLeft: sizes.paddingHorizontal,
    },
  });

  if (tariffsForRender.length === 0) {
    return;
  }

  if (tariffsForRender.length > 1) {
    return (
      <View>
        <Carousel
          loop
          width={windowWidth - sizes.paddingHorizontal * 2} // width of SliderItem
          height={186} // height of SliderItem
          style={computedStyles.carousel}
          data={tariffsForRender}
          scrollAnimationDuration={carouselAnimationDurations.scroll}
          ref={carouselRef}
          renderItem={({ item }) => <SliderItem iconData={tariffsIconsData[item.name]} />}
        />
      </View>
    );
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
      height: isSingleItem ? 186 : undefined,
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
  carouselItemWrapper: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    marginRight: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingBottom: 28,
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
    paddingHorizontal: 28,
  },
  carImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 3,
    resizeMode: 'contain',
  },
});

export default TariffsCarousel;
