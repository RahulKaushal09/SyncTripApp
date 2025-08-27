// AnimatedToggleSwitch.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  LayoutChangeEvent,
} from "react-native";
import { COLORS } from "../../../constants";

type Props = {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  height?: number;
  width?: number;
  borderRadius?: number;
  animationDuration?: number;
};

const AnimatedToggleSwitch: React.FC<Props> = ({
  options,
  value,
  onChange,
  height = 50,
  width = 80,
  borderRadius = 8,
  animationDuration = 180,
}) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  // selected index
  const index = Math.max(0, options.indexOf(value));

  useEffect(() => {
    if (!containerWidth) return;
    const toValue = (containerWidth / options.length) * index;
    Animated.timing(translateX, {
      toValue,
      duration: animationDuration,
      useNativeDriver: true,
    }).start();
  }, [value, containerWidth, options.length, animationDuration, index]);

  const onLayout = (e: LayoutChangeEvent) =>
    setContainerWidth(e.nativeEvent.layout.width);

  const optionWidth = width;

  // dynamic border radius based on position
  const getIndicatorRadius = () => {
    const radiusStyle: any = {};
    if (index === 0) {
      // leftmost → round left only
      radiusStyle.borderTopLeftRadius = borderRadius;
      radiusStyle.borderBottomLeftRadius = borderRadius;
      radiusStyle.borderTopRightRadius = 0;
      radiusStyle.borderBottomRightRadius = 0;
    } else if (index === options.length - 1) {
      // rightmost → round right only
      radiusStyle.borderTopRightRadius = borderRadius;
      radiusStyle.borderBottomRightRadius = borderRadius;
      radiusStyle.borderTopLeftRadius = 0;
      radiusStyle.borderBottomLeftRadius = 0;
    } else {
      // middle → no rounding
      radiusStyle.borderRadius = 0;
    }
    return radiusStyle;
  };

  return (
    <View
      style={[
        styles.container,
        { height, borderRadius: 10, borderColor: COLORS.primary[1] },
      ]}
      onLayout={onLayout}
    >
      {/* sliding indicator */}
      {containerWidth > 0 && (
        <Animated.View
          style={[
            styles.indicator,
            {
              width: optionWidth,
              height,
              backgroundColor: COLORS.primary[1],
              transform: [{ translateX }],
              ...getIndicatorRadius(),
            },
          ]}
        />
      )}

      {/* options */}
      {options.map((option) => {
        const selected = option === value;
        return (
          <TouchableOpacity
            key={option}
            activeOpacity={0.85}
            onPress={() => onChange(option)}
            style={[
              styles.option,
              { width: optionWidth || undefined, height },
            ]}
          >
            <Text
              numberOfLines={1}
              style={[
                styles.optionText,
                selected ? styles.optionTextSelected : null,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderWidth: 1,
    overflow: "hidden",
    position: "relative",
  },
  indicator: {
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 0,
  },
  option: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    paddingHorizontal: 12,
  },
  optionText: {
    fontSize: 14,
    color: COLORS.primary[1],
    fontWeight: "500",
  },
  optionTextSelected: {
    color: COLORS.base.white,
    fontWeight: "600",
  },
});

export default AnimatedToggleSwitch;
