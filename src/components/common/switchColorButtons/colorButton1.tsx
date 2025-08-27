import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import { COLORS } from "../../../constants";

interface ColorButton1Props {
  onPress?: () => void; // ✅ parent decides what happens
  text:string;
    isSelected?: boolean; // ✅ controlled selection state
    IconPath?:string;
}

const ColorButton1: React.FC<ColorButton1Props> = ({ onPress, text, IconPath, isSelected }) => {
  const [isToggled, setIsToggled] = useState(false);


  return (
    <TouchableOpacity
      style={[styles.button, isSelected ? styles.buttonOn : styles.buttonOff,{ alignSelf: "flex-start" }]}
      onPress={onPress}
    //   activeOpacity={0.8}
          

    >
        {IconPath && (<Image source={{uri:IconPath}} style={{width:20, height:20, marginBottom:4}} />)}
      <Text style={[styles.text, isToggled ? styles.textOn : styles.textOff]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 25,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonOn: {
    backgroundColor: COLORS.primary[1] + "19", // light background
    borderColor: COLORS.primary[1],
  },
  buttonOff: {
    backgroundColor: COLORS.base.white,
    borderColor: COLORS.base.gray,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  textOn: {
    color: COLORS.primary[1],
  },
  textOff: {
    color: COLORS.base.gray,
  },
});

export default ColorButton1;
