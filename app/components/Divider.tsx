/* eslint-disable  react-native/no-inline-styles */
import { StyleProp, View, ViewStyle } from "react-native"
import type { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import { Text } from "./Text"

interface DividerProps {
  type?: "vertical" | "horizontal"
  size?: number
  style?: StyleProp<ViewStyle>
  line?: boolean
  lineStyle?: StyleProp<ViewStyle>
}

/**
 * @param {DividerProps} props - The props for the `Divider` component.
 * @returns {JSX.Element} The rendered `Divider` component.
 */
export function Divider(props: DividerProps): JSX.Element {
  const {
    type = "horizontal",
    size = 10,
    line = false,
    style: $styleOverride,
    lineStyle: $lineStyleOverride,
  } = props
  const { themed } = useAppTheme()

  return (
    <View
      style={[
        $divider,
        type === "horizontal" && { height: size },
        type === "vertical" && { width: size },
        $styleOverride,
      ]}
    >
      {line && (
        <View
          style={[
            themed($line),
            type === "horizontal" && {
              width: 150,
              height: 1,
              // marginStart: -75,
              marginTop: -1,
            },
            type === "vertical" && {
              height: 50,
              width: 1,
              marginTop: -25,
              marginStart: -1,
            },
            $lineStyleOverride,
          ]}
        />
      )}
    </View>
  )
}

const $divider: ViewStyle = {
  flexGrow: 0,
  flexShrink: 0,
}

const $line: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.text,
  position: "absolute",
  // left: "50%",
  // top: "50%",
})
