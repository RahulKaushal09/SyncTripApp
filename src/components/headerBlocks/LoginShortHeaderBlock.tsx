// LoginHeaderBlock.js
import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, ImageBackground, Pressable } from "react-native";
import LinearGradient from "react-native-linear-gradient";

import { styles } from "../../screens/auth/LoginScreen.styles";
import { COLORS, ImagePaths, STRINGS } from "../../constants";
type Props = {
//   isFocused: boolean;
showSkip?: boolean;
handleSkip?: () => void;
};

const LoginShortHeaderBlock: React.FC<Props> = ({handleSkip = () => {}, showSkip = false }) => {


const localStyles = StyleSheet.create({
    animatedGradientStyle:{
        paddingHorizontal: 20,
        height: "100%", // fallback collapsed height
    },
    textBoxStyle:{
        position: 'absolute',
        top: 20,
        // display:'flex',
        // justifyContent: 'center',
        // alignItems: 'center',
        alignSelf: 'center',
    },
    logoStyle:{
        position: 'absolute',
        // position: logoFocused.value === 1 ? 'absolute' : 'relative', // switch at focus
        top: 20,
        left: 5,
        transform: [
            // { translateX: 0 }, // half of logo width (to center it)
            // { translateY: -33 }, // half of logo height (to center it)
            { scale: 0.7 },
        ],
    },
      headerStyle: {
        height: 120,
      },
      
    });

  return(
    <View style={[styles.headerBlock, localStyles.headerStyle]}>
    <ImageBackground
        source={require('../../assets/images/loginHeaderImg.png')} // or { uri: 'https://...' }
        style={[styles.headerBlock, localStyles.headerStyle]}
        imageStyle={styles.imageStyle} // for rounded corners
    >
        <LinearGradient
        colors={['rgba(186,230,255,0.8)', 'rgba(243,251,255,0.3)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[
            styles.gradientOverlay,
            localStyles.animatedGradientStyle
        ]}
        >
            {showSkip && (
        <View style={{position:'absolute', top: 40, right: 20}}>

            <Pressable onPress={handleSkip} style={{}} accessibilityRole="button">
            <Text style={{color:COLORS.secondary[1]}}>Skip &gt;</Text>
            </Pressable>
        </View>
        )}
        {/* <View > */}
        <View style={[localStyles.logoStyle]}>
            <Image
            source={ImagePaths.MainLogo}
            // style={{height:"100%"}}
            />
        </View>
        {/* </View> */}
        <View style={[styles.headerTextBox, localStyles.textBoxStyle]}>
            <Text style={[styles.headerText]}>
            SyncTrip
            </Text>
            {/* <Text style={styles.headerText}>SyncTrip</Text> */}
        </View>
        </LinearGradient>
    </ImageBackground>
    </View>
    );
};

export default LoginShortHeaderBlock;
