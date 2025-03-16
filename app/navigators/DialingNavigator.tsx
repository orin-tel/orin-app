import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { DialerScreen } from "@/screens"
import { CompositeScreenProps } from "@react-navigation/native"
import { CoreTabNavigatorParamList, CoreTabScreenProps } from "."
import { useAppTheme } from "@/utils/useAppTheme"

export type DialingNavigatorParamList = {
  Dialer: undefined
}

/**
 * Helper for automatically generating navigation prop types for each route.
 *
 * More info: https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type DialingStackScreenProps<T extends keyof DialingNavigatorParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<DialingNavigatorParamList, T>,
    CoreTabScreenProps<keyof CoreTabNavigatorParamList>
  >

const Stack = createNativeStackNavigator<DialingNavigatorParamList>()
export const DialingNavigator = () => {
  const {
    theme: { colors },
  } = useAppTheme()
  return (
    <Stack.Navigator
      screenOptions={{
        navigationBarColor: colors.background,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
      initialRouteName="Dialer"
    >
      <Stack.Screen name="Dialer" component={DialerScreen} />
    </Stack.Navigator>
  )
}
