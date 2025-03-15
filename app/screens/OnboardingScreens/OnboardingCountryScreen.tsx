import { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, ViewStyle } from "react-native"
import { Button, Icon, Screen, Text } from "@/components"
import { OnboardingStackScreenProps } from "@/navigators"
import { View } from "react-native"
import { useAppTheme } from "@/utils/useAppTheme"
import { $styles, spacing, ThemedStyle } from "@/theme"
import { SelectField } from "@/components/SelectField"
import { colors } from './../../theme/colors';



const countries = [
  { value: "US", label: "United States", code: "+1" },
  { value: "CA", label: "Canada", code: "+1" },
  { value: "GB", label: "United Kingdom", code: "+44" },
  { value: "AU", label: "Australia", code: "+61" },
  { value: "IN", label: "India", code: "+91" },
  { value: "DE", label: "Germany", code: "+49" },
  { value: "FR", label: "France", code: "+33" },
  { value: "IT", label: "Italy", code: "+39" },
  { value: "ES", label: "Spain", code: "+34" },
  { value: "BR", label: "Brazil", code: "+55" },
  { value: "CN", label: "China", code: "+86" },
  { value: "JP", label: "Japan", code: "+81" },
  { value: "RU", label: "Russia", code: "+7" },
  { value: "ZA", label: "South Africa", code: "+27" },
  { value: "MX", label: "Mexico", code: "+52" },
  { value: "AR", label: "Argentina", code: "+54" },
  { value: "NG", label: "Nigeria", code: "+234" },
  { value: "SA", label: "Saudi Arabia", code: "+966" },
  { value: "KR", label: "South Korea", code: "+82" },
  { value: "ID", label: "Indonesia", code: "+62" },
  { value: "TR", label: "Turkey", code: "+90" },
  { value: "PH", label: "Philippines", code: "+63" },
  { value: "PK", label: "Pakistan", code: "+92" },
  { value: "BD", label: "Bangladesh", code: "+880" },
  { value: "EG", label: "Egypt", code: "+20" },
];

export const OnboardingCountryScreen: FC<OnboardingStackScreenProps<"OnboardingCountry">> =
  observer(function OnboardingCountryScreen() {

    const [selectedTeam, setSelectedTeam] = useState<string[]>([]);

    const { themed } = useAppTheme()
    return (
      <Screen style={themed($root)} contentContainerStyle={[$styles.container, themed($contentContainer)]} safeAreaEdges={["top"]}
        preset="scroll">
        <View style={themed($container)}>
          <View style={themed($sectionContainer)}>
            <View style={themed($textContainer)}>
              <Text tx="onboardingCountryScreen:title" style={themed($sectionTitle)} />
              <Text tx="onboardingCountryScreen:description" style={themed($sectionText)} />
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
              options={countries}
              multiple={false}
              containerStyle={{ marginBottom: spacing.lg }}
              LeftAccessory={(props) => <Icon icon="world" size={20} containerStyle={props.style} />}
              RightAccessory={(props) => <Icon icon="dropdown" size={20} color={colors.error} containerStyle={props.style} />} 
              />
          </View>

          <Button text="Next" style={themed($btnNext)} textStyle={themed($btnNextText)} />
        </View>
      </Screen>
    )
  })

const $root: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.background,
  // backgroundColor: "white",
})

const $contentContainer: ThemedStyle<ViewStyle> = () => ({
  flexGrow: 1,
  justifyContent: "center",
})

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  width: "100%",
  alignItems: "center",
  gap: spacing.xxxl,
  // gap: 60,
})

const $sectionContainer: ThemedStyle<TextStyle> = ({ spacing }) => ({
  // gap: spacing.xxl,
  gap: spacing.xxl,
})

const $textContainer: ThemedStyle<TextStyle> = ({ spacing }) => ({
  gap: spacing.sm,
})

const $sectionTitle: ThemedStyle<TextStyle> = ({ spacing, typography }) => ({
  fontSize: spacing.lg,
  fontFamily: typography.primary.bold,
  textAlign: "center",
})


const $sectionText: ThemedStyle<TextStyle> = ({ spacing, typography }) => ({
  fontSize: spacing.md,
  fontWeight: "400",
  textAlign: "center",
})

const $btnNext: ThemedStyle<TextStyle> = ({ colors }) => ({
  width: 260,
  backgroundColor: colors.defaultPrimary,
  borderRadius: 100,
})
const $selectField: ThemedStyle<TextStyle> = ({ colors }) => ({
  width: 345,
  backgroundColor: colors.inputBackground,
  borderRadius: 100,
  borderWidth: 0,
  justifyContent: "space-between"
})

const $btnNextText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.background
})

