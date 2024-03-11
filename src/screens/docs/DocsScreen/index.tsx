import React from 'react';
import { useTranslation } from 'react-i18next';
import { ListRenderItem, Pressable, SafeAreaView, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  Bar,
  BarModes,
  BlueCheck1,
  FlatListWithCustomScroll,
  RoundButton,
  ShortArrowIcon,
  ShortArrowSmallIcon,
  sizes,
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
    container: {
      backgroundColor: colors.backgroundPrimaryColor,
    },
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
            <RoundButton roundButtonStyle={styles.roundButton}>
              <ShortArrowSmallIcon />
            </RoundButton>
          )}
        </Bar>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={[styles.container, computedStyles.container]}>
      <View style={[styles.header]}>
        <RoundButton onPress={navigation.goBack}>
          <ShortArrowIcon />
        </RoundButton>
        <Text style={[styles.headerTitle]}>{t('docs_Docs_headerTitle')}</Text>
        <View style={styles.headerDummy} />
      </View>
      <Bar>
        <Text style={styles.title}>{t('docs_Docs_explanationTitle', { name: 'John' })}</Text>
        <Text style={[styles.description, computedStyles.description]}>{t('docs_Docs_explanationDescription')}</Text>
      </Bar>
      <FlatListWithCustomScroll
        items={Object.entries(requirementDocumentsList)}
        renderItem={renderItem}
        style={styles.documentsWrapper}
        contentContainerStyle={styles.flatListContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: sizes.paddingHorizontal,
    paddingVertical: sizes.paddingVertical,
  },
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
});

export default DocsScreen;
