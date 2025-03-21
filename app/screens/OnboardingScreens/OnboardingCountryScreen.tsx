import { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, ViewStyle } from "react-native"
import { Button, Icon, Screen, Text } from "@/components"
import { OnboardingStackScreenProps } from "@/navigators"
import { View } from "react-native"
import { useAppTheme } from "@/utils/useAppTheme"
import { $styles, spacing, ThemedStyle } from "@/theme"
import { SelectField } from "@/components/SelectField"
import { colors } from "./../../theme/colors"
import { COUNTRY_MAP } from "@/constants"

export const OnboardingCountryScreen: FC<OnboardingStackScreenProps<"OnboardingCountry">> =
  observer(function OnboardingCountryScreen(_props) {
    const [selectedTeam, setSelectedTeam] = useState<string[]>([])

    const { themed } = useAppTheme()
    return (
      <Screen
        style={themed($root)}
        contentContainerStyle={[$styles.container, themed($contentContainer)]}
        safeAreaEdges={["top"]}
        preset="scroll"
      >
        <View style={themed($container)}>
          <View style={themed($sectionContainer)}>
            <View style={themed($textContainer)}>
              <Text tx="onboardingCountryScreen:title" style={themed($sectionTitle)} size="xl" weight="bold" />
              <Text tx="onboardingCountryScreen:description" style={themed($sectionText)} size="sm" weight="normal" />
            </View>
            {/* <Button
              tx="onboardingCountryScreen:selector_text" style={themed($btnSelect)} textStyle={themed($btnSelectText)}
              LeftAccessory={() => <Icon icon="world" size={20} />}
              RightAccessory={() => <Icon icon="dropdown" size={20} color="#DC7793" />}
            /> */}
            <SelectField
              style={themed($selectField)}
              placeholderTx="onboardingCountryScreen:select_country"
              value={selectedTeam}
              onSelect={setSelectedTeam}
              options={COUNTRY_MAP}
              multiple={false}
              containerStyle={{ marginBottom: spacing.lg }}
              LeftAccessory={(props) => (
                <Icon icon="world" size={20} containerStyle={props.style} />
              )}
              RightAccessory={(props) => (
                <Icon icon="dropdown" size={20} color={colors.error} containerStyle={props.style} />
              )}
            />
          </View>
          <Button
            text="Next"
            style={themed($btnNext)}
            textStyle={themed($btnNextText)}
            onPress={() => {
              _props.navigation.navigate("Onboarding", {
                screen: "OnboardingRegisterMobile",
              })
            }}
          />
        </View>
      </Screen>
    )
  })

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
  // height: "75%", // originally no height was specified here
  alignItems: "center",
  gap: spacing.xxxl,
})

const $sectionContainer: ThemedStyle<TextStyle> = ({ spacing }) => ({
  // gap: spacing.xxl,
  gap: spacing.xxl,
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

const $btnNext: ThemedStyle<TextStyle> = ({ colors }) => ({
  width: 260,
  backgroundColor: colors.defaultPrimary,
  color: colors.text,
  borderRadius: 100,
})

const $selectField: ThemedStyle<TextStyle> = ({ }) => ({
  width: 345,
  borderRadius: 100,
  borderWidth: 0,
  justifyContent: "space-between",
})

const $btnNextText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.background,
})
