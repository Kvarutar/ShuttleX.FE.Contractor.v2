import { useTranslation } from 'react-i18next';
import { ListRenderItem, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import {
  Bar,
  BarModes,
  BlueCheck1,
  ButtonV1,
  ButtonV1Shapes,
  FlatListWithCustomScroll,
  SafeAreaView,
  ShortArrowIcon,
  ShortArrowSmallIcon,
  Text,
  useTheme,
} from 'shuttlex-integration';

import { requirementDocumentsListSelector } from '../../../core/auth/redux/docs/selectors';
import { RequirementDocs, RequirementDocsType } from '../../../core/auth/redux/docs/types';
import { DocsScreenProps } from './props';

const DocsScreen = ({ navigation }: DocsScreenProps): JSX.Element => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const requirementDocumentsList = useSelector(requirementDocumentsListSelector);

  const screensContent: Record<RequirementDocsType, { navFunc: () => void; title: string }> = {
    backgroundCheck: {
      navFunc: () => navigation.navigate('BackgroundCheck'),
      title: t('docs_Docs_backgroundCheck'),
    },
    profilePhoto: {
      navFunc: () => navigation.navigate('ProfilePhoto'),
      title: t('docs_Docs_profilePhoto'),
    },
    driversLicense: {
      navFunc: () => navigation.navigate('DriversLicense'),
      title: t('docs_Docs_driversLicense'),
    },
    vehicleInsurance: {
      navFunc: () => navigation.navigate('VehicleInsurance'),
      title: t('docs_Docs_vehicleInsurance'),
    },
    vehicleRegistration: {
      navFunc: () => navigation.navigate('VehicleRegistration'),
      title: t('docs_Docs_vehicleRegistration'),
    },
    vehicleInspection: {
      navFunc: () => navigation.navigate('VehicleInspection'),
      title: t('docs_Docs_vehicleInspection'),
    },
  };

  const computedStyles = StyleSheet.create({
    description: {
      color: colors.textSecondaryColor,
    },
  });

  const renderItem: ListRenderItem<[RequirementDocsType, RequirementDocs]> = ({ index, item }) => {
    const isComplete = item[1] !== null;

    return (
      <Pressable onPress={() => !isComplete && screensContent[item[0]].navFunc()}>
        <Bar mode={isComplete ? BarModes.Active : BarModes.Default} style={styles.bar} key={index}>
          <Text>{screensContent[item[0]].title}</Text>
          {isComplete ? (
            <BlueCheck1 />
          ) : (
            <ButtonV1 containerStyle={styles.roundButton} shape={ButtonV1Shapes.Circle}>
              <ShortArrowSmallIcon />
            </ButtonV1>
          )}
        </Bar>
      </Pressable>
    );
  };

  const isDocumentsCompleted = !Object.values(requirementDocumentsList).includes(null);

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <ButtonV1 onPress={navigation.goBack} shape={ButtonV1Shapes.Circle}>
          <ShortArrowIcon />
        </ButtonV1>
        <Text style={styles.headerTitle}>{t('docs_Docs_headerTitle')}</Text>
        <View style={styles.headerDummy} />
      </View>
      <Bar>
        <Text style={styles.title}>{t('docs_Docs_explanationTitle', { name: 'John' })}</Text>
        <Text style={[styles.description, computedStyles.description]}>{t('docs_Docs_explanationDescription')}</Text>
      </Bar>
      <FlatListWithCustomScroll
        items={Object.entries(requirementDocumentsList)}
        renderItem={renderItem}
        wrapperStyle={styles.documentsWrapper}
        contentContainerStyle={styles.flatListContainer}
        withShadow
      />
      {isDocumentsCompleted && (
        <Animated.View entering={FadeIn.duration(200)}>
          <ButtonV1
            text={t('docs_Docs_buttonNext')}
            style={styles.nextButton}
            onPress={() => navigation.navigate('Ride')}
          />
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  headerTitle: {
    fontFamily: 'Inter Medium',
    fontSize: 18,
  },
  headerDummy: {
    width: 50,
  },
  title: {
    fontFamily: 'Inter Medium',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  roundButton: {
    height: 28,
    width: 28,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  documentsWrapper: {
    marginTop: 40,
  },
  flatListContainer: {
    gap: 16,
  },
  nextButton: {
    marginTop: 20,
  },
});

export default DocsScreen;
