import { FC, useCallback, useState } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { OnboardingStackScreenProps } from "@/navigators"
import { Button, Icon, Screen, Text } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import { colors, spacing, ThemedStyle } from "@/theme"

import { useProgress } from "@/context/ProgressProvider"
import { useFocusEffect } from "@react-navigation/native"
import Config from "@/config"

export const OnboardingNumberScreen: FC<OnboardingStackScreenProps<"OnboardingNumber">> = observer(
  function OnboardingNumberScreen(_props) {
    const [selectedOption, setSelectedOption] = useState<"ours" | "yours">("ours")

    // progress bar
    const { navigation } = _props

    const { setProgress } = useProgress()
    useFocusEffect(
      useCallback(() => {
        setProgress(0.4)
      }, []),
    )
    const handleNext = () => {
      // navigation.navigate("OnboardingValidate")
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
                tx="onboardingNumberScreen:title"
                style={themed($sectionTitle)}
                size="xl"
                weight="bold"
              />
              <Text
                tx="onboardingNumberScreen:description"
                style={themed($sectionText)}
                size="sm"
                weight="normal"
              />
            </View>
            <View style={themed($outerOptionContainer)}>
              {/* Forward to ours----------------------*/}
              <TouchableOpacity
                activeOpacity={selectedOption === "ours" ? 1 : 0.5}
                onPress={() => setSelectedOption("ours")}
                style={themed([$optionContainer, selectedOption === "ours" && $selectedOptionOne])}
              >
                <View style={themed($optionTitle)}>
                  <View
                    style={
                      selectedOption === "ours"
                        ? themed($checkIconSelected)
                        : themed($checkIconNotSelected)
                    }
                  >
                    {selectedOption === "ours" && (
                      <Icon icon="check" size={16} color={colors.background} />
                    )}
                  </View>
                  <Text
                    tx="onboardingNumberScreen:forward_to_ours"
                    weight={selectedOption === "ours" ? "semiBold" : "normal"}
                  >
                    Forward calls to our number
                  </Text>
                </View>
                <View style={selectedOption === "ours" ? themed($infoBox) : themed($infoBoxHidden)}>
                  <Text text={Config.TELEPHONY_SERVER_NUMBER} size="md" weight="bold" />
                  <View style={themed($info)}>
                    <Icon icon="infoCircle" size={spacing.md + spacing.xxs} color={colors.info} />

                    <Text
                      tx="onboardingNumberScreen:info"
                      style={themed($infoText)}
                      size="xxs"
                      weight="normal"
                    />
                  </View>
                </View>
              </TouchableOpacity>
              {/* Choose Your Own Number-------------*/}
              {/* <TouchableOpacity
                activeOpacity={selectedOption === "yours" ? 1 : 0.5}
                onPress={() => setSelectedOption("yours")}
                style={themed([$optionContainer, selectedOption === "yours" && $selectedOptionTwo])}
              >
                <View style={themed($optionTitle)}>
                  <View
                    style={
                      selectedOption === "yours"
                        ? themed($checkIconSelected)
                        : themed($checkIconNotSelected)
                    }
                  >
                    {selectedOption === "yours" && (
                      <Icon icon="check" size={16} color={colors.background} />
                    )}
                  </View>
                  <Text
                    tx="onboardingNumberScreen:choose_yours"
                    weight={selectedOption === "yours" ? "semiBold" : "normal"}
                  />
                </View>
              </TouchableOpacity> */}
            </View>
          </View>

          <Button onPress={handleNext} tx="onboardingNumberScreen:next" style={themed($btnNext)} />
        </View>
      </Screen>
    )
  },
)

const $root: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.background,
})

const $contentContainer: ThemedStyle<ViewStyle> = () => ({
  flexGrow: 1,
  justifyContent: "center",
})

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  width: "100%",
  alignItems: "center",
  gap: spacing.xxxl,
})

const $sectionContainer: ThemedStyle<TextStyle> = ({ spacing }) => ({
  gap: spacing.xxl - spacing.xs,
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

const $outerOptionContainer: ThemedStyle<TextStyle> = ({ spacing }) => ({
  gap: spacing.md,
})

const $optionContainer: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.transparent,
  width: 321,
  padding: spacing.md,
  paddingVertical: spacing.sm,
  gap: spacing.md,
})

const $optionTitle: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  gap: spacing.md,
  alignItems: "center",
  zIndex: -1,
})

const $checkIconSelected: ThemedStyle<ViewStyle> = ({ colors }) => ({
  justifyContent: "center",
  alignSelf: "center",
  height: 20,
  width: 20,
  borderColor: colors.defaultPrimary,
  borderWidth: 1.5,
  borderRadius: 100,
  backgroundColor: colors.defaultPrimary,
})

const $checkIconNotSelected: ThemedStyle<ViewStyle> = ({ colors }) => ({
  justifyContent: "center",
  alignSelf: "center",
  height: 20,
  width: 20,
  borderColor: colors.defaultPrimary,
  borderWidth: 1.5,
  borderRadius: 100,
})
const $selectedOptionOne: ThemedStyle<TextStyle> = ({ colors }) => ({
  width: 321,
  height: 205,
  backgroundColor: colors.background,
  borderRadius: 20,
  borderWidth: 1,
  borderColor: colors.textDim,
  alignItems: "flex-start",

  shadowColor: colors.shadowPrimary,
  shadowOpacity: 0.1,
  shadowRadius: 12,
  elevation: 4,
})
const $infoBox: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  width: "100%",
  // height: "80%",
  borderRadius: 16,
  backgroundColor: colors.infoBackground,
  padding: spacing.md,
  paddingVertical: spacing.sm,
})

const $infoBoxHidden: ThemedStyle<ViewStyle> = () => ({
  display: "none",
})

const $info: ThemedStyle<TextStyle> = ({ colors }) => ({
  width: 230,
  height: 88,
  flexDirection: "row",
  alignItems: "center",
  color: colors.info,
  gap: 12,
})

const $infoText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.info,
})

const $selectedOptionTwo: ThemedStyle<TextStyle> = ({ colors }) => ({
  width: 321,
  backgroundColor: colors.background,
  borderRadius: 53,
  borderWidth: 1,
  borderColor: colors.textDim,
  alignItems: "flex-start",
  shadowColor: colors.shadowPrimary,
  shadowOpacity: 0.1,
  shadowRadius: 12,
  elevation: 4,
})

const $btnNext: ThemedStyle<TextStyle> = () => ({
  width: 260,
})
