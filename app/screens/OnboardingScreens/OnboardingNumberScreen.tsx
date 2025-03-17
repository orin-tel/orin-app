import { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { OnboardingStackScreenProps } from "@/navigators"
import { Button, Icon, Radio, Screen, Text } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import { ThemedStyle } from "@/theme"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "@/models"

export const OnboardingNumberScreen: FC<OnboardingStackScreenProps<"OnboardingNumber">> = observer(
  function OnboardingCountryScreen() {
    const [selectedOption, setSelectedOption] = useState<"ours" | "yours">("ours")
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
              <Text tx="onboardingNumberScreen:title" style={themed($sectionTitle)} size="xl" weight="bold" />
              <Text tx="onboardingNumberScreen:description" style={themed($sectionText)} size="sm" weight="normal" />
            </View>
            <View style={themed($outerOptionContainer)}>
              {/* Forward to ours----------------------*/}
              <TouchableOpacity
                onPress={() => setSelectedOption("ours")}
                style={themed([$optionContainer, selectedOption === "ours" && $selectedOptionOne])}
              >
                <View style={themed($optionTitle)}>
                  <Radio value={selectedOption === "ours"} />
                  <Text weight={selectedOption === "ours" ? "semiBold" : "normal"}>Forward calls to our number</Text>
                </View>
                <View style={selectedOption === "ours" ? themed($infoBox) : { display: "none" }}>
                  <Text text="+91 8716239872" size="md" weight="bold" />
                  <View>
                    <Icon icon="info-circle" />
                    <Text text="+91 8716239872" size="sm" weight="normal" />
                  </View>

                </View>
              </TouchableOpacity>
              {/* Choose Your Own Number-------------*/}
              <TouchableOpacity
                onPress={() => setSelectedOption("yours")}
                style={themed([$optionContainer, selectedOption === "yours" && $selectedOptionTwo])}
              >
                <View style={themed($optionTitle)}>
                  <Radio value={selectedOption === "yours"} />
                  <Text weight={selectedOption === "yours" ? "semiBold" : "normal"}>Choose your own number</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <Button text="Next" style={themed($btnNext)} />
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

const $optionTitle: ThemedStyle<TextStyle> = ({ spacing }) => ({
  flexDirection: "row",
  gap: spacing.md,
  alignItems: "center",
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
  width: 289,
  height: 133,
  borderRadius: 16,
  backgroundColor: colors.infoBackground,
  padding: spacing.md,
  paddingVertical: spacing.sm,
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

const $textContainer: ThemedStyle<TextStyle> = ({ spacing }) => ({
  gap: spacing.sm,
})

const $sectionTitle: ThemedStyle<TextStyle> = ({ spacing }) => ({
  textAlign: "center",
})

const $sectionText: ThemedStyle<TextStyle> = ({ spacing }) => ({

  textAlign: "center",
})

const $btnNext: ThemedStyle<TextStyle> = () => ({
  width: 260,
})


