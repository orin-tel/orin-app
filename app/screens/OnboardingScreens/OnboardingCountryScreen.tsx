import { FC, useCallback, useState } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, ViewStyle } from "react-native"
import { Button, Icon, Screen, Text } from "@/components"
import { OnboardingStackScreenProps } from "@/navigators"
import { View } from "react-native"
import { useAppTheme } from "@/utils/useAppTheme"
import { $styles, spacing, ThemedStyle } from "@/theme"
import { colors } from "./../../theme/colors"
import { COUNTRY_MAP } from "@/constants"
import { useProgress } from "@/context/ProgressProvider"
import { useFocusEffect } from "@react-navigation/native"
import { CountrySelect } from "@/components/CountrySelect"
import { useStores } from "@/models"

export const OnboardingCountryScreen: FC<OnboardingStackScreenProps<"OnboardingCountry">> =
  observer(function OnboardingCountryScreen(_props) {
    const [selectedCountry, setSelectedCountry] = useState<string[]>([]);

    const {
      userStore: {
        userCountry,
        userCountryIcon,
        setUserCountry,
        setUserCountryIcon
      },
    } = useStores()
    // page indicator
    const { navigation } = _props;

    const { setProgress } = useProgress();
    useFocusEffect(
      useCallback(() => {
        setProgress(0.2);
      }, [])
    );

    const handleNext = () => {
      navigation.navigate("OnboardingNumber");
    }
    //

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
            <CountrySelect
              style={themed($selectField)}
              placeholderTx="onboardingCountryScreen:select_country"
              value={userCountry ? [userCountry] : []}
              onSelect={(newValue) => {
                setUserCountry(newValue[0] ?? null);
              }}
              options={COUNTRY_MAP}
              multiple={false}
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

const $contentContainer: ThemedStyle<ViewStyle> = () => ({
  flexGrow: 1,
  justifyContent: "center",
  alignItems: "center",
  // borderWidth: 1,

})

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  width: "100%",
  // height: "75%", // originally no height was specified here
  paddingBottom: "20%",
  alignItems: "center",
  gap: spacing.xxxl,
  // borderWidth: 1,

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
