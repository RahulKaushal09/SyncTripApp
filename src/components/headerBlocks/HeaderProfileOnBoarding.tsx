import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { COLORS } from "../../constants";
// import { Ionicons } from '@expo/vector-icons';

type Props = {
  onBack?: () => void;
  showSkip?: boolean;
  onSkip?: () => void;
};

const Header: React.FC<Props> = ({ onBack, showSkip, onSkip }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn}>
        {/* <Ionicons name="arrow-back" size={24} color="black" /> */}
        <Image source={require('../../assets/images/arrow-left.png')} style={{width:24, height:24}} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onSkip}>
        <Text style={styles.skip}>Skip &gt;</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10,height:60,paddingHorizontal:20 },
  backBtn: { padding: 5 },
  skip: { fontSize: 16, color: COLORS.secondary[1] },
});

export default Header;
