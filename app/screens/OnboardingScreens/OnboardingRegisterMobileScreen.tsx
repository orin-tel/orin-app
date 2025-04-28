import { FC, useCallback, useState } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, View, ViewStyle } from "react-native"
import { OnboardingStackScreenProps } from "@/navigators"
import { Button, Icon, PhoneTextField, Screen, Text } from "@/components"
import { $styles, ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import { useStores } from "@/models"
import { useProgress } from "@/context/ProgressProvider"
import { useFocusEffect } from "@react-navigation/native"
import { userStore } from "@/models/UserStore"
import { GeneralApiProblem } from "@/services/api/apiProblem"
import {
  PhoneNumberUtil,
  PhoneNumber,
  PhoneNumberFormat,
  AsYouTypeFormatter,
} from "google-libphonenumber"
import { TxKeyPath } from "@/i18n"
import { PHONE_CODE_MAP } from "@/constants"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "@/models"

export const OnboardingRegisterMobileScreen: FC<
  OnboardingStackScreenProps<"OnboardingRegisterMobile">
> = observer(function OnboardingRegisterMobileScreen(_props) {
  // Pull in one of our MST stores
  const [loading, setLoading] = useState<boolean>(false)
  const [otpError, setOtpError] = useState<TxKeyPath>()
  const { locationStore, userStore, episodeStore } = useStores()
  const { setProgress } = useProgress()
  useFocusEffect(
    useCallback(() => {
      setProgress(0.1)
    }, []),
  )

  const { navigation } = _props

  const handleOTPGeneration = async () => {
    if (!userStore.userPhoneNumber) {
      return
    }
    setLoading(true)
    const phoneNumber = (userStore.userCountryPhoneCode ?? "+1") + userStore.userPhoneNumber
    // validate phone number
    const phoneUtil = PhoneNumberUtil.getInstance()
    const parsedNumber = phoneUtil.parse(phoneNumber, "")
    const isValid = phoneUtil.isValidNumber(parsedNumber)
    console.log("userPhoneNumber", parsedNumber)
    if (!isValid) {
      setOtpError("onboardingRegisterMobileScreen:invalid_number")
      setLoading(false)
      return
    }
    const phone_number_e164 = phoneUtil.format(parsedNumber, PhoneNumberFormat.E164)
    const response = await userStore.requestOtp(phone_number_e164)
    if (typeof response === "boolean") {
      if (response) {
        // Handle API for otp generation
        navigation.navigate("Onboarding", {
          screen: "OnboardingCountry",
        })
        setOtpError(undefined)
      } else {
        // do nothing if it returns false
      }
    } else {
      // handle general api error
      setOtpError(`generalApiProblem:${response.kind}`)
    }
    setLoading(false)
  }

  const handleUserPhoneNumberEdit = useCallback(
    (text: string) => {
      const phoneUtil = PhoneNumberUtil.getInstance()
      const countryCode = PHONE_CODE_MAP[userStore.userCountryPhoneCode ?? "US"]
      const formatter = new AsYouTypeFormatter(countryCode)
    },
    [userStore.userCountryPhoneCode],
  )

  const { themed } = useAppTheme()
  return (
    <Screen
      style={themed($root)}
      contentContainerStyle={[$styles.container, themed($contentContainer)]}
      // safeAreaEdges={["top"]}
      preset="fixed"
    >
      <View style={themed($registration)}>
        <Text
          preset="default"
          tx="onboardingRegisterMobileScreen:register"
          style={themed($register)}
          size="xl"
          weight="medium"
        />
        <PhoneTextField
          value={userStore.userPhoneNumber ?? ""}
          onChangeText={handleUserPhoneNumberEdit}
          setValue={userStore.setUserPhoneNumber}
          countryPhoneCode={
            userStore.userCountryPhoneCode ?? locationStore.countryPhoneCode ?? "+1"
          }
          dismissOnSelect
          setCountryPhoneCode={userStore.setUserCountryPhoneCode}
          placeholder="000-000-000"
        />
        <Button
          preset="default"
          tx="onboardingRegisterMobileScreen:get_otp"
          style={themed($getOtpBtn)}
          onPress={handleOTPGeneration}
          loading={loading}
        />
        {otpError && (
          <View style={[$styles.row, themed($errorContainer)]}>
            <Icon icon="infoCircle" color={themed($errorStyle).color?.toString()} />
            <Text tx={otpError} style={themed($errorStyle)} />
          </View>
        )}
      </View>
    </Screen>
  )
})

const $root: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.background,
  // backgroundColor: "white",
})

const $register: ThemedStyle<TextStyle> = () => ({
  textAlign: "center",
})

const $registration: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  // justifyContent: "center",
  // alignItems: "center",
  // width: "100%",
  gap: spacing.lg,
  marginTop: spacing.xxxl * 2,
})

const $getOtpBtn: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  width: "80%",
  alignSelf: "center",
  marginTop: spacing.xxxl,
})

const $contentContainer: ThemedStyle<ViewStyle> = ({}) => ({
  // alignItems: "center",
  // justifyContent: "center",
  alignItems: "stretch",
  justifyContent: "flex-start",
  height: "100%",
})

const $errorContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  width: "100%",
  alignItems: "center",
  justifyContent: "center",
  marginTop: spacing.md,
  gap: spacing.sm,
})

const $errorStyle: ThemedStyle<TextStyle> = ({ colors }) => ({
  // alignItems: "center",
  // justifyContent: "center",
  textAlign: "center",
  color: colors.error,
})
