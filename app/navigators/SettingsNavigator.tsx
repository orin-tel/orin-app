import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import {
  AgentConfigScreen,
  ConnectCallsScreen,
  ExpectedCallsScreen,
  OverviewScreen,
  ProfileScreen,
  WhitelistBlacklistScreen,
  WhitelistScreen,
} from "@/screens"
import { CoreTabNavigatorParamList, CoreTabScreenProps } from "."
import { CompositeScreenProps } from "@react-navigation/native"
import { useAppTheme } from "@/utils/useAppTheme"
import { TouchableOpacity } from "react-native"
import { Icon } from "@/components"

export type SettingsNavigatorParamList = {
  Overview: undefined
  Profile: undefined
  AgentConfig: undefined
  ConnectCalls: undefined
  WhitelistBlacklist: undefined
  Whitelist: undefined
  ExpectedCalls: undefined
}

export type SettingStackScreenProps<T extends keyof SettingsNavigatorParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<SettingsNavigatorParamList, T>,
    CoreTabScreenProps<keyof CoreTabNavigatorParamList>
  >

const Stack = createNativeStackNavigator<SettingsNavigatorParamList>()
export const SettingsNavigator = () => {
  const {
    themed,
    theme: { colors },
  } = useAppTheme()
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
        headerTitleStyle: { fontWeight: "bold" },
      })}
      initialRouteName="Overview"
    >
      <Stack.Screen
        name="Overview"
        component={OverviewScreen}
        options={{
          title: "Settings",
          headerLeft: () => null,
        }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
        }}
      />
      <Stack.Screen
        name="AgentConfig"
        component={AgentConfigScreen}
        options={{
          title: "ORiN agent config",
        }}
      />
      <Stack.Screen
        name="ConnectCalls"
        component={ConnectCallsScreen}
        options={{
          title: "Connect calls",
        }}
      />
      <Stack.Screen
        name="ExpectedCalls"
        component={ExpectedCallsScreen}
        options={{
          title: "Expected calls",
        }}
      />
      <Stack.Screen
        name="WhitelistBlacklist"
        component={WhitelistBlacklistScreen}
        options={{
          title: "Whitelist / Blacklist numbers",
        }}
      />
      <Stack.Screen
        name="Whitelist"
        component={WhitelistScreen}
        options={{
          title: "Whitelist numbers",
        }}
      />
    </Stack.Navigator>
  )
}
