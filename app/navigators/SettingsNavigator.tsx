import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { OverviewScreen } from "@/screens"
import { CoreTabNavigatorParamList, CoreTabScreenProps } from "."
import { CompositeScreenProps } from "@react-navigation/native"
import { useAppTheme } from "@/utils/useAppTheme"

export type SettingsNavigatorParamList = {
  Overview: undefined
}

/**
 * Helper for automatically generating navigation prop types for each route.
 *
 * More info: https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type SettingStackScreenProps<T extends keyof SettingsNavigatorParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<SettingsNavigatorParamList, T>,
    CoreTabScreenProps<keyof CoreTabNavigatorParamList>
  >

const Stack = createNativeStackNavigator<SettingsNavigatorParamList>()
export const SettingsNavigator = () => {
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
      initialRouteName="Overview"
    >
      <Stack.Screen name="Overview" component={OverviewScreen} />
    </Stack.Navigator>
  )
}
