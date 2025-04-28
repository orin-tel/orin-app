import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import {
  OnboardingCountryScreen,
  OnboardingNumberScreen,
  OnboardingRegisterMobileScreen,
  OnboardingVerifyOtpScreen,
  OnboardingValidateScreen,
  OnboardingCongratulationsScreen,
  OnboardingAboutScreen,
  OnboardingAgentScreen,
  OnboardingSyncContactsScreen,
} from "@/screens"
import { AppStackParamList, AppStackScreenProps } from "."
import {
  CompositeScreenProps,
  createNavigationContainerRef,
  RouteProp,
  useNavigation,
} from "@react-navigation/native"
import { useAppTheme } from "@/utils/useAppTheme"
import { Icon, Text } from "@/components"
import { TouchableOpacity, View, ViewStyle } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { spacing, ThemedStyle } from "@/theme"
import ProgressBar from "@/components/ProgressBar"
import { useRef } from "react"

export type OnboardingNavigatorParamList = {
  OnboardingRegisterMobile: undefined
  OnboardingVerifyOtp: undefined
  OnboardingCountry: undefined
  OnboardingNumber: undefined
  OnboardingValidate: undefined
  OnboardingCongratulations: undefined
  OnboardingAbout: undefined
  OnboardingAgent: undefined
  OnboardingSyncContacts: undefined
}

export type OnboardingStackScreenProps<T extends keyof OnboardingNavigatorParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<OnboardingNavigatorParamList, T>,
    AppStackScreenProps<keyof AppStackParamList>
  >

const Stack = createNativeStackNavigator<OnboardingNavigatorParamList>()

export const OnboardingNavigator = () => {
  const {
    theme: { colors },
    themed,
  } = useAppTheme()

  const onboardingNavRef = useRef<{
    route: RouteProp<OnboardingNavigatorParamList, keyof OnboardingNavigatorParamList>
    navigation: any
  }>()

  const handleBack = () => {
    if (
      onboardingNavRef &&
      onboardingNavRef.current &&
      onboardingNavRef.current &&
      (onboardingNavRef.current as any).navigation &&
      typeof (onboardingNavRef.current as any).navigation?.canGoBack === "function" &&
      typeof (onboardingNavRef.current as any).navigation?.goBack === "function"
    ) {
      if ((onboardingNavRef.current as any).navigation?.canGoBack()) {
        if (onboardingNavRef.current.route.name === "OnboardingRegisterMobile") return
        ;(onboardingNavRef.current as any).navigation?.goBack()
      }
    }
  }
  return (
    <SafeAreaView style={themed($contentContainer)}>
      <View style={themed($headerContainer)}>
        <TouchableOpacity style={themed($backBtnContainer)} onPress={handleBack}>
          <Icon icon="arrowLeftCircle" size={spacing.lg} />
        </TouchableOpacity>
        <ProgressBar />
      </View>
      <Stack.Navigator
        screenOptions={(props) => {
          onboardingNavRef.current = props
          return {
            headerShown: false,
            navigationBarColor: colors.background,
            contentStyle: {
              backgroundColor: colors.background,
            },
          }
        }}
        initialRouteName="OnboardingRegisterMobile"
      >
        <Stack.Screen name="OnboardingRegisterMobile" component={OnboardingRegisterMobileScreen} />
        <Stack.Screen name="OnboardingCountry" component={OnboardingCountryScreen} />
        <Stack.Screen name="OnboardingNumber" component={OnboardingNumberScreen} />
        <Stack.Screen name="OnboardingValidate" component={OnboardingValidateScreen} />
        <Stack.Screen
          name="OnboardingCongratulations"
          component={OnboardingCongratulationsScreen}
        />
        <Stack.Screen name="OnboardingSyncContacts" component={OnboardingSyncContactsScreen} />
        <Stack.Screen name="OnboardingAbout" component={OnboardingAboutScreen} />
        {/* <Stack.Screen name="OnboardingAgent" component={OnboardingAgentScreen} /> */}
        {/* <Stack.Screen name="OnboardingVerifyOtp" component={OnboardingVerifyOtpScreen} /> */}
      </Stack.Navigator>
    </SafeAreaView>
  )
}

const $contentContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flex: 1,
  backgroundColor: colors.background,
})

// const $logoContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
//   backgroundColor: colors.background,
//   paddingLeft: spacing.sm,
//   paddingTop: spacing.sm,
// })

const $headerContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.background,
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.md,
  flexDirection: "row",
  // justifyContent: "space-between",
  alignItems: "center",
  gap: spacing.lg,
})

const $backBtnContainer: ThemedStyle<ViewStyle> = () => ({})
