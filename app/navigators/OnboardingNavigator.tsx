import { createNativeStackNavigator } from "@react-navigation/native-stack"
import {
  OnboardingCountryScreen,
} from "@/screens"
import { colors } from "@/theme";

console.log(OnboardingCountryScreen);
export type OnboardingNavigatorParamList = {
  OnboardingCountryScreen: {};
}

const Stack = createNativeStackNavigator<OnboardingNavigatorParamList>();

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
    initialRouteName="OnboardingCountryScreen">
      <Stack.Screen name="OnboardingCountryScreen" component={OnboardingCountryScreen} />
    </Stack.Navigator>
  )
}
