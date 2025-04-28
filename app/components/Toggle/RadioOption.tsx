/* eslint-disable react-native/no-inline-styles */
import { useEffect, useRef } from "react"
import { StyleProp, View, ViewStyle, Animated, TextStyle } from "react-native"
import { $styles, ThemedStyle } from "../../theme"
import { $inputOuterBase, BaseToggleInputProps, ToggleProps, Toggle } from "./Toggle"
import { useAppTheme } from "@/utils/useAppTheme"
import { Icon } from "../Icon"

export interface RadioOptionToggleProps
  extends Omit<ToggleProps<RadioOptionInputProps>, "ToggleInput"> {
  /**
   * Optional style prop that affects the dot View.
   */
  inputDetailStyle?: ViewStyle
  /**
   * Right Accessory
   */
  rightAccessory?: React.ReactNode
}

interface RadioOptionInputProps extends BaseToggleInputProps<RadioOptionToggleProps> {}

/**
 * @param {RadioToggleProps} props - The props for the `Radio` component.
 * @see [Documentation and Examples]{@link https://docs.infinite.red/ignite-cli/boilerplate/app/components/Radio}
 * @returns {JSX.Element} The rendered `Radio` component.
 */
export function RadioOption(props: RadioOptionToggleProps) {
  return <Toggle accessibilityRole="radio" {...props} ToggleInput={RadioOptionInput} />
}

function RadioOptionInput(props: RadioOptionInputProps) {
  const {
    on,
    status,
    disabled,
    outerStyle: $outerStyleOverride,
    innerStyle: $innerStyleOverride,
    detailStyle: $detailStyleOverride,
  } = props

  const {
    theme: { colors },
  } = useAppTheme()

  const opacity = useRef(new Animated.Value(0))

  useEffect(() => {
    Animated.timing(opacity.current, {
      toValue: on ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }, [on])

  const offBackgroundColor = [
    disabled && colors.palette.neutral400,
    status === "error" && colors.errorBackground,
    colors.palette.neutral200,
  ].filter(Boolean)[0]

  const outerBorderColor = [
    disabled && colors.palette.neutral400,
    status === "error" && colors.error,
    !on && colors.palette.neutral800,
    colors.palette.secondary500,
  ].filter(Boolean)[0]

  const onBackgroundColor = [
    disabled && colors.transparent,
    status === "error" && colors.errorBackground,
    colors.palette.neutral100,
  ].filter(Boolean)[0]

  const dotBackgroundColor = [
    disabled && colors.palette.neutral600,
    status === "error" && colors.error,
    colors.palette.neutral900,
  ].filter(Boolean)[0]

  return (
    <View
      style={[
        $inputOuter,
        { backgroundColor: offBackgroundColor, borderColor: outerBorderColor },
        $outerStyleOverride,
      ]}
    >
      <Animated.View
        style={[
          $styles.toggleInner,
          { backgroundColor: onBackgroundColor },
          $innerStyleOverride,
          { opacity: opacity.current },
        ]}
      >
        <View style={[$radioDetail, { backgroundColor: dotBackgroundColor }, $detailStyleOverride]}>
          {on && (
            <Animated.View
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon icon="check" color={colors.palette.neutral100} size={18} />
            </Animated.View>
          )}
        </View>
      </Animated.View>
    </View>
  )
}

const $radioDetail: ViewStyle = {
  width: "100%",
  height: "100%",
  borderRadius: 6,
  justifyContent: "center",
  alignItems: "center",
}

const $inputOuter: StyleProp<ViewStyle> = [$inputOuterBase, { borderRadius: 12, borderWidth: 0.5 }]
