import { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { SettingStackScreenProps } from "@/navigators"
import { Button, Icon, Screen, Text, TextField } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import { colors, spacing, ThemedStyle } from "@/theme"
import { useStores } from "@/models"
import { LanguageSelect } from "@/components/LanguageSelect"
import { LANGUAGE_MAP } from "@/constants"
import CountryFlag from "react-native-country-flag"

export const AgentConfigScreen: FC<SettingStackScreenProps<"AgentConfig">> = observer(
  function AgentConfigScreen(_props) {
    const {
      userStore: {
        userLanguage,
        userLanguageIcon,
        userAgentName,
        userAgentVoice,
        setUserLanguage,
        setUserLanguageIcon,
        setUserAgentName,
        setUserAgentVoice,
      },
    } = useStores()

    const [editedName, setEditedName] = useState(userAgentName);
    const [selectedOption, setSelectedOption] = useState<"Voice 1" | "Voice 2" | "Voice 3" | string>(userAgentVoice ? userAgentVoice : "Voice 1");
    const updateChanges = () => {
      setUserAgentName(editedName);
      setUserAgentVoice(selectedOption);
    }

    const { themed } = useAppTheme()
    return (
      <Screen
        style={themed($root)}
        contentContainerStyle={themed($contentContainer)}
        preset="scroll"
      >
        <View style={themed($container)}>

          <View style={themed($agentDetails)}>

            <View style={themed($sectionContainerOne)}>
              <View>
                <Text tx="onboardingAgentScreen:label_one" style={themed($label)}
                  weight="medium" />
                <TextField
                  inputWrapperStyle={themed($nameInputBox)}
                  // placeholderTx="onboardingAgentScreen:example_name"
                  placeholder={`${userAgentName}`}
                  onChangeText={setEditedName}
                />
              </View>
              <View>
                <Text tx="onboardingAgentScreen:label_two" style={themed($label)}
                  weight="medium" />

                <LanguageSelect
                  style={themed($languageSelect)}
                  inputWrapperStyle={themed($nameInputBox)}
                  placeholderTx="onboardingAgentScreen:select_language"
                  value={userLanguage ? [userLanguage] : []}
                  onSelect={(newValue) => {
                    setUserLanguage(newValue[0] ?? null);
                    setUserLanguageIcon(newValue[0] ?? null);
                  }}
                  options={LANGUAGE_MAP}
                  multiple={false}
                  LeftAccessory={(props) => {
                    if (userLanguageIcon != null)
                      return <View style={themed($countryIcon)}>
                        <CountryFlag isoCode={userLanguageIcon} size={16} />
                      </View>
                    return <Icon icon="world" size={20} containerStyle={props.style} />
                  }
                  }
                  RightAccessory={(props) => (
                    <Icon icon="dropdown" size={20} color={colors.error} containerStyle={props.style} />
                  )}
                />

              </View>
            </View>
            {/**Voice Selection--------------- */}
            <View style={themed($sectionContainerTwo)}>
              <Text tx="onboardingAgentScreen:label_three" style={themed($label)}
                weight="medium" />
              <View style={themed($outerOptionContainer)}>
                {/**Voice 1--------------- */}
                <TouchableOpacity
                  activeOpacity={selectedOption === "Voice 1" ? 1 : 0.5}
                  onPress={() => { setSelectedOption("Voice 1"); }}
                  style={themed([$optionContainer, selectedOption === "Voice 1" && $selectedOption])}
                >
                  <View style={themed($optionTitle)}>
                    <View style={selectedOption === "Voice 1" ? themed($checkIconSelected) : themed($checkIconNotSelected)}>
                      {selectedOption === "Voice 1" && <Icon icon="check" size={16} color={colors.background} />}
                    </View>
                    <Text tx="onboardingAgentScreen:voice_one" weight={selectedOption === "Voice 1" ? "semiBold" : "normal"} />
                  </View>
                </TouchableOpacity>
                {/**Voice 2--------------- */}
                <TouchableOpacity
                  activeOpacity={selectedOption === "Voice 2" ? 1 : 0.5}
                  onPress={() => { setSelectedOption("Voice 2"); }}
                  style={themed([$optionContainer, selectedOption === "Voice 2" && $selectedOption])}
                >
                  <View style={themed($optionTitle)}>
                    <View style={selectedOption === "Voice 2" ? themed($checkIconSelected) : themed($checkIconNotSelected)}>
                      {selectedOption === "Voice 2" && <Icon icon="check" size={16} color={colors.background} />}
                    </View>
                    <Text tx="onboardingAgentScreen:voice_two" weight={selectedOption === "Voice 2" ? "semiBold" : "normal"} />
                  </View>
                </TouchableOpacity>
                {/**Voice 3--------------- */}
                <TouchableOpacity
                  activeOpacity={selectedOption === "Voice 3" ? 1 : 0.5}
                  onPress={() => { setSelectedOption("Voice 3"); }}
                  style={themed([$optionContainer, selectedOption === "Voice 3" && $selectedOption])}
                >
                  <View style={themed($optionTitle)}>
                    <View style={selectedOption === "Voice 3" ? themed($checkIconSelected) : themed($checkIconNotSelected)}>
                      {selectedOption === "Voice 3" && <Icon icon="check" size={16} color={colors.background} />}
                    </View>
                    <Text tx="onboardingAgentScreen:voice_three" weight={selectedOption === "Voice 3" ? "semiBold" : "normal"} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

          </View>
          <Button tx="agentConfigScreen:save"
            style={themed($saveBtn)}
            textStyle={themed($saveBtnText)}
            onPress={updateChanges}
            LeftAccessory={(props) => <Icon icon="saveInverted" containerStyle={props.style} />}
          />
        </View>
      </Screen >
    )
  },
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

const $label: ThemedStyle<TextStyle> = ({ spacing }) => ({
  // gap: spacing.xxs,
  paddingBottom: spacing.sm - spacing.xxxs,
})

const $agentDetails: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  backgroundColor: colors.inputBackground,
  // alignItems: "center",
  borderRadius: 20,
  padding: spacing.md,
  gap: spacing.lg + spacing.xxs,
  alignItems: "center",

})

const $sectionContainerOne: ThemedStyle<TextStyle> = ({ spacing }) => ({
  gap: spacing.lg,

})
const $sectionContainerTwo: ThemedStyle<TextStyle> = ({ spacing }) => ({
})
const $outerOptionContainer: ThemedStyle<TextStyle> = ({ spacing }) => ({
  gap: spacing.md,

})

const $optionContainer: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.background,
  width: 321,
  padding: spacing.md,
  paddingVertical: spacing.sm,
  borderRadius: 53,
})

const $optionTitle: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  gap: spacing.md,
  alignItems: "center",

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

const $selectedOption: ThemedStyle<TextStyle> = ({ colors }) => ({
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

const $languageSelect: ThemedStyle<TextStyle> = ({ }) => ({
  width: 345,
  height: 36,
  borderRadius: 100,
  borderWidth: 0,
  justifyContent: "space-between",
})
const $countryIcon: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingLeft: spacing.md,
})

const $nameInputBox: ThemedStyle<TextStyle> = ({ colors }) => ({
  width: 321,
  backgroundColor: colors.background,
})

const $saveBtn: ThemedStyle<TextStyle> = ({ colors }) => ({
  width: 106,
  height: 48,
  alignSelf: "center",
  backgroundColor: colors.background,
  borderColor: colors.defaultPrimary,
  borderWidth: 2,
  shadowColor: colors.shadowPrimary,
  shadowOpacity: 0.1,
  shadowRadius: 12,
  elevation: 4,
})
const $saveBtnText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.defaultPrimary,
  paddingLeft: spacing.sm
})


