import React, { useEffect, useState } from 'react';
import { Image, ListRenderItem, Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Bar, BlueCheck1, FlatListWithCustomScroll, sizes, Text } from 'shuttlex-integration';

const RidePreferences = ({ tarifs }: { tarifs: string[] }) => {
  const [modes, setModes] = useState<boolean[]>(new Array(tarifs.length).fill(false));
  const [itemHeight, setItemHeight] = useState(0);

  useEffect(() => {}, [modes, tarifs]);

  const onPressHandler = (i: number) => {
    const newModes = [...modes];
    newModes[i] = !newModes[i];
    setModes(newModes);
  };

  const renderTarifs: ListRenderItem<string> = ({ item, index }) => {
    let listItemComputedStyles: StyleProp<ViewStyle> = StyleSheet.create({});

    if (index === 0) {
      listItemComputedStyles = {
        paddingTop: sizes.paddingHorizontal,
      };
    } else if (index === tarifs.length - 1) {
      listItemComputedStyles = {
        paddingBottom: sizes.paddingHorizontal,
      };
    }
    return (
      <Pressable
        key={index}
        style={[styles.preference, listItemComputedStyles]}
        onPress={() => onPressHandler(index)}
        onLayout={e => (index === 0 ? setItemHeight(e.nativeEvent.layout.height) : {})}
      >
        <Bar isActive={modes[index]} style={styles.bar}>
          <View style={styles.preferenceContent}>
            <Image source={require('shuttlex-integration/src/assets/img/BasicX.png')} style={styles.img} />
            <Text>{item}</Text>
          </View>
          {modes[index] && <BlueCheck1 />}
        </Bar>
      </Pressable>
    );
  };

  return (
    <View style={styles.preferenceWrapper}>
      <FlatListWithCustomScroll renderItems={renderTarifs} items={tarifs} itemHeight={itemHeight} />
    </View>
  );
};

const styles = StyleSheet.create({
  preference: {
    paddingHorizontal: sizes.paddingHorizontal,
    paddingBottom: 16,
  },
  preferenceContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  preferenceWrapper: {
    maxHeight: 380,
    position: 'relative',
  },
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  img: {
    width: 90,
    height: 57,
    marginRight: 24,
  },
});

export default RidePreferences;
