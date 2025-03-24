import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { AgentConfigScreen, OverviewScreen, ProfileScreen } from "@/screens"
import { CoreTabNavigatorParamList, CoreTabScreenProps } from "."
import { CompositeScreenProps } from "@react-navigation/native"
import { useAppTheme } from "@/utils/useAppTheme"
import { TouchableOpacity, ViewStyle } from "react-native"
import { Icon } from "@/components"
import { colors, ThemedStyle } from "@/theme"

export type SettingsNavigatorParamList = {
  Overview: undefined
  Profile: undefined
  AgentConfig: undefined
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
  const { themed } = useAppTheme()
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8}>
            <Icon icon="arrowLeftCircle" size={24} style={{ marginRight: 16 }} />
          </TouchableOpacity>
        ),
        navigationBarColor: colors.background,
        contentStyle: {
          backgroundColor: colors.background,
        },
        headerTitleStyle: { fontWeight: "bold"}
      })}
      initialRouteName="Overview"
    >
      <Stack.Screen name="Overview" component={OverviewScreen} options={{
        title: "Settings",
        headerLeft: () => null,
      }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{
        title: "Profile",
      }} />
      <Stack.Screen name="AgentConfig" component={AgentConfigScreen} options={{
        title: "ORiN agent config",
      }} />
    </Stack.Navigator>
  )
}
