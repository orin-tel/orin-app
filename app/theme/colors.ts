const palette = {
  neutral100: "#FFFFFF",
  neutral200: "#F7F7F7", // Added from Figma
  neutral300: "#D0D0D0", // Added from Figma
  neutral400: "#B6ACA6",
  neutral500: "#978F8A",
  neutral600: "#525252", // Added from Figma
  neutral700: "#3C3836",
  neutral800: "#242424", // Added from Figma
  neutral900: "#000000",

  primary100: "#27263E14",
  primary200: "#E8C1B4",
  primary300: "#DDA28E",
  primary400: "#D28468",
  primary500: "#C76542",
  primary600: "#27263E", // Added from Figma

  secondary100: "#DCDDE9",
  secondary200: "#BCC0D6",
  secondary300: "#9196B9",
  secondary400: "#626894",
  secondary500: "#41476E",

  accent100: "#FFEED4",
  accent200: "#FFE1B2",
  accent300: "#FDD495",
  accent400: "#FBC878",
  accent500: "#FFBB50",

  angry100: "#F2D6CD",
  angry500: "#C03403",

  overlay20: "rgba(25, 16, 21, 0.2)",
  overlay50: "rgba(25, 16, 21, 0.5)",

  warning100: "#FCEFD2",
  warning200: "#F8DA9C",
  warning300: "#F3C16D",
  warning400: "#EAAE49",
  warning500: "#CD8D19",

  info100: "#3572E114",
  info150: "#3572E126",
  info200: "#3572E150",
  info300: "#3572E180",
  info400: "#3572E1BF",
  info500: "#3572E1",

  success100: "#4DAE4D14",
  success200: "#4DAE4D50",
  success300: "#4DAE4D80",
  success400: "#4DAE4DBF",
  success500: "#4DAE4D",

  error100: "#FF635614",
  error150: "#FF635626",
  error200: "#FF635650",
  error300: "#FF635680",
  error400: "#FF6356BF",
  error500: "#FF6356",

  shadow: "#000",
} as const

export const colors = {
  /**
   * The palette is available to use, but prefer using the name.
   * This is only included for rare, one-off cases. Try to use
   * semantic names as much as possible.
   */
  palette,
  /**
   * A helper for making something see-thru.
   */
  transparent: "rgba(0, 0, 0, 0)",
  /**
   * The default text color in many components.
   */
  text: palette.neutral800,
  /**
   * Secondary text information.
   */
  textDim: palette.neutral600,
  /**
   * Default background for input fields.
   */
  inputBackground: palette.neutral200,
  /**
   * Default colour for placeholder text.
   */
  textPlaceholder: palette.neutral300,
  /**
   * Default primary colour.
   */
  defaultPrimary: palette.primary600,
  /**
   * The default color of the screen background.
   */
  background: palette.neutral100,
  /**
   * The default border color.
   */
  border: palette.neutral400,
  /**
   * shadow color 1
   */
  shadowPrimary: palette.shadow,
  /**
   * The main tinting color.
   */
  tint: palette.primary500,
  /**
   * The inactive tinting color.
   */
  tintInactive: palette.neutral300,
  /**
   * A subtle color used for lines.
   */
  separator: palette.neutral300,
  /**
   * Info messages.
   */
  info: palette.info500,
  /**
   * Info Background.
   */
  infoBackground: palette.info150,
  /**
   * Success messages.
   */
  success: palette.success500,
  /**
   * Success Background.
   */
  successBackground: palette.success100,
  /**
   * Error messages.
   */
  error: palette.error500,
  /**
   * Error Background.
   */
  errorBackground: palette.error150,
  /**
   * Warning messages.
   */
  warning: palette.warning500,
  /**
   * Warning Background.
   */
  warningBackground: palette.warning100,
} as const
