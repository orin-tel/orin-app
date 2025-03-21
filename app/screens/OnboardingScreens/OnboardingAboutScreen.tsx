import { FC, useCallback } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, View, ViewStyle } from "react-native"
import { OnboardingStackScreenProps } from "@/navigators"
import { Button, Icon, Screen, Text, TextField } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import { colors, spacing, ThemedStyle } from "@/theme"
import { useProgress } from "@/context/ProgressProvider"
import { useFocusEffect } from "@react-navigation/native"
import { useStores } from "@/models"

export const OnboardingAboutScreen: FC<OnboardingStackScreenProps<"OnboardingAbout">> = observer(
  function OnboardingAboutScreen(_props) {
    const { themed } = useAppTheme()

    const {
      userStore: {
        setUserName,
        setUserAbout,
      },
    } = useStores()

    // progress bar
    const { navigation } = _props;

    const { setProgress } = useProgress();
    useFocusEffect(
      useCallback(() => {
        setProgress(0.8);
      }, [])
    );

    const handleNext = () => {
      navigation.navigate("OnboardingAgent");
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
              <Text tx="onboardingAboutScreen:title" style={themed($sectionTitle)} size="xl" weight="bold" />
              <Text tx="onboardingAboutScreen:description" style={themed($sectionText)} size="sm" weight="normal" />
            </View>
            <View style={themed($sectionContainerTwo)}>
              <View>
                {/**User Name */}
                <Text tx="onboardingAboutScreen:label_one" style={themed($label)}
                  weight="medium" />
                <TextField
                  inputWrapperStyle={themed($nameInputBox)}
                  placeholderTx="onboardingAboutScreen:example_name"
                  onChangeText={setUserName}
                  LeftAccessory={(props) => (
                    <Icon icon="person" size={20} containerStyle={props.style} />
                  )} />
              </View>
              <View>
                {/**User About */}
                <Text tx="onboardingAboutScreen:label_two" style={themed($label)}
                  weight="medium" />
                <TextField
                  multiline
                  onChangeText={setUserAbout}
                  style={themed($infoInput)}
                  inputWrapperStyle={themed($infoInputWrapper)}
                  placeholderTx="onboardingAboutScreen:example_info"
                />

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
  gap: spacing.xxl - spacing.xs,
  alignItems: "center",
})
const $sectionContainerTwo: ThemedStyle<TextStyle> = ({ spacing }) => ({
  gap: spacing.lg + spacing.xxs,
  alignSelf: "center",
})

const $label: ThemedStyle<TextStyle> = ({ spacing }) => ({
  gap: spacing.xxs,
  paddingBottom: spacing.sm - spacing.xxxs,

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
