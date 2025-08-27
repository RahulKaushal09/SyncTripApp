import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Platform, Pressable, Image, Keyboard, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './OtpScreen.styles';
import LoginShortHeaderBlock from '../../components/headerBlocks/LoginShortHeaderBlock';
import { COLORS } from '../../constants';
import { AuthContext } from '../../context/AuthContext';

interface OtpScreenProps {
  navigation?: any;
  route?: any;
}

const OtpScreen: React.FC<OtpScreenProps> = ({ navigation, route }) => {
  const { phoneNumber } = route.params;
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
const { setUser } = useContext(AuthContext);

  const inputs = useRef<Array<TextInput | null>>([]);

  // Focus first OTP box on mount
  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  // Countdown timer for OTP
  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Handle OTP input change
  const handleChange = (text: string, index: number) => {
    if (text && index < otp.length - 1) {
      inputs.current[index + 1]?.focus();
    }
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

  };
  const editPhoneNumber = () => {
    // Logic to edit phone number
    navigation.goBack();
  };
  // Handle backspace focus
  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  // OTP verification
  const handleVerifyOtp = () => {
    const finalOtp = otp.join('');
    console.log('Verifying OTP for:', phoneNumber, finalOtp);
    const userData = { phoneNumber, token: 'backend_token_here' };
    setUser(userData); // This will automatically switch to AppNavigator
  };

  // Resend OTP
  const handleResendOtp = () => {
    setOtp(['', '', '', '']);
    inputs.current[0]?.focus();
    setTimer(30);
    setCanResend(false);
    // Call your resend OTP API here
  };

  const canContinue = otp.every((digit) => digit !== '');

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
            setIsFocused(false);
          }}
        >
          <View style={[{ flex: 1 }]}>
            <LoginShortHeaderBlock />
            <View style={[{ flex: 1 }, styles.containerPadding]}>
              <View style={styles.OTPTitleContainer}>
                <Text style={styles.title}>Enter verification code</Text>
                <View style={styles.subtitleContainer}>
                  <Text style={styles.subtitle}>Sent to {phoneNumber}</Text>
                  <TouchableOpacity onPress={editPhoneNumber}>
                    <Image
                      source={require('../../assets/images/editPhoneNo.png')}
                      style={{ width: 20, height: 20 }}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* OTP Boxes */}
              <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(el) => { inputs.current[index] = el; }}
                    style={[styles.otpBox, digit && { borderColor: COLORS.primary[1] + 'A1' }]}
                    keyboardType="numeric"
                    maxLength={1}
                    value={digit}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onChangeText={(text) => handleChange(text, index)}
                    onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                  />
                ))}
              </View>

              {/* Timer / Resend OTP */}
              <Text style={styles.timerText}>
                {canResend ? (
                  <Text style={{ color: COLORS.secondary[1], fontWeight: "600" }} onPress={handleResendOtp}>
                    Resend OTP
                  </Text>
                ) : (
                  `Get verification code again in 00:${timer < 10 ? '0' + timer : timer}`
                )}
              </Text>

              {/* Continue Button */}
              <View style={[styles.buttonContinueBottomContainer]}>
                <Pressable
                  onPress={handleVerifyOtp}
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
                  ]}>Continue</Text>
                </Pressable>
              </View>
              {/* {!isFocused && (
              
              
            )} */}
              {/* {isFocused && (
            <View style={[styles.buttonContinueBottomContainer]}>
                          <Pressable
                            onPress={handleVerifyOtp}
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
                            ]}>Continue</Text>
                          </Pressable>
                        </View>
                        )} */}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OtpScreen;
