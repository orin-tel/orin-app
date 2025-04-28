import { FC, useCallback } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, View, ViewStyle } from "react-native"
import { OnboardingStackScreenProps } from "@/navigators"
import { Button, Icon, Screen, Text } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import { colors, spacing, ThemedStyle } from "@/theme"
import { useProgress } from "@/context/ProgressProvider"
import ProgressBar from "@/components/ProgressBar"
import { useFocusEffect } from "@react-navigation/native"
import Config from "@/config"

export const OnboardingValidateScreen: FC<OnboardingStackScreenProps<"OnboardingValidate">> =
  observer(function OnboardingValidateScreen(_props) {
    // progress bar
    const { navigation } = _props

    const { setProgress } = useProgress()
    useFocusEffect(
      useCallback(() => {
        setProgress(0.5)
      }, []),
    )

    const handleNext = () => {
      navigation.navigate("OnboardingCongratulations")
    }
    //
    const { themed } = useAppTheme()
    return (
      <Screen
        style={themed($root)}
        contentContainerStyle={themed($contentContainer)}
        preset="scroll"
      >
        <View style={themed($container)}>
          <View style={themed($sectionContainer)}>
            <View style={themed($textContainer)}>
              <Text
                tx="onboardingValidateScreen:title"
                style={themed($sectionTitle)}
                size="xl"
                weight="bold"
              />
              <Text
                tx="onboardingValidateScreen:description"
                style={themed($sectionText)}
                size="sm"
                weight="normal"
              />
            </View>
            <View style={themed($sectionContainerTwo)}>
              <View style={themed($numberBox)}>
                <Text text={"*#21#" + Config.TELEPHONY_SERVER_NUMBER} size="lg" weight="bold" />
                <Icon icon="copy" size={spacing.md} />
              </View>

              <View style={themed($infoBox)}>
                <View style={themed($infoOuter)}>
                  <Icon icon="infoCircle" size={spacing.md + spacing.xxs} color={colors.info} />
                  <View style={themed($infoInner)}>
                    <Text
                      tx="onboardingValidateScreen:info_one"
                      style={themed($infoText)}
                      size="xxs"
                      weight="normal"
                    />
                    <Text
                      tx="onboardingValidateScreen:info_two"
                      style={themed($infoText)}
                      size="xxs"
                      weight="normal"
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
          <Button
            onPress={handleNext}
            tx="onboardingValidateScreen:validate"
            style={themed($btnValidate)}
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
})
const $sectionContainerTwo: ThemedStyle<TextStyle> = ({ spacing }) => ({
  gap: spacing.lg - spacing.xxs,
})

const $textContainer: ThemedStyle<TextStyle> = ({ spacing }) => ({
  gap: spacing.sm,
})

const $sectionTitle: ThemedStyle<TextStyle> = () => ({
  textAlign: "center",
})

const $sectionText: ThemedStyle<TextStyle> = () => ({
  textAlign: "center",
})
const $numberBox: ThemedStyle<TextStyle> = ({ colors }) => ({
  flexDirection: "row",

  width: 321,
  height: 57,
  backgroundColor: colors.background,
  borderRadius: 20,
  borderWidth: 1,
  borderColor: colors.textDim,
  justifyContent: "space-between",
  alignItems: "center",
  alignSelf: "center",
  paddingHorizontal: spacing.md,
  shadowColor: colors.shadowPrimary,
  shadowOpacity: 0.1,
  shadowRadius: 12,
  elevation: 4,
})

const $infoBox: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  width: "100%",
  height: 164,
  borderRadius: 16,
  backgroundColor: colors.infoBackground,
  padding: spacing.md,
  paddingVertical: spacing.sm,
  alignSelf: "center",
})

const $infoOuter: ThemedStyle<TextStyle> = ({ colors }) => ({
  // height: "100%",
  flexDirection: "row",
  alignItems: "center",
  gap: 12,
})
const $infoInner: ThemedStyle<TextStyle> = ({ colors }) => ({
  width: 230,
  marginTop: 10,
  height: "100%",
  flexDirection: "column",
  alignItems: "center",
  color: colors.info,
  gap: 12,
})

const $infoText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.info,
})

const $btnValidate: ThemedStyle<TextStyle> = () => ({
  width: 260,
})
