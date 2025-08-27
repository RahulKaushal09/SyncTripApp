import { StyleSheet } from 'react-native';
import { COLORS } from './../../constants/index';

export const styles = StyleSheet.create({
  // Layout Styles
  container: {
    flex: 1,
  },
  headerBlock: {
    // height: 200,
    width: '100%',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden', // important for border radius on ImageBackground
  },
  imageStyle: {
    resizeMode: 'cover', // or 'stretch' / 'contain'
  },
  gradientOverlay: {
    // flex: 1,
    display: 'flex',
    // justifyContent: 'center',
    // alignItems: 'center',
    height:"100%" ,
    width:"100%",
    paddingHorizontal:20
  },
  mainLogo: {
    width: 66,
    height: 66,
  },
  headerTextBox: {
    display:'flex',
    textAlign: 'center',
    alignItems: 'center',
    // width:"100%"
  },
  headerText: {
    color: COLORS.secondary[1],
    fontSize: 36,
    fontWeight: '800',
  },
  headerTop: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10, // ensures button is on top
  },
  skipButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(0,0,0,0.3)', // semi-transparent background
    borderRadius: 12,
  },
  skipText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tagLineView: {
    marginTop: 35,
    marginBottom: 25,
    alignItems: 'center',
  },
  tagLineText: {
    color: COLORS.base.black,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '70%',
  },
  orContainer:{
    marginBottom: 20,
  },
  hrContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginHorizontal:20
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#EBEBEB', // line color
  },
  orText: {
    marginHorizontal: 10,
    color: COLORS.neutral[1],
    fontWeight: '500',
  },
  formContainer: {
    paddingHorizontal: 20,
  },

  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom:20

  },
  countryCodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width:70,
    height:45,
    borderRadius: 10,
    marginRight: 15,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: '#fff',

  },
  phoneInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    height: 45,
    width: '100%',
  },
  flag: {
    fontSize: 18,
    marginRight: 6,
  },
  countryCode: {
    fontSize: 16,
    // backgroundColor: '#fff',
    fontWeight: 'bold',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    textAlign: 'center',
    // marginLeft: 10,
    alignItems: 'center',
    width:"15%"
    
  },
  phoneInput: {
    // flex: 1,
    // marginLeft: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    fontSize: 16,
    color: COLORS.base.black,
    // backgroundColor: '#fff',
    width:"85%",
    textAlign:"left"
  },
  buttonContinueBottomContainer:{
    display: 'none',
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    // width: '100%',
    height: 50,
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
  googleButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth:1,
    borderColor:COLORS.primary[4],
    marginBottom: 20,
    width: '100%',
    height: 50,
  },
  googleButtonText: {
    color: COLORS.base.black,
    fontWeight: 'bold',
    fontSize: 16,
  },

  termsContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  termsText: {
    color: COLORS.neutral[1],
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  linksContainer: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  termsLink: {
    color: COLORS.neutral[2], // blue link color
    fontSize: 10,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});