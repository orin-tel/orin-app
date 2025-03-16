import { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native"
import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { SettingsNavigator, SettingsNavigatorParamList } from "./SettingsNavigator"
import type { AppStackParamList, AppStackScreenProps } from "./AppNavigator"
import { CallLogNavigator, CallLogNavigatorParamList } from "./CallLogNavigator"
import { ContactsNavigator, ContactsNavigatorParamList } from "./ContactsNavigator"
import { DialingNavigator, DialingNavigatorParamList } from "./DialingNavigator"
import { ThemedStyle } from "@/theme"
import { TextStyle, View, ViewStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useAppTheme } from "@/utils/useAppTheme"
import { translate, TxKeyPath } from "@/i18n"
import { Icon, IconTypes } from "@/components"

export type CoreTabNavigatorParamList = {
  CallLogs: NavigatorScreenParams<CallLogNavigatorParamList>
  Dialing: NavigatorScreenParams<DialingNavigatorParamList>
  Contacts: NavigatorScreenParams<ContactsNavigatorParamList>
  Settings: NavigatorScreenParams<SettingsNavigatorParamList>
}

type CoreTabNavigatorTab = {
  name: keyof CoreTabNavigatorParamList
  component: () => JSX.Element
  label: TxKeyPath
  icon: IconTypes
}

const AVAILABLE_TABS: CoreTabNavigatorTab[] = [
  {
    name: "CallLogs",
    component: CallLogNavigator,
    label: "tabs:call_logs",
    icon: "call",
  },
  {
    name: "Dialing",
    component: DialingNavigator,
    label: "tabs:dialer",
    icon: "dialer",
  },
  {
    name: "Contacts",
    component: ContactsNavigator,
    label: "tabs:contacts",
    icon: "contacts",
  },
  {
    name: "Settings",
    component: SettingsNavigator,
    label: "tabs:settings",
    icon: "settings",
  },
]

/**
 * Helper for automatically generating navigation prop types for each route.
 *
 * More info: https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type CoreTabScreenProps<T extends keyof CoreTabNavigatorParamList> = CompositeScreenProps<
  BottomTabScreenProps<CoreTabNavigatorParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

const Tab = createBottomTabNavigator<CoreTabNavigatorParamList>()

export const CoreNavigator = () => {
  const { bottom } = useSafeAreaInsets()
  const {
    themed,
    theme: { colors },
  } = useAppTheme()
  console.log("CallLogNavigator", CallLogNavigator)
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: themed([$tabBar, { height: bottom + 60 }]),
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.text,
        tabBarLabelStyle: themed($tabBarLabel),
        tabBarItemStyle: themed($tabBarItem),
      }}
    >
      {AVAILABLE_TABS.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{
            // tabBarLabel: translate(tab.label),
            tabBarAccessibilityLabel: translate(tab.label),
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => (
              <View style={themed($activeViewStyle)}>
                <Icon
                  icon={tab.icon}
                  color={focused ? colors.tint : colors.tintInactive}
                  size={30}
                />
                {focused && <View style={themed($activeIconStyle)} />}
              </View>
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  )
}

const $activeViewStyle: ThemedStyle<ViewStyle> = () => ({
  alignItems: "center",
})

const $activeIconStyle: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  width: spacing.xxs,
  height: spacing.xxs,
  borderRadius: spacing.xxs,
  backgroundColor: colors.tint,
  marginTop: spacing.xs,
  marginLeft: spacing.xxxs * 0.85,
})

const $tabBar: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.background,
  borderTopColor: colors.transparent,
  shadowOffset: { width: 2, height: -5 },
  shadowColor: colors.shadowPrimary,
  shadowOpacity: 1,
  shadowRadius: 10,
  elevation: 10, // For Android shadow
  paddingBottom: spacing.md,
})

const $tabBarItem: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingTop: spacing.md,
})

const $tabBarLabel: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontSize: 12,
  fontFamily: typography.primary.medium,
  lineHeight: 16,
  color: colors.text,
})
