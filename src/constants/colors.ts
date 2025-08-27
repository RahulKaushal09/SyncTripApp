export const COLORS = {
  // Base Colors
  base: {
    white: '#FFFFFF',
    black: '#222222',
    text: '#0D344B',
    gray:"#9C9FAF",
    background: '#FFFFFF',
  },
  backgroundLightApp: '#FDFEFF',
  backgroundDarkApp: '#0D1117',
  // Primary Colors
  primary: {
    1: '#3ABEF5',
    2: '#7ACCF5',
    3: '#B8E8FF',
    4: '#E3F5FF',
    5: '#F2FAFF',
    hover: '#007EB2',
  },

  // Secondary Colors
  secondary: {
    1: '#16324F',
    2: '#A2C3E8',
    3: '#CEE1F8',
    4: '#E3F5FF',
    5: '#F7FAFD',
    hover: '#173350',
  },
  

  // Neutral Colors
  neutral: {
    1: '#80838D',
    2: '#B9BBC6',
    3: '#CDCED6',
    4: '#D9D9E0',
    5: '#E8E8EC',
  },

  // Semantic: Error Colors
  error: {
    1: '#E5484D',
    2: '#EB8E90',
    3: '#F4A9AA',
    4: '#FFCDCE',
    5: '#FEEBEC',
  },

  // Semantic: Success Colors
  success: {
    1: '#2B9A66',
    2: '#5BB98B',
    3: '#8ECEAA',
    4: '#C4E8D1',
    5: '#E6F6EB',
  },

  // Semantic: Warning Colors
  warning: {
    1: '#FFC53D',
    2: '#F3D673',
    3: '#FBE577',
    4: '#FFEE9C',
    5: '#FFF7C2',
  },
} as const;

// Define the TYPOGRAPHY constant for Inter font only
export const TYPOGRAPHY = {
  fontFamily: {
    sans: '"Inter", Arial, sans-serif',
  },
} as const;