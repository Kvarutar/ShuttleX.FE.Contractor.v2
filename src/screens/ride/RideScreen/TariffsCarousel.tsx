import { useRef } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { useSelector } from 'react-redux';
import { TariffIconData, Text, useTariffsIcons, useTheme } from 'shuttlex-integration';

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
    carouselWrapper: {
      width: windowWidth,
    },
    carousel: {
      width: windowWidth,
    },
  });

  if (tariffsForRender.length === 0) {
    return;
  }

  if (tariffsForRender.length > 1) {
    return (
      <View>
        <View style={[styles.carouselWrapper, computedStyles.carouselWrapper]}>
          <Carousel
            loop
            width={340}
            height={142}
            style={computedStyles.carousel}
            data={tariffsForRender}
            scrollAnimationDuration={carouselAnimationDurations.scroll}
            ref={carouselRef}
            renderItem={({ item }) => <SliderItem iconData={tariffsIconsData[item.name]} smallText />}
          />
        </View>
      </View>
    );
  }

  return <SliderItem iconData={tariffsIconsData[tariffsForRender[0].name]} />;
};

const SliderItem = ({ iconData, smallText }: { iconData: TariffIconData; smallText?: boolean }) => {
  const { colors } = useTheme();
  const IconComponent = iconData.icon;

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
      <Text style={[computedStyles.title, styles.title, smallText ? styles.smallTitle : {}]}>{iconData.text}</Text>
      <IconComponent style={styles.carImage} />
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
