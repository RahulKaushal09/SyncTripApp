import { StyleSheet } from 'react-native';
import { COLORS } from './../../constants/index';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 20,
  },
  OTPTitleContainer: {
    position:"relative",
    marginTop: 60,
    marginBottom: 20,
    // paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    // marginTop: 16,
    marginBottom: 15,
    textAlign: 'left',
  },
  subtitleContainer:{
    display:'flex',
    flexDirection:'row',
    width:"100%",
    gap:20

  },
  subtitle: {
    fontSize: 16,
    color: COLORS.secondary[1],
    marginBottom: 20,
    textAlign: 'left',
  },
  containerPadding:{
    paddingHorizontal:20,
  },
  otpContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-evenly',
    gap: 20,
    // paddingHorizontal:20,
    // marginVertical: 20,
    marginBottom:20
  },
  otpBox: {
    borderWidth: 1,
    borderColor: COLORS.neutral[1],
    borderRadius: 12,
    width: 60,
    height: 60,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    backgroundColor: COLORS.base.white,
  },
  timerText: {
    fontSize: 14,
    color: COLORS.secondary[1],
    textAlign: 'left',
    marginBottom: 30,
    // paddingHorizontal:20
  },
  disabledButton: {
    backgroundColor: '#d1d1d6',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  disabledText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonContainer: {
    marginBottom: 20,
    width: '100%',
    height: 50,
    
  },
  continueButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // color: COLORS.neutral[1],
    backgroundColor: "#B9BBC6",
    borderRadius: 10,

  },
  continueButtonActive: {
    backgroundColor: COLORS.primary[1],
  },
  continueButtonText: {
    color: COLORS.base.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonContinueBottomContainer:{
    // display: 'none',
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    // width: '100%',
    height: 50,
  },
});
