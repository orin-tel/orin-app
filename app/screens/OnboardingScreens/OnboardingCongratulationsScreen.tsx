import { FC } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, View, ViewStyle } from "react-native"
import { OnboardingStackScreenProps } from "@/navigators"
import { Button, Icon, Screen, Text } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import { colors, spacing, ThemedStyle } from "@/theme"

export const OnboardingCongratulationsScreen: FC<OnboardingStackScreenProps<"OnboardingCongratulations">> = observer(
  function OnboardingCountryScreen() {
    const { themed } = useAppTheme()
    return (
      <Screen
        style={themed($root)}
        contentContainerStyle={themed($contentContainer)}
        preset="scroll"
      >
        <View style={themed($container)}>
          <View style={themed($sectionContainer)}>
            <Icon icon="checkInverse" size={55} />
            <View style={themed($textContainer)}>
              <Text tx="onboardingCongratulationsScreen:title" style={themed($sectionTitle)} size="xl" weight="bold" />
              <Text tx="onboardingCongratulationsScreen:description" style={themed($sectionText)} size="sm" weight="normal" />
            </View>
            <View style={themed($sectionContainerTwo)}>
              <Text tx="onboardingCongratulationsScreen:label" style={themed($label)}
                weight="medium" />
              <View style={themed($numberBox)}>
                <Text tx="onboardingCongratulationsScreen:number" size="lg" weight="bold" />
                <Icon icon="copy" size={spacing.md} />
              </View>

            </View>

          </View>
          <Button tx="onboardingCongratulationsScreen:next" style={themed($btnValidate)} />

        </View>
      </Screen >)
  }
)


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

const $infoBox: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  width: 321,
  height: 164,
  borderRadius: 16,
  backgroundColor: colors.infoBackground,
  padding: spacing.md,
  paddingVertical: spacing.sm,
  alignSelf: "center",
})

const $infoOuter: ThemedStyle<TextStyle> = ({ colors }) => ({
  height: "100%",
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
