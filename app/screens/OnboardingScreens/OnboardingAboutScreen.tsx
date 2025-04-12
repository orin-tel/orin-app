import { FC, useCallback, useState } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, View, ViewStyle } from "react-native"
import { OnboardingStackScreenProps } from "@/navigators"
import { Button, Icon, Screen, Text, TextField } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import { $styles, colors, spacing, ThemedStyle } from "@/theme"
import { useProgress } from "@/context/ProgressProvider"
import { useFocusEffect } from "@react-navigation/native"
import { useStores } from "@/models"
import { IUser } from "@/services/api/user/types"
import { TxKeyPath } from "@/i18n"

export const OnboardingAboutScreen: FC<OnboardingStackScreenProps<"OnboardingAbout">> = observer(
  function OnboardingAboutScreen(_props) {
    const { themed } = useAppTheme()
    const [loading, setLoading] = useState(false)
    const [onboardingError, setOnboardingError] = useState<TxKeyPath>()
    const { userStore } = useStores()

    // progress bar
    const { navigation } = _props

    const { setProgress } = useProgress()
    useFocusEffect(
      useCallback(() => {
        setProgress(0.8)
      }, []),
    )

    const finishOnboarding = async () => {
      setLoading(true)
      const user_name_list = userStore.userName?.split(" ")
      const user_first_name = user_name_list?.[0]
      const user_last_name = user_name_list?.slice(1)?.join(" ")

      const user_location = userStore.userCountry
      const user_description = userStore.userAbout
      const agent_voice = userStore.userAgentVoice
      const agent_name = userStore.userAgentName
      const agent_language = userStore.agentLanguage

      const user: IUser = {
        first_name: user_first_name,
        last_name: user_last_name,
        user_description: user_description ?? "",
        location: user_location ?? "",
        agent_voice: agent_voice ?? "",
        agent_name: agent_name ?? "",
        agent_language: agent_language ?? "",
      }

      console.log("USER IS HERE", user)
      const response = await userStore.completeOnboarding(user)
      if (typeof response === "boolean") {
        if (response) {
          _props.navigation.navigate("Core", {
            screen: "CallLogs",
            params: {
              screen: "CallList",
            },
          })
          setOnboardingError(undefined)
        }
      } else {
        setOnboardingError(`generalApiProblem:${response.kind}`)
      }
      setLoading(false)
    }

    const handleNext = () => {
      navigation.navigate("OnboardingAgent")
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
              <Text
                tx="onboardingAboutScreen:title"
                style={themed($sectionTitle)}
                size="xl"
                weight="bold"
              />
              <Text
                tx="onboardingAboutScreen:description"
                style={themed($sectionText)}
                size="sm"
                weight="normal"
              />
            </View>
            <View style={themed($sectionContainerTwo)}>
              <View>
                {/**User Name */}
                <Text tx="onboardingAboutScreen:label_one" style={themed($label)} weight="medium" />
                <TextField
                  inputWrapperStyle={themed($nameInputBox)}
                  placeholderTx="onboardingAboutScreen:example_name"
                  value={userStore.userName ?? ""}
                  onChangeText={userStore.setUserName}
                  LeftAccessory={(props) => (
                    <Icon icon="person" size={20} containerStyle={props.style} />
                  )}
                />
              </View>
              <View>
                {/**User About */}
                <Text tx="onboardingAboutScreen:label_two" style={themed($label)} weight="medium" />
                <TextField
                  multiline
                  onChangeText={userStore.setUserAbout}
                  value={userStore.userAbout ?? ""}
                  style={themed($infoInput)}
                  inputWrapperStyle={themed($infoInputWrapper)}
                  placeholderTx="onboardingAboutScreen:example_info"
                />
              </View>
            </View>
          </View>
          <Button
            tx="onboardingAboutScreen:next"
            style={themed($btnValidate)}
            loading={loading}
            onPress={finishOnboarding}
            disabled={!!!userStore.userAbout || !!!userStore.userName}
          />
          {onboardingError && (
            <View style={[$styles.row, themed($errorContainer)]}>
              <Icon icon="infoCircle" color={themed($errorStyle).color?.toString()} />
              <Text tx={onboardingError} style={themed($errorStyle)} />
            </View>
          )}
        </View>
      </Screen>
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

const $errorContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  width: "100%",
  alignItems: "center",
  justifyContent: "center",
  gap: spacing.sm,
  marginTop: -spacing.xl,
})

const $errorStyle: ThemedStyle<TextStyle> = ({ colors }) => ({
  textAlign: "center",
  color: colors.error,
})
