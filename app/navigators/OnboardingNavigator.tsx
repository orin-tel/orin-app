import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import {
  OnboardingCountryScreen,
  OnboardingNumberScreen,
  OnboardingRegisterMobileScreen,
  OnboardingVerifyOtpScreen,
  OnboardingValidateScreen,
  OnboardingCongratulationsScreen,
} from "@/screens"
import { AppStackParamList, AppStackScreenProps } from "."
import { CompositeScreenProps } from "@react-navigation/native"
import { useAppTheme } from "@/utils/useAppTheme"
import { Text } from "@/components"
import { View, ViewStyle } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { ThemedStyle } from "@/theme"

export type OnboardingNavigatorParamList = {
  OnboardingRegisterMobile: undefined
  OnboardingCountry: undefined
  OnboardingNumber: undefined
  OnboardingValidate: undefined
  OnboardingCongratulations: undefined
  OnboardingVerifyOtp: undefined
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
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        header: () => (
          <SafeAreaView style={themed($contentContainer)}>
            <View>
              <Text preset="heading" weight="medium" text="ORiN" />
            </View>
          </SafeAreaView>
        ),
        navigationBarColor: colors.background,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
      // initialRouteName="OnboardingRegisterMobile"
      // initialRouteName="OnboardingValidate"
      // initialRouteName="OnboardingCongratulations"
    initialRouteName="OnboardingNumber"
    >
      {/* <Stack.Screen name="OnboardingRegisterMobile" component={OnboardingRegisterMobileScreen} /> */}
      {/* <Stack.Screen name="OnboardingCountry" component={OnboardingCountryScreen} /> */}
      <Stack.Screen name="OnboardingNumber" component={OnboardingNumberScreen} />
      {/* <Stack.Screen name="OnboardingValidate" component={OnboardingValidateScreen} /> */}
      {/* <Stack.Screen name="OnboardingCongratulations" component={OnboardingCongratulationsScreen} /> */}
      {/* <Stack.Screen name="OnboardingVerifyOtp" component={OnboardingVerifyOtpScreen} /> */}
    </Stack.Navigator>
  )
}

const $contentContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.background,
  padding: spacing.sm,
})
