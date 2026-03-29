export const colors = {
  background: '#0D0B1A',
  surface: '#1A1730',
  surfaceElevated: '#221F3A',
  border: '#2D2A4A',
  primary: '#7B5EA7',
  teal: '#00C896',
  amber: '#F59E0B',
  red: '#EF4444',
  white: '#FFFFFF',
  textPrimary: '#FFFFFF',
  textSecondary: '#A09BC0',
  textMuted: '#5C5880',
} as const;

export const typography = {
  balance: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    lineHeight: 38,
  },
  screenTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 22,
    lineHeight: 28,
  },
  sectionHeading: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    lineHeight: 22,
  },
  body: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    lineHeight: 16,
  },
  amount: {
    fontFamily: 'Courier',
    fontSize: 15,
    lineHeight: 20,
  },
} as const;

export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
} as const;
