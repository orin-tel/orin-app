import { FC, useCallback } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, View, ViewStyle } from "react-native"
import { OnboardingStackScreenProps } from "@/navigators"
import { Button, Icon, Screen, Text } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import { colors, spacing, ThemedStyle } from "@/theme"
import ProgressBar from "@/components/ProgressBar"
import { useProgress } from "@/context/ProgressProvider"
import { useFocusEffect } from "@react-navigation/native"
import Config from "@/config"

export const OnboardingCongratulationsScreen: FC<
  OnboardingStackScreenProps<"OnboardingCongratulations">
> = observer(function OnboardingCongratulationsScreen(_props) {
  const { themed } = useAppTheme()

  // progress bar
  const { navigation } = _props

  const { setProgress } = useProgress()
  useFocusEffect(
    useCallback(() => {
      setProgress(0.6)
    }, []),
  )

  const copyToClipboard = () => {}

  const handleNext = () => {
    navigation.navigate("OnboardingAbout")
  }
  //
  return (
    <Screen style={themed($root)} contentContainerStyle={themed($contentContainer)} preset="scroll">
      <View style={themed($container)}>
        <View style={themed($sectionContainer)}>
          <Icon icon="checkInverse" size={55} />
          <View style={themed($textContainer)}>
            <Text
              tx="onboardingCongratulationsScreen:title"
              style={themed($sectionTitle)}
              size="xl"
              weight="bold"
            />
            <Text
              tx="onboardingCongratulationsScreen:description"
              style={themed($sectionText)}
              size="sm"
              weight="normal"
            />
          </View>
          <View style={themed($sectionContainerTwo)}>
            <Text
              tx="onboardingCongratulationsScreen:label"
              style={themed($label)}
              weight="medium"
            />
            <View style={themed($numberBox)}>
              <Text text={Config.TELEPHONY_SERVER_NUMBER} size="lg" weight="bold" />
              <Icon icon="copy" size={spacing.md} onPress={copyToClipboard} />
            </View>
          </View>
        </View>
        <Button
          tx="onboardingCongratulationsScreen:next"
          style={themed($btnValidate)}
          onPress={handleNext}
        />
      </View>
    </Screen>
  )
})

const $root: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.background,
})

const $contentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexGrow: 1,
  justifyContent: "center",
  padding: spacing.lg,
})

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  width: "100%",
  alignItems: "center",
  gap: spacing.xxxl,
})

const $sectionContainer: ThemedStyle<TextStyle> = ({ spacing }) => ({
  gap: spacing.xxl - spacing.xs,
  alignItems: "center",
})
const $sectionContainerTwo: ThemedStyle<TextStyle> = ({ spacing }) => ({
  gap: spacing.xxs,
  alignSelf: "center",
})
const $label: ThemedStyle<TextStyle> = ({ spacing }) => ({
  gap: spacing.xxs,
})
const $textContainer: ThemedStyle<TextStyle> = ({ spacing }) => ({
  gap: spacing.sm,
})

const $sectionTitle: ThemedStyle<TextStyle> = () => ({
  textAlign: "center",
})

const $sectionText: ThemedStyle<TextStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.md,
  textAlign: "center",
})
const $numberBox: ThemedStyle<TextStyle> = ({ colors }) => ({
  flexDirection: "row",

  width: 321,
  height: 57,
  backgroundColor: colors.inputBackground,
  borderRadius: 100,

  borderColor: colors.textDim,
  justifyContent: "space-between",
  alignItems: "center",
  alignSelf: "center",
  paddingHorizontal: spacing.md,
})

const $btnValidate: ThemedStyle<TextStyle> = () => ({
  width: 260,
})
