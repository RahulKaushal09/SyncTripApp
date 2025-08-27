// LoginScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StatusBar,
  Image,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  ImageBackground
} from 'react-native';


import { SafeAreaView } from 'react-native-safe-area-context'; // <- recommended
import { styles } from './LoginScreen.styles';
import { COLORS, STRINGS, ImagePaths } from '../../constants';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolate } from 'react-native-reanimated';
import LoginHeaderBlock from '../../components/headerBlocks/loginHeaderBlock';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { GOOGLE_CLIENT_ID } from '@env';
import GoogleLoginBottomSheet from '../../components/auth/GoogleBottomSheet';
interface LoginScreenProps {
  navigation?: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('+91');
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const headerHeight = useSharedValue(200);

  const fadeOthers = useSharedValue(1);
  const logoFocused = useSharedValue(0); // 0 = not focused, 1 = focused

  useEffect(() => {
    GoogleSignin.configure({
  webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com', // must be the "Web client" from the SAME project
  scopes: ['profile', 'email'],
  offlineAccess: false, // set true only if you truly need server refresh tokens
});
  }, []);
  // animate on focus
  useEffect(() => {
    if (isFocused) {
      headerHeight.value = withTiming(100, { duration: 400 });
      fadeOthers.value = withTiming(0, { duration: 300 });
      logoFocused.value = withTiming(1, { duration: 400 });
    } else {
      headerHeight.value = withTiming(200, { duration: 400 });
      fadeOthers.value = withTiming(1, { duration: 300 });
      logoFocused.value = withTiming(0, { duration: 400 });
    }
  }, [isFocused]);

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: fadeOthers.value,
    display: fadeOthers.value === 0 ? 'none' : 'flex',
  }));


  const handleContinue = async () => {
    const valid = phoneNumber.length >= 10;
    if (!valid) return;
    setLoading(true);
    try {
      console.log('Phone login:', countryCode + phoneNumber);
      // call your API / navigate to OTP screen
      navigation.navigate('OtpScreen', { phoneNumber: countryCode + phoneNumber });
    } finally {
      setLoading(false);
    }
  };

  
  // const handleGoogleLogin = () => {
  //   // use @react-native-google-signin/google-signin implementation here
  //   console.log('Google login');
  // };


  const openTermsOfService = () => console.log('Open Terms of Service');
  const openPrivacyPolicy = () => console.log('Open Privacy Policy');
  const openContentPolicy = () => console.log('Open Content Policy');
  const openCountryPicker = () => console.log('Open country picker'); // wire country-picker modal here

  const canContinue = phoneNumber.length >= 10 && !loading;
const handleGoogleLogin = async () => {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    await GoogleSignin.signOut(); // clear bad cached state during debugging
    const res = await GoogleSignin.signIn();
    console.log('Google user:', JSON.stringify(res, null, 2));
    if (!res.data?.idToken) throw new Error('Missing idToken: check webClientId origin');
    navigation.replace('HomeScreen', { user: res });
  } catch (e: any) {
    // dump everything you can
    console.log('ERR.code:', e?.code);
    console.log('ERR.message:', e?.message);
    console.log('ERR.nativeStackAndroid:', e?.nativeStackAndroid);
    console.log('ERR.userInfo:', e?.userInfo);
  }
};
  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} /> */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <LoginHeaderBlock isFocused={isFocused} />
          <Animated.View style={[styles.tagLineView]}>
            <Text style={styles.tagLineText}>
              India&apos;s #1 Trip Planning and Travel Companion
            </Text>
          </Animated.View>
          {/* <View style={styles.tagLineView}>
            <Text style={styles.tagLineText}>India's #1 Trip Planning and Travel Companion</Text>
          </View> */}
          <View style={styles.formContainer}>
            <Animated.View style={[fadeStyle]}>

              <View style={styles.orContainer} >
                <View style={styles.hrContainer}>
                  <View style={styles.line} />
                  <Text style={styles.orText}>Log in or sign up</Text>
                  <View style={styles.line} />
                </View>
              </View>
            </Animated.View>

            <View style={styles.phoneContainer}>
              {/* Country code box */}
              <View style={styles.countryCodeBox}>
                {/* <Text style={styles.flag}>🇮🇳</Text>
               */}
                <Image
                  source={require('../../assets/images/indiaFlag.png')}
                  style={styles.flag}
                />
                {/* <Text style={styles.countryCode}>+91</Text> */}
              </View>
              <View style={styles.phoneInputContainer}>
                {/* Phone number input */}
                <Text style={styles.countryCode}>+91</Text>

                <TextInput
                  style={styles.phoneInput}
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={phoneNumber}
                  onChangeText={(text) => {
    const sanitized = text.replace(/\D/g, ''); // remove non-digits
    setPhoneNumber(sanitized);
  }}
                  // onChangeText={setPhoneNumber}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />

              </View>
            </View>
            <View style={[styles.buttonContainer,isFocused && { display: 'none' }]}>
              <Pressable
                onPress={handleContinue}
                style={({ pressed }) => [
                  styles.continueButton,
                  canContinue && styles.continueButtonActive,
                  pressed && { opacity: 0.85 },
                  !canContinue && { opacity: 1 },
                ]}
                disabled={!canContinue}
                accessibilityRole="button"
                accessibilityState={{ disabled: !canContinue }}
              >
                <Text style={[
                  styles.continueButtonText,
                  // canContinue && styles.continueButtonTextActive
                ]}>{STRINGS.continue}</Text>
              </Pressable>
            </View>
            
            <Animated.View style={[fadeStyle]}>

              <View style={styles.orContainer} >
                <View style={styles.hrContainer}>
                  <View style={styles.line} />
                  <Text style={styles.orText}>or</Text>
                  <View style={styles.line} />
                </View>
              </View>

                {/* <GoogleLoginBottomSheet /> */}
              <View style={{}}>
                <Pressable
                  style={[styles.googleButton]}
                  onPress={handleGoogleLogin}>
                  <Image
                    source={require('../../assets/images/googleIcon.png')}
                    style={{ marginRight: 10 }}
                  />
                  <Text style={
                    styles.googleButtonText
                    // canContinue && styles.continueButtonTextActive
                  }>Continue with Google</Text>
                </Pressable>
              </View>
            </Animated.View>


          </View>
          <View style={[styles.buttonContinueBottomContainer , isFocused && { display: withTiming('flex', { duration: 500 }) }]}>
              <Pressable
                onPress={handleContinue}
                style={({ pressed }) => [
                  styles.continueButton,
                  canContinue && styles.continueButtonActive,
                  pressed && { opacity: 0.85 },
                  !canContinue && { opacity: 1 },
                ]}
                disabled={!canContinue}
                accessibilityRole="button"
                accessibilityState={{ disabled: !canContinue }}
              >
                <Text style={[
                  styles.continueButtonText,
                  // canContinue && styles.continueButtonTextActive
                ]}>{STRINGS.continue}</Text>
              </Pressable>
            </View>
          <Animated.View style={[styles.termsContainer, fadeStyle]}>
                
            <View>
              <Text style={styles.termsText}>
                By continuing, you agree to our
              </Text>

              <View style={styles.linksContainer}>
                <Text style={styles.termsLink}>Terms of Service</Text>
                <Text style={styles.termsLink}>Privacy Policy</Text>
                <Text style={styles.termsLink}>Content Policy</Text>
              </View>
            </View>
          </Animated.View>


        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
