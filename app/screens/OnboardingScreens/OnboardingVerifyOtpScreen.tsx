import { FC, useCallback, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, View, ViewStyle } from "react-native"
import { OnboardingStackScreenProps } from "@/navigators"
import { Button, Icon, Screen, Text } from "@/components"
import { getHash, removeListener, startOtpListener } from "react-native-otp-verify"
import { OtpInput } from "react-native-otp-entry"
import { $styles, ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import { useStores } from "@/models"
import { useProgress } from "@/context/ProgressProvider"
import { useFocusEffect } from "@react-navigation/native"
import { PhoneNumberFormat, PhoneNumberUtil } from "google-libphonenumber"
import { TxKeyPath } from "@/i18n"
import { userStore } from "@/models/UserStore"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "@/models"

export const OnboardingVerifyOtpScreen: FC<OnboardingStackScreenProps<"OnboardingVerifyOtp">> =
  observer(function OnboardingVerifyOtpScreen(_props) {
    // Pull in one of our MST stores
    const {
      userStore: { userPhoneNumber, userCountryPhoneCode },
    } = useStores()
    // Pull in navigation via hook
    // const navigation = useNavigation()
    const {
      themed,
      theme: { colors },
    } = useAppTheme()
    const [otp, setOtp] = useState<string>()

    const [initialResendShow, setInitialResendShow] = useState(false)
    const [countdown, setCountdown] = useState(60)
    const [isResendDisabled, setIsResendDisabled] = useState(true)
    const [loading, setLoading] = useState(false)
    const [verifyOtpError, setVerifyOtpError] = useState<TxKeyPath>()

    useEffect(() => {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
        return () => clearTimeout(timer) // Cleanup function
      } else {
        setIsResendDisabled(false)
        setInitialResendShow(true)
      }

      return undefined // Explicitly return undefined for all paths
    }, [countdown])

    const { setProgress } = useProgress()
    useFocusEffect(
      useCallback(() => {
        setProgress(0.2)
      }, []),
    )

    const handleResendOtp = async () => {
      setCountdown(60) // Reset countdown
      setIsResendDisabled(true)
      if (!userPhoneNumber) {
        return
      }
      const phoneNumber = userCountryPhoneCode + userPhoneNumber
      // validate phone number
      const phoneUtil = PhoneNumberUtil.getInstance()
      const parsedNumber = phoneUtil.parse(phoneNumber, "")
      const isValid = phoneUtil.isValidNumber(parsedNumber)

      if (!isValid) {
        setVerifyOtpError("onboardingRegisterMobileScreen:invalid_number")
        return
      }
      const phone_number_e164 = phoneUtil.format(parsedNumber, PhoneNumberFormat.E164)
      const response = await userStore.requestOtp(phone_number_e164)
      if (typeof response === "boolean") {
        // do nothing
      } else {
        // handle general api error
        setVerifyOtpError(`generalApiProblem:${response.kind}`)
      }
      setVerifyOtpError(undefined)
    }

    const handleOtpVerify = async () => {
      if (!otp || otp?.length !== 4) {
        return
      }
      if (!userPhoneNumber) {
        return
      }
      setLoading(true)
      const phoneNumber = userCountryPhoneCode + userPhoneNumber
      // validate phone number
      const phoneUtil = PhoneNumberUtil.getInstance()
      const parsedNumber = phoneUtil.parse(phoneNumber, "")
      const isValid = phoneUtil.isValidNumber(parsedNumber)
      if (!isValid) {
        setVerifyOtpError("onboardingVerifyOtpScreen:invalid_number_issue")
        setLoading(false)
        return
      }
      const phone_number_e164 = phoneUtil.format(parsedNumber, PhoneNumberFormat.E164)
      const response = await userStore.verifyOtp(otp, phone_number_e164)

      if (typeof response === "boolean") {
        if (response) {
          _props.navigation.navigate("Onboarding", {
            screen: "OnboardingCountry",
          })
          setVerifyOtpError(undefined)
        }
      } else {
        setVerifyOtpError(`generalApiProblem:${response.kind}`)
      }
      setLoading(false)
    }
    // using methods
    useEffect(() => {
      getHash()
        .then((_hash) => {
          // use this hash in the message.
          // send hash to server
        })
        .catch(console.log)

      startOtpListener((message) => {
        // extract the otp using regex e.g. the below regex extracts 4 digit otp from message
        const otp = /(\d{4})/g.exec(message)?.[1]
        setOtp(otp)
      })
      return () => removeListener()
    }, [])
    return (
      <Screen
        style={themed($root)}
        contentContainerStyle={[$styles.container, themed($contentContainer)]}
        // safeAreaEdges={["top"]}
        preset="fixed"
      >
        <View style={themed($otpVerify)}>
          <Text
            preset="default"
            tx="onboardingVerifyOtpScreen:otp_verification"
            style={themed($otpTextHeader)}
            size="xl"
            weight="medium"
          />
          <Text
            preset="default"
            tx="onboardingVerifyOtpScreen:otp_successfully_sent_to"
            style={themed($otpText)}
            size="lg"
          />
          <Text
            preset="default"
            text={userCountryPhoneCode + " " + userPhoneNumber}
            style={themed($otpText)}
            size="lg"
          />
          <OtpInput
            numberOfDigits={4}
            focusColor="green"
            autoFocus={false}
            hideStick={true}
            placeholder="****"
            blurOnFilled={true}
            disabled={false}
            type="numeric"
            secureTextEntry={false}
            focusStickBlinkingDuration={500}
            onFocus={() => console.log("Focused")}
            onBlur={() => console.log("Blurred")}
            onTextChange={(text) => console.log(text)}
            onFilled={(text) => setOtp(text)}
            textInputProps={{
              accessibilityLabel: "One-Time Password",
            }}
            theme={{
              containerStyle: themed($otpContainerStyle),
              pinCodeContainerStyle: themed($pinCodeContainerStyle),
              pinCodeTextStyle: themed($pinCodeTextStyle),
              // focusStickStyle: styles.focusStick,
              focusedPinCodeContainerStyle: themed($focusedPinCodeContainerStyle),
              // placeholderTextStyle: styles.placeholderText,
              // filledPinCodeContainerStyle: styles.filledPinCodeContainer,
              // disabledPinCodeContainerStyle: styles.disabledPinCodeContainer,
            }}
          />
          {initialResendShow && (
            <Button
              preset="default"
              tx="onboardingVerifyOtpScreen:resend_otp"
              style={themed($resendOtpBtn)}
              textStyle={themed($resendOtpBtnText)}
              pressedStyle={themed($resendOtpBtnPressed)}
              pressedTextStyle={themed($resendOtpBtnTextPressed)}
              disabled={isResendDisabled}
              disabledTextStyle={themed($resendOtpBtnTextPressed)}
              onPress={handleResendOtp}
              LeftAccessory={(props) => (
                <Icon
                  icon="refresh"
                  size={20}
                  color={
                    props.pressableState.pressed
                      ? colors.textDim
                      : props.disabled
                        ? colors.textDim
                        : colors.text
                  }
                  containerStyle={[props.style, themed($refreshStyle)]}
                />
              )}
            />
          )}
          <Button
            preset="default"
            tx="onboardingVerifyOtpScreen:confirm_otp"
            style={themed($getOtpBtn)}
            onPress={handleOtpVerify}
            loading={loading}
          />
          {verifyOtpError && (
            <View style={[$styles.row, themed($errorContainer)]}>
              <Icon icon="infoCircle" color={themed($errorStyle).color?.toString()} />
              <Text tx={verifyOtpError} style={themed($errorStyle)} />
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

const $otpTextHeader: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.xl,
  alignSelf: "center",
})

const $otpText: ThemedStyle<TextStyle> = () => ({
  textAlign: "center",
})

const $otpVerify: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  // justifyContent: "center",
  // alignItems: "center",
  // width: "100%",
  gap: spacing.sm,
})

const $resendOtpBtn: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: "40%",
  alignSelf: "center",
  borderColor: colors.transparent,
  backgroundColor: colors.transparent,
  // marginTop: spacing.xxxl,
})

const $resendOtpBtnText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  // marginTop: spacing.xxxl,
})

const $resendOtpBtnPressed: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.transparent,
})

const $resendOtpBtnTextPressed: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})

const $refreshStyle: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginRight: spacing.xs,
})

const $getOtpBtn: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  width: "80%",
  alignSelf: "center",
  marginTop: spacing.xxxl,
})

const $contentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  // alignItems: "center",
  // justifyContent: "center",
  alignItems: "stretch",
  justifyContent: "center",
  height: "100%",
  gap: spacing.xxxl * 2,
})

/**
 * OTP Styling
 */
const $otpContainerStyle: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.xl,
  marginBottom: spacing.md,
  width: "80%",
  alignSelf: "center",
})

const $pinCodeContainerStyle: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  backgroundColor: colors.inputBackground,
  borderColor: colors.transparent,
  width: spacing.xxl + spacing.xs,
})

const $focusedPinCodeContainerStyle: ThemedStyle<ViewStyle> = ({ colors }) => ({
  borderColor: colors.border,
})

const $pinCodeTextStyle: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
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
