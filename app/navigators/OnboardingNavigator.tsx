import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { OnboardingCountryScreen } from "@/screens"
import { colors } from "@/theme"
import { AppStackParamList, AppStackScreenProps } from "."
import { CompositeScreenProps } from "@react-navigation/native"

console.log(OnboardingCountryScreen)
export type OnboardingNavigatorParamList = {
  OnboardingCountry: undefined
}

export type OnboardingStackScreenProps<T extends keyof OnboardingNavigatorParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<OnboardingNavigatorParamList, T>,
    AppStackScreenProps<keyof AppStackParamList>
  >

const Stack = createNativeStackNavigator<OnboardingNavigatorParamList>()

export const OnboardingNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        navigationBarColor: colors.background,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
      initialRouteName="OnboardingCountry"
    >
      <Stack.Screen name="OnboardingCountry" component={OnboardingCountryScreen} />
    </Stack.Navigator>
  )
}
