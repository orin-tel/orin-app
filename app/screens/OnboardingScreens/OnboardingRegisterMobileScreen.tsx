import { FC } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, View, ViewStyle } from "react-native"
import { OnboardingStackScreenProps } from "@/navigators"
import { Button, PhoneTextField, Screen, Text } from "@/components"
import { $styles, ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import { useStores } from "@/models"
import { UserStore, userStore } from "@/models/UserStore"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "@/models"
import { userStore } from './../../models/UserStore';
import { EpisodeModel } from './../../models/Episode';

export const OnboardingRegisterMobileScreen: FC<
  OnboardingStackScreenProps<"OnboardingRegisterMobile">
> = observer(function OnboardingRegisterMobileScreen(_props) {
  // Pull in one of our MST stores
  const {
    locationStore: { countryPhoneCode },

    userStore: {
      userPhoneNumber,
      userCountryPhoneCode,
      setUserPhoneNumber,
      setUserCountryPhoneCode,
    },
    episodeStore
  } = useStores()

  const { navigation } = _props

  const handleOTPGeneration = () => {
    // Handle API for otp generation
    episodeStore.setProp("episodes", [])
    navigation.navigate("Onboarding", {
      screen: "OnboardingVerifyOtp",
    })
  }

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
          value={userPhoneNumber ?? ""}
          setValue={setUserPhoneNumber}
          countryPhoneCode={userCountryPhoneCode ?? countryPhoneCode ?? "+91"}
          setCountryPhoneCode={setUserCountryPhoneCode}
          placeholder="000-000-000"
        />
        <Button
          preset="default"
          tx="onboardingRegisterMobileScreen:get_otp"
          style={themed($getOtpBtn)}
          onPress={handleOTPGeneration}
        />
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
