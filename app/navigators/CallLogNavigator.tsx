import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { CallListScreen, CallScreen } from "@/screens"
import { CompositeScreenProps } from "@react-navigation/native"
import { CoreTabNavigatorParamList, CoreTabScreenProps } from "."
import { useAppTheme } from "@/utils/useAppTheme"
import { translate } from "@/i18n"

export type CallLogNavigatorParamList = {
  CallList: undefined
  Call: undefined
}

/**
 * Helper for automatically generating navigation prop types for each route.
 *
 * More info: https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type CallLogStackScreenProps<T extends keyof CallLogNavigatorParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<CallLogNavigatorParamList, T>,
    CoreTabScreenProps<keyof CoreTabNavigatorParamList>
  >

const Stack = createNativeStackNavigator<CallLogNavigatorParamList>()
export const CallLogNavigator = () => {
  const {
    theme: { colors },
  } = useAppTheme()
  return (
    <Stack.Navigator
      screenOptions={(props) => ({
        headerShown: props.route.name === "CallList",
        title: translate("tabs:call_logs.call_list"),
        navigationBarColor: colors.background,
        contentStyle: {
          backgroundColor: colors.background,
        },
      })}
      initialRouteName="CallList"
    >
      <Stack.Screen name="CallList" component={CallListScreen} />
      <Stack.Screen name="Call" component={CallScreen} />
    </Stack.Navigator>
  )
}
