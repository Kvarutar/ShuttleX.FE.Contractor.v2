import { StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const timerAnimationDuration = 300;

const PassengerTimer = ({
  isPassengerLate,
  // Removed on Task-remove-timer-v1
  // setIsPassengerLate,
}: {
  isPassengerLate: boolean;
  setIsPassengerLate: () => void;
}) => {
  // Removed on Task-remove-timer-v1
  // const { colors } = useTheme();
  // const [currentTime, setCurrentTime] = useState<number>(0);

  // Removed on Task-remove-timer-v1
  // useEffect(() => {
  //   setCurrentTime(new Date().getTime() + 180000);
  // }, []);

  if (isPassengerLate) {
    return (
      <Animated.View
        exiting={FadeOut.duration(timerAnimationDuration)}
        entering={FadeIn.duration(timerAnimationDuration)}
        style={styles.additionalHeaderButtons}
      >
        {/* Removed on Task-remove-timer-v1 */}
        {/* Here was a TimerV1, but this component (PassengerTimer) is not in use for now.
        TODO: Check if this component is needed or remove it */}
        {/* <TimerV1
          initialDate={new Date()}
          startColor={colors.secondaryGradientStartColor}
          endColor={colors.secondaryGradientEndColor}
          mode={TimerV1Modes.Mini}
        /> */}
      </Animated.View>
    );
  } else {
    return (
      <Animated.View
        exiting={FadeOut.duration(timerAnimationDuration)}
        entering={FadeIn.duration(timerAnimationDuration)}
        style={styles.additionalHeaderButtons}
      >
        {/* Removed on Task-remove-timer-v1 */}
        {/* Here was a TimerV1, but this component (PassengerTimer) is not in use for now.
        TODO: Check if this component is needed or remove it */}
        {/* <TimerV1
          initialDate={new Date(currentTime)} //20000 - for test
          onAfterCountdownEnds={setIsPassengerLate}
          startColor={colors.primaryGradientStartColor}
          endColor={colors.primaryColor}
          mode={TimerV1Modes.Mini}
        /> */}
      </Animated.View>
    );
  }
};

const styles = StyleSheet.create({
  additionalHeaderButtons: {
    marginTop: 30,
  },
});

export default PassengerTimer;
