// LoginHeaderBlock.js
import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, ImageBackground, Pressable } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { styles } from "../../screens/auth/LoginScreen.styles";
import { ImagePaths, STRINGS } from "../../constants";
type Props = {
  isFocused: boolean;
};

const LoginHeaderBlock: React.FC<Props> = ({ isFocused }) => {
  const headerHeight = useSharedValue(250);
    const fadeOthers = useSharedValue(1);
  useEffect(() => {
      if (isFocused) {
        headerHeight.value = withTiming(120, { duration: 400 });
        fadeOthers.value = withTiming(0, { duration: 300 });
      } else {
        headerHeight.value = withTiming(250, { duration: 400 });
        fadeOthers.value = withTiming(1, { duration: 300 });
      }
    }, [isFocused]);
const fadeStyle = useAnimatedStyle(() => ({
    opacity: fadeOthers.value,
  }));
  const logoStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
        // position: logoFocused.value === 1 ? 'absolute' : 'relative', // switch at focus
      top: withTiming(isFocused ? 20 : '50%', { duration: 400 }),
      left: withTiming(isFocused ? 5 : '50%', { duration: 400 }),
      transform: [
        { translateX: withTiming(isFocused ? 0 : 0, { duration: 400 }) }, // half of logo width (to center it)
        { translateY: withTiming(isFocused ? 0 : -33, { duration: 400 }) }, // half of logo height (to center it)
        { scale: withTiming(isFocused ? 0.7 : 1, { duration: 500 }) },
      ],
    };
  });
  // animated styles
  const headerStyle = useAnimatedStyle(() => ({
    height: headerHeight.value,
    // position: 'relative',
  }));
  const textBoxStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      top: withTiming(isFocused ? 20 : '65%', { duration: isFocused ? 500 : 300 }), // floats up
      alignSelf: 'center',
    };
  });
  const handleSkip = () => {
    console.log('Skip login');
  };
const animatedGradientStyle = useAnimatedStyle(() => {
    return {
      paddingHorizontal: withTiming(isFocused ? 20 : 0, { duration: 400 }),
      height: withTiming(isFocused ? '100%' : 250, { duration: 400 }), // fallback collapsed height
    };
  });

  return(
    <Animated.View style={[styles.headerBlock, headerStyle]}>
    <ImageBackground
        source={require('../../assets/images/loginHeaderImg.png')} // or { uri: 'https://...' }
        style={[styles.headerBlock, headerStyle]}
        imageStyle={styles.imageStyle} // for rounded corners
    >
        <LinearGradient
        colors={['rgba(186,230,255,0.8)', 'rgba(243,251,255,0.3)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[
            styles.gradientOverlay,
            isFocused && animatedGradientStyle
        ]}
        >
        <Animated.View style={[styles.headerTop, fadeStyle]}>

            <Pressable onPress={handleSkip} style={styles.skipButton} accessibilityRole="button">
            <Text style={styles.skipText}>{STRINGS.skip}</Text>
            </Pressable>
        </Animated.View>
        {/* <View > */}
        <Animated.View style={[logoStyle]}>
            <Image
            source={ImagePaths.MainLogo}
            // style={{height:"100%"}}
            />
        </Animated.View>
        {/* </View> */}
        <Animated.View style={[styles.headerTextBox, textBoxStyle]}>
            <Text style={[styles.headerText]}>
            SyncTrip
            </Text>
            {/* <Text style={styles.headerText}>SyncTrip</Text> */}
        </Animated.View>
        </LinearGradient>
    </ImageBackground>
    </Animated.View>
    );
};

export default LoginHeaderBlock;
