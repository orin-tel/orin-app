import { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { SettingStackScreenProps } from "@/navigators"
import { Button, Icon, PhoneTextField, Screen, Switch, Text, TextField } from "@/components"
import { colors, spacing, ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import { LanguageSelect } from "@/components/LanguageSelect"
import { CountrySelect } from "@/components/CountrySelect"
import { PhoneVerify } from "@/components/PhoneVerify"
import { CodeSelect } from "@/components/CodeSelect"
import { COUNTRY_MAP } from "@/constants"
import { useStores } from "@/models"

export const ConnectCallsScreen: FC<SettingStackScreenProps<"ConnectCalls">> = observer(
  function ConnectCallsScreen(_props) {
    const {
      userStore: {
        userTransferPhoneNumber,
        userTransferPhoneCode,
        setUserTransferPhoneNumber,
        setUserTransferPhoneCode,
      },
    } = useStores()
    const [selectedOption, setSelectedOption] = useState<"1" | "2" | "3">("2")
    const [value, setValue] = useState("")
    const [transfer, setTransfer] = useState(true)
    const [otpVerified, setOtpVerified] = useState(false)
    const [blockAI, setBlockAI] = useState(false)
    const [blockSpam, setBlockSpam] = useState(false)
    const { themed } = useAppTheme()

    const verify = () => {
      setOtpVerified(true)
    }
    const { navigation } = _props
    const gotoExpectedCalls = () => {
      navigation.navigate("ExpectedCalls")
    }
    return (
      <Screen style={themed($contentContainer)} preset="scroll">
        <View style={themed($container)}>
          <View style={themed($optionsContainer)}>
            {/* Transfer calls */}
            <View style={themed($transfer)}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setTransfer(!transfer)}
                style={themed($transferInnerOne)}
              >
                <View style={themed($textContainer)}>
                  <Text tx="connectCallsScreen:transfer" size="sm" weight="semiBold" />
                  <Text tx="connectCallsScreen:transfer_desc" size="xs" />
                </View>
                <View style={themed($toggleContainer)}>
                  <Switch value={transfer} onValueChange={setTransfer} />
                </View>
              </TouchableOpacity>
              <View style={transfer ? themed($horizontalLine) : { display: "none" }} />
              {/* Verify number -----------------*/}
              <View style={transfer ? themed($transferInnerTwo) : { display: "none" }}>
                <Text
                  tx="connectCallsScreen:enter_personal"
                  size="sm"
                  weight="medium"
                  style={themed($transferInnerText)}
                />
                <PhoneVerify
                  style={themed($phoneComponent)}
                  value={userTransferPhoneNumber ?? ""}
                  setValue={setUserTransferPhoneNumber}
                  countryPhoneCode={userTransferPhoneCode ?? "+91"}
                  setCountryPhoneCode={setUserTransferPhoneCode}
                  placeholder="000-000-000"
                />
              </View>
              {/* Otp-------------- */}
              <View
                style={transfer && !otpVerified ? themed($transferInnerTwo) : { display: "none" }}
              >
                <View style={transfer ? themed($horizontalLineTemp) : { display: "none" }} />
                <Text
                  tx="connectCallsScreen:enter_otp"
                  size="sm"
                  weight="medium"
                  style={themed($transferInnerText)}
                />
                {/* <View style={themed($phoneOtp)}> */}
                <TextField
                  value={value}
                  onChangeText={setValue}
                  maxLength={4}
                  keyboardType="decimal-pad"
                  style={themed($phoneOtp)}
                />
                {/* </View> */}
                <Button
                  style={themed($verifyBtn)}
                  tx="connectCallsScreen:verify_number"
                  onPress={() => verify()}
                />
              </View>
              <View style={transfer ? themed($horizontalLine) : { display: "none" }} />
              {/* Choose one option-------------- */}
              <View
                style={
                  transfer
                    ? otpVerified
                      ? themed($transferOptionsUnfaded)
                      : themed($transferOptionsFaded)
                    : { display: "none" }
                }
              >
                <Text
                  tx="connectCallsScreen:choose"
                  size="sm"
                  weight="medium"
                  style={themed($transferInnerText)}
                />
                <View style={themed($outerOptionContainer)}>
                  {/**1--------------- */}
                  <TouchableOpacity
                    activeOpacity={selectedOption === "1" || !otpVerified ? 1 : 0.5}
                    onPress={() => {
                      if (otpVerified) setSelectedOption("1")
                    }}
                    style={themed([
                      $optionContainer,
                      selectedOption === "1" && $selectedOption,
                      !otpVerified && $selectedOptionFaded,
                    ])}
                  >
                    <View style={themed($optionTitle)}>
                      <View
                        style={
                          selectedOption === "1"
                            ? themed($checkIconSelected)
                            : themed($checkIconNotSelected)
                        }
                      >
                        {selectedOption === "1" && (
                          <Icon icon="check" size={16} color={colors.background} />
                        )}
                      </View>
                      <Text
                        tx="connectCallsScreen:transfer_all"
                        weight={selectedOption === "1" ? "semiBold" : "normal"}
                      />
                    </View>
                  </TouchableOpacity>
                  {/**2--------------- */}
                  <TouchableOpacity
                    activeOpacity={selectedOption === "2" || !otpVerified ? 1 : 0.5}
                    onPress={() => {
                      if (otpVerified) setSelectedOption("2")
                    }}
                    style={themed([
                      $optionContainer,
                      selectedOption === "2" && $selectedOption,
                      !otpVerified && $selectedOptionFaded,
                    ])}
                  >
                    <View style={themed($optionTitle)}>
                      <View
                        style={
                          selectedOption === "2"
                            ? themed($checkIconSelected)
                            : themed($checkIconNotSelected)
                        }
                      >
                        {selectedOption === "2" && (
                          <Icon icon="check" size={16} color={colors.background} />
                        )}
                      </View>
                      <Text
                        tx="connectCallsScreen:transfer_genuine"
                        weight={selectedOption === "2" ? "semiBold" : "normal"}
                      />
                    </View>
                  </TouchableOpacity>
                  {/**3--------------- */}
                  <TouchableOpacity
                    activeOpacity={selectedOption === "3" || !otpVerified ? 1 : 0.5}
                    onPress={() => {
                      if (otpVerified) setSelectedOption("3")
                      return null
                    }}
                    style={themed([
                      $optionContainer,
                      selectedOption === "3" && $selectedOption,
                      !otpVerified && $selectedOptionFaded,
                    ])}
                  >
                    <View style={themed($optionTitle)}>
                      <View
                        style={
                          selectedOption === "3"
                            ? themed($checkIconSelected)
                            : themed($checkIconNotSelected)
                        }
                      >
                        {selectedOption === "3" && (
                          <Icon icon="check" size={16} color={colors.background} />
                        )}
                      </View>
                      <Text
                        tx="connectCallsScreen:transfer_whitelisted"
                        weight={selectedOption === "3" ? "semiBold" : "normal"}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            {/* Block AI */}
            <TouchableOpacity
              onPress={() => setBlockAI(!blockAI)}
              activeOpacity={0.8}
              style={themed($item)}
            >
              <View style={themed($textContainer)}>
                <Text tx="connectCallsScreen:blockAI" size="sm" weight="semiBold" />
                <Text tx="connectCallsScreen:blockAI_desc" size="xs" />
              </View>
              <View style={themed($toggleContainer)}>
                <Switch value={blockAI} onValueChange={setBlockAI} />
              </View>
            </TouchableOpacity>
            {/* Block Spam */}
            <TouchableOpacity
              onPress={() => setBlockSpam(!blockSpam)}
              activeOpacity={0.8}
              style={themed($item)}
            >
              <View style={themed($textContainer)}>
                <Text tx="connectCallsScreen:blockSpam" size="sm" weight="semiBold" />
                <Text tx="connectCallsScreen:blockSpam_desc" size="xs" />
              </View>
              <View style={themed($toggleContainer)}>
                <Switch value={blockSpam} onValueChange={setBlockSpam} />
              </View>
            </TouchableOpacity>
            {/* Expecting Calls */}
            <View style={themed($expecting)}>
              <View style={themed($textContainer)}>
                <Text tx="connectCallsScreen:expecting" size="sm" weight="semiBold" />
                <Text tx="connectCallsScreen:expecting_desc" size="xs" />
              </View>
              <TouchableOpacity
                onPress={gotoExpectedCalls}
                activeOpacity={0.8}
                style={themed($viewAllContainer)}
              >
                <Text tx="connectCallsScreen:view_all" size="sm" weight="medium" />
                <Icon icon="caretRight" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Screen>
    )
  },
)

const $contentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexGrow: 1,
  padding: spacing.md,
})

const $container: ThemedStyle<ViewStyle> = () => ({
  paddingBottom: spacing.md + spacing.xxs,
})

const $optionsContainer: ThemedStyle<ViewStyle> = () => ({
  gap: spacing.md + spacing.xxs,
  padding: 0,
})

const $textContainer: ThemedStyle<TextStyle> = ({ spacing }) => ({
  gap: spacing.xs,
  width: 300,
})

const $toggleContainer: ThemedStyle<ViewStyle> = () => ({
  alignItems: "center",
})
const $item: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  padding: spacing.sm,
  borderRadius: 20,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: colors.inputBackground,
})

const $transfer: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  padding: spacing.sm,
  borderRadius: 20,
  gap: spacing.sm,
  justifyContent: "space-between",
  backgroundColor: colors.inputBackground,
})
const $transferInnerOne: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  borderRadius: 20,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: colors.inputBackground,
})
const $horizontalLine: ThemedStyle<ViewStyle> = ({ colors }) => ({
  paddingTop: spacing.xs,
  borderBottomColor: colors.defaultPrimary,
  borderBottomWidth: 0.5,
})
const $horizontalLineTemp: ThemedStyle<ViewStyle> = ({ colors }) => ({
  paddingTop: spacing.xs,
  marginBottom: spacing.sm,
  borderBottomColor: colors.defaultPrimary,
  borderBottomWidth: 0.5,
})
const $verifyBtn: ThemedStyle<ViewStyle> = ({ colors }) => ({
  marginTop: spacing.sm,
})
const $transferInnerTwo: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  backgroundColor: colors.inputBackground,
})
const $transferOptionsUnfaded: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  backgroundColor: colors.inputBackground,
})
const $transferOptionsFaded: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  backgroundColor: colors.inputBackground,
  opacity: 0.3,
  shadowColor: colors.shadowPrimary,
  shadowOpacity: 0.0,
  shadowRadius: 0,
  elevation: 0,
})
const $transferInnerText: ThemedStyle<ViewStyle> = ({ colors }) => ({})
const $phoneNumber: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 330,
  height: 40,
  backgroundColor: colors.background,
  borderRadius: 20,
  alignSelf: "center",
  alignItems: "center",
  justifyContent: "center",
  marginTop: spacing.sm,
  marginHorizontal: 0,
  paddingLeft: spacing.sm,
})
const $phoneComponent: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 330,
  borderRadius: 20,
  alignSelf: "center",
  marginTop: spacing.sm,
})
const $phoneVerify: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 330,
  height: 40,
  backgroundColor: colors.background,
  borderRadius: 20,
  alignSelf: "center",
  alignItems: "center",
  justifyContent: "center",
  marginTop: spacing.sm,
  marginHorizontal: 0,
})
const $phoneOtp: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 330,
  height: 40,
  backgroundColor: colors.background,
  borderRadius: 20,
  alignSelf: "center",
  // alignItems: "center",
  justifyContent: "center",
  marginTop: spacing.sm,
  marginHorizontal: 0,
  paddingLeft: spacing.sm,
})

// options
const $outerOptionContainer: ThemedStyle<TextStyle> = ({ spacing }) => ({
  gap: spacing.md,
  paddingTop: spacing.sm,
  alignItems: "center",
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
const $selectedOptionFaded: ThemedStyle<TextStyle> = ({ colors }) => ({
  width: 321,
  backgroundColor: colors.background,
  borderRadius: 53,
  borderWidth: 1,
  borderColor: colors.textDim,
  alignItems: "flex-start",
  shadowColor: colors.shadowPrimary,
  shadowOpacity: 0,
  shadowRadius: 0,
  elevation: 0,
})

const $expecting: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  padding: spacing.sm,
  borderRadius: 20,
  justifyContent: "space-between",
  backgroundColor: colors.inputBackground,
  gap: spacing.sm,
  marginBottom: spacing.sm,
})
const $viewAllContainer: ThemedStyle<ViewStyle> = ({ colors }) => ({
  alignSelf: "center",
  width: 300,
  padding: spacing.sm - spacing.xxxs,
  paddingHorizontal: 16,
  borderRadius: 100,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: colors.palette.primary100,
})
