import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { COLORS } from "../../../constants";

interface Props {
  title: string;
  subtitle: string;
  active?: boolean;
  onPress?: () => void;
}

const ColorSubDescriptiveButton: React.FC<Props> = ({
  title,
  subtitle,
  active = false,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, active ? styles.active : styles.inactive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View>
        <Text style={[styles.title, active ? styles.titleActive : styles.titleInactive]}>
          {title}
        </Text>
        <Text
          style={[
            styles.subtitle,
            active ? styles.subtitleActive : styles.subtitleInactive,
          ]}
        >
          {subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    width: "100%",
    marginBottom: 5,
  },
  active: {
    borderColor: COLORS.primary[1],
    backgroundColor: COLORS.primary[1],
  },
  inactive: {
    borderColor: COLORS.primary[1] + "19",
    backgroundColor: COLORS.base.white,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  titleActive: {
    color: COLORS.base.white,
  },
  titleInactive: {
    color: COLORS.secondary[1],
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  subtitleActive: {
    color: COLORS.base.white,
  },
  subtitleInactive: {
    color: COLORS.base.gray,
  },
});

export default ColorSubDescriptiveButton;
