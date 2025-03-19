import { FC, useCallback, useState } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { OnboardingStackScreenProps } from "@/navigators"
import { Button, Icon, Screen, Text, TextField } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import { colors, spacing, ThemedStyle } from "@/theme"
import { useProgress } from "@/context/ProgressProvider"
import { useFocusEffect } from "@react-navigation/native"
import { SelectField } from "@/components/SelectField"
import { COUNTRY_MAP, LANGUAGE_MAP } from "@/constants"
import CountryFlag from "react-native-country-flag"

export const OnboardingAgentScreen: FC<OnboardingStackScreenProps<"OnboardingAgent">> = observer(
  function OnboardingAgentScreen(_props) {
    const { themed } = useAppTheme();
    const [selectedOption, setSelectedOption] = useState<"one" | "two" | "three">("one");
    const [selectedCountry, setSelectedCountry] = useState<string[]>([]);
    // progress bar
    const { navigation } = _props;

    const { setProgress } = useProgress();
    useFocusEffect(
      useCallback(() => {
        setProgress(1);
      }, [])
    );

    const handleNext = () => {

      // navigation.navigate("");
    }
    //
    return (
      <Screen
        style={themed($root)}
        contentContainerStyle={themed($contentContainer)}
        preset="scroll"
      >
        <View style={themed($container)}>

          <View style={themed($sectionContainer)}>
            <View style={themed($textContainer)}>
              <Text tx="onboardingAgentScreen:title" style={themed($sectionTitle)} size="xl" weight="bold" />
              <Text tx="onboardingAgentScreen:description" style={themed($sectionText)} size="sm" weight="normal" />
            </View>
            <View style={themed($sectionContainerOne)}>
              <View>
                <Text tx="onboardingAgentScreen:label_one" style={themed($label)}
                  weight="medium" />
                <TextField
                  inputWrapperStyle={themed($nameInputBox)}
                  placeholderTx="onboardingAgentScreen:example_name"
                  LeftAccessory={(props) => (
                    <Icon icon="person" size={20} containerStyle={props.style} />
                  )} />
              </View>
              <View>
                <Text tx="onboardingAgentScreen:label_two" style={themed($label)}
                  weight="medium" />

                <SelectField
                  style={themed($selectField)}
                  placeholderTx="onboardingAgentScreen:select_language"
                  value={selectedCountry}
                  onSelect={setSelectedCountry}
                  options={LANGUAGE_MAP}
                  multiple={false}
                  containerStyle={{ marginBottom: spacing.lg }}
                  LeftAccessory={(props) => (
                    <Icon icon="world" size={20} containerStyle={props.style} />
                    // <CountryFlag isoCode={item.value} size={16} />
                  )}
                  RightAccessory={(props) => (
                    <Icon icon="dropdown" size={20} color={colors.error} containerStyle={props.style} />
                  )}


                />

              </View>
            </View>
            <View style={themed($sectionContainerTwo)}>
              <Text tx="onboardingAgentScreen:label_three" style={themed($label)}
                weight="medium" />
              <View style={themed($outerOptionContainer)}>
                <TouchableOpacity
                  activeOpacity={selectedOption === "one" ? 1 : 0.5}
                  onPress={() => setSelectedOption("one")}
                  style={themed([$optionContainer, selectedOption === "one" && $selectedOptionTwo])}
                >
                  <View style={themed($optionTitle)}>
                    <View style={selectedOption === "one" ? themed($checkIconSelected) : themed($checkIconNotSelected)}>
                      {selectedOption === "one" && <Icon icon="check" size={16} color={colors.background} />}
                    </View>
                    <Text tx="onboardingAgentScreen:voice_one" weight={selectedOption === "one" ? "semiBold" : "normal"} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={selectedOption === "two" ? 1 : 0.5}
                  onPress={() => setSelectedOption("two")}
                  style={themed([$optionContainer, selectedOption === "two" && $selectedOptionTwo])}
                >
                  <View style={themed($optionTitle)}>
                    <View style={selectedOption === "two" ? themed($checkIconSelected) : themed($checkIconNotSelected)}>
                      {selectedOption === "two" && <Icon icon="check" size={16} color={colors.background} />}
                    </View>
                    <Text tx="onboardingAgentScreen:voice_two" weight={selectedOption === "two" ? "semiBold" : "normal"} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={selectedOption === "three" ? 1 : 0.5}
                  onPress={() => setSelectedOption("three")}
                  style={themed([$optionContainer, selectedOption === "three" && $selectedOptionTwo])}
                >
                  <View style={themed($optionTitle)}>
                    <View style={selectedOption === "three" ? themed($checkIconSelected) : themed($checkIconNotSelected)}>
                      {selectedOption === "three" && <Icon icon="check" size={16} color={colors.background} />}
                    </View>
                    <Text tx="onboardingAgentScreen:voice_three" weight={selectedOption === "three" ? "semiBold" : "normal"} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

          </View>
          <Button tx="onboardingAboutScreen:next"
            style={themed($btnValidate)}
            onPress={handleNext} />

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
  gap: spacing.lg + spacing.xxs,
  alignItems: "center",
})
const $label: ThemedStyle<TextStyle> = ({ spacing }) => ({
  gap: spacing.xxs,
  paddingBottom: spacing.sm - spacing.xxxs,
})
const $sectionContainerOne: ThemedStyle<TextStyle> = ({ spacing }) => ({
  gap: spacing.lg + spacing.xxs,
  alignSelf: "center",

})
const $sectionContainerTwo: ThemedStyle<TextStyle> = ({ spacing }) => ({
  alignSelf: "center",
})
const $outerOptionContainer: ThemedStyle<TextStyle> = ({ spacing }) => ({
  gap: spacing.md,
  alignSelf: "center",
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

const $selectField: ThemedStyle<TextStyle> = ({ }) => ({
  width: 345,
  height: 36,
  borderRadius: 100,
  borderWidth: 0,
  justifyContent: "space-between",
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
const $nameInputBox: ThemedStyle<TextStyle> = ({ colors }) => ({
  width: 321,
})
const $infoInputWrapper: ThemedStyle<TextStyle> = ({ colors }) => ({
  width: 321,
  minHeight: 140,
  borderRadius: 20,
  flexWrap: "wrap",
  textAlignVertical: "top",
})
const $infoInput: ThemedStyle<TextStyle> = ({ colors }) => ({
  width: 321,
  minHeight: 140,
  borderRadius: 20,
  flexWrap: "wrap",
  textAlignVertical: "top",
})


const $btnValidate: ThemedStyle<TextStyle> = () => ({
  width: 260,
})
