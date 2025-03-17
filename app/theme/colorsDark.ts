const palette = {
  neutral900: "#FFFFFF",
  neutral800: "#F4F2F1",
  neutral700: "#D7CEC9",
  neutral600: "#B6ACA6",
  neutral500: "#978F8A",
  neutral400: "#564E4A",
  neutral300: "#3C3836",
  neutral200: "#191015",
  neutral100: "#000000",

  primary600: "#F4E0D9",
  primary500: "#E8C1B4",
  primary400: "#DDA28E",
  primary300: "#D28468",
  primary200: "#C76542",
  primary100: "#A54F31",

  secondary500: "#DCDDE9",
  secondary400: "#BCC0D6",
  secondary300: "#9196B9",
  secondary200: "#626894",
  secondary100: "#41476E",

  accent500: "#FFEED4",
  accent400: "#FFE1B2",
  accent300: "#FDD495",
  accent200: "#FBC878",
  accent100: "#FFBB50",

  angry100: "#F2D6CD",
  angry500: "#C03403",

  overlay20: "rgba(25, 16, 21, 0.2)",
  overlay50: "rgba(25, 16, 21, 0.5)",

  info100: "#264F9B14",
  info200: "#264F9B33",
  info300: "#264F9B66",
  info400: "#264F9B99",
  info500: "#264F9B",

  success100: "#4DAE4D30",
  success200: "#4DAE4D60",
  success300: "#4DAE4D90",
  success400: "#4DAE4DC0",
  success500: "#4DAE4D",

  error100: "#B9474214",
  error200: "#B9474233",
  error300: "#B9474266",
  error400: "#B9474299",
  error500: "#B94742",

  shadow: "#000"
} as const

export const colors = {
  palette,
  transparent: "rgba(0, 0, 0, 0)",
  text: palette.neutral800,
  textDim: palette.neutral600,
  inputBackground: palette.neutral200,
  textPlaceholder: palette.neutral300,
  defaultPrimary: palette.primary600,
  background: palette.neutral100,
  shadowPrimary: palette.shadow,
  border: palette.neutral400,
  tint: palette.primary500,
  tintInactive: palette.neutral300,
  separator: palette.neutral300,
  info:  palette.info500,
  infoBackground: palette.info100,
  success:  palette.success500, 
  successBackground:  palette.success100, 
  error: palette.error500, 
  errorBackground: palette.error100,
} as const
