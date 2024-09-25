import { StyleSheet } from 'react-native';
import { Path, Svg } from 'react-native-svg';
import { useTheme } from 'shuttlex-integration';

const CompleteYourProfile = () => {
  const { colors } = useTheme();

  const svgColor = colors.iconPrimaryColor;

  return (
    <Svg style={styles.icon} viewBox="0 0 16 20" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.5049 5.063C12.5049 8.258 10.573 11 8.00043 11C5.42585 11 3.49591 8.258 3.49591 5.062C3.49591 1.868 5.15758 0 8.00043 0C10.8433 0 12.5049 1.867 12.5049 5.063ZM0.0945021 18.142C0.479889 18.6 2.13955 20 8.00043 20C13.8613 20 15.52 18.6 15.9064 18.143C15.9788 18.0542 16.0114 17.9396 15.9965 17.826C15.9084 16.944 15.1136 13 8.00043 13C0.887298 13 0.0925001 16.944 0.00341076 17.826C-0.0112411 17.9397 0.0217163 18.0544 0.0945021 18.143V18.142Z"
        fill={svgColor}
      />
    </Svg>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 16,
    height: 20,
  },
});

export default CompleteYourProfile;
