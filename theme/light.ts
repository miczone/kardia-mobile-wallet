const GrayColors = {
  gray100: '#F8F9FA',
  gray200: '#E9ECEF',
  gray300: '#DEE2E6',
  gray400: '#CED4DA',
  gray500: '#ADB5BD',
  gray600: '#6C757D',
  gray700: '#495057',
  gray800: '#343A40',
  gray900: '#212529',
};

const RedColors = {
  red100: '#F6BDBF',
  red200: '#ED7C80',
  red300: '#E95C61',
  red400: '#E53B41',
  red500: '#E11B22',
  red600: '#C0171D',
  red700: '#A01318',
  red800: '#800F13',
  red900: '#200304',
};

const YellowColors = {
  yellow100: '#FEFCE8',
  yellow200: '#FEF9C3',
  yellow300: '#FEF08A',
  yellow400: '#FDE047',
  yellow500: '#FACC15',
  yellow600: '#EAB308',
  yellow700: '#CA8A04',
  yellow800: '#A16207',
  yellow900: '#854D0E',
};

const GreenColors = {
  green100: '#DCFCE7',
  green200: '#BBF7D0',
  green300: '#86EFAC',
  green400: '#4ADE80',
  green500: '#22C55E',
  green600: '#16A34A',
  green700: '#15803D',
  green800: '#166534',
  green900: '#14532D',
};

const ColorPalette = {
  ...RedColors,
  ...GrayColors,
  ...YellowColors,
  ...GreenColors,
  white: '#FFFFFF',
  black: '#000000',
};

export const theme = {
  ...ColorPalette,
  primary: ColorPalette.red600,
  primaryColor: ColorPalette.red600,
  primaryTextColor: ColorPalette.white,
  secondaryColor: '#FADACF',
  secondaryTextColor: '#AD182A',
  outlineBorderColor: '#C9CED6',
  outlineTextColor: ColorPalette.gray700,
  ghostColor: '#F7F8F9',
  ghostTextColor: ColorPalette.gray500,
  linkTextColor: ColorPalette.green700,
  backgroundColor: '#FFFFFF',
  backgroundFocusColor: ColorPalette.gray200,
  textColor: ColorPalette.gray700,
  urlColor: ColorPalette.red500,
  mutedTextColor: ColorPalette.gray600,
  successColor: ColorPalette.green500,
  failColor: ColorPalette.red700,
  defaultFontSize: 12,
  inputBackgroundColor: ColorPalette.gray100,
  warningTextColor: ColorPalette.yellow500,

  // Header
  backBtnTextColor: ColorPalette.gray700,
  backBtnUnderlayColor: 'rgba(0,0,0,0.05)',

  // Input
  inputBgColor: ColorPalette.gray100,
  inputBorderColor: ColorPalette.gray300,

  // Modal
  modalBgColor: ColorPalette.gray200,
};
