import { useEffect } from "react"
import { View, Animated, Dimensions, ViewStyle } from "react-native"
import { useProgress } from "../context/ProgressProvider"
import { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"

const { width } = Dimensions.get("window")

const ProgressBar = () => {
  const { progress } = useProgress()
  const progressAnim = new Animated.Value(progress)
  const { themed } = useAppTheme()
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }, [progress])

  if (progress === 0) return null
  return (
    <View style={themed(progressBarContainer)}>
      <Animated.View
        style={[
          themed(progressBar),
          {
            width: progressAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ["0%", "100%"],
            }),
          },
        ]}
      />
    </View>
  )
}

// const styles = StyleSheet.create({

const progressBarContainer: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: width * 0.75,
  height: 8,
  backgroundColor: colors.inputBackground,
  borderRadius: 5,
  overflow: "hidden",
  alignSelf: "center",
})

const progressBar: ThemedStyle<ViewStyle> = ({ colors }) => ({
  height: "100%",
  backgroundColor: colors.defaultPrimary,
})

export default ProgressBar
