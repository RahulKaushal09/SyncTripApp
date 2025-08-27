import { StyleSheet } from 'react-native';
import { COLORS } from '../constants';

export const utilityStyles = StyleSheet.create({
  // Flexbox utilities (similar to Tailwind)
  flex1: { flex: 1 },
  flexRow: { flexDirection: 'row' },
  flexCol: { flexDirection: 'column' },
  justifyCenter: { justifyContent: 'center' },
  justifyBetween: { justifyContent: 'space-between' },
  justifyEnd: { justifyContent: 'flex-end' },
  alignCenter: { alignItems: 'center' },
  alignEnd: { alignItems: 'flex-end' },
  
  // Padding utilities
  p4: { padding: 16 },
  p6: { padding: 24 },
  px4: { paddingHorizontal: 16 },
  px6: { paddingHorizontal: 24 },
  py2: { paddingVertical: 8 },
  py4: { paddingVertical: 16 },
  py10: { paddingVertical: 40 },
  
  // Margin utilities
  m4: { margin: 16 },
  mb4: { marginBottom: 16 },
  mb5: { marginBottom: 20 },
  mb6: { marginBottom: 24 },
  mb8: { marginBottom: 32 },
  mx4: { marginHorizontal: 16 },
  
  
  // Border utilities
 
  
  // Text utilities
  textCenter: { textAlign: 'center' },
  textBold: { fontWeight: 'bold' },
  textMedium: { fontWeight: '500' },
  textSemibold: { fontWeight: '600' },
  textBase: { fontSize: 16 },
  textLg: { fontSize: 18 },
  textXl: { fontSize: 24 },
  text2xl: { fontSize: 32 },
  textSm: { fontSize: 12 },
  textXs: { fontSize: 10 },
  
  // Color utilities
  textPrimary: { color: COLORS.primary[1] },
  textGray: { color: COLORS.secondary[1] },
  textDark: { color: COLORS.base.black },
  textWhite: { color: COLORS.base.white },

  buttonPrimary: { backgroundColor: COLORS.primary[1],  borderRadius: 8, alignItems: 'center', height: 50, color: COLORS.base.white },
  buttonBorderPrimary:{
    borderWidth: 1,
    borderColor: COLORS.primary[1],
    borderRadius: 8,
    alignItems: 'center',
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
});