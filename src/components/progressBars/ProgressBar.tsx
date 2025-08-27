import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { COLORS } from "../../constants";

type Props = {
  step: number;
  total: number;
};

const ProgressBar: React.FC<Props> = ({ step, total }) => {
  const progress = (step / total) * 100;

  // Animated value
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 400,
      useNativeDriver: false, // width animation cannot use native driver
    }).start();
  }, [progress]);

  const widthInterpolated = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.background}>
      <Animated.View
        style={[
          styles.fill,
          {
            width: widthInterpolated,
            borderTopRightRadius: progress < 100 ? 8 : 0,
            borderBottomRightRadius: progress < 100 ? 8 : 0,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    height: 6,
    backgroundColor: "#D9D9D9",
    borderRadius: 8,
    overflow: "hidden",
    marginVertical: 10,
  },
  fill: {
    height: "100%",
    backgroundColor: COLORS.primary[1],
  },
});

export default ProgressBar;
