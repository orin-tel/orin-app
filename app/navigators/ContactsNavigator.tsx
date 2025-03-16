import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { ContactListScreen, ContactScreen } from "@/screens"
import { CompositeScreenProps } from "@react-navigation/native"
import { CoreTabNavigatorParamList, CoreTabScreenProps } from "."
import { useAppTheme } from "@/utils/useAppTheme"

export type ContactsNavigatorParamList = {
  ContactList: undefined
  Contact: undefined
}

/**
 * Helper for automatically generating navigation prop types for each route.
 *
 * More info: https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type ContactStackScreenProps<T extends keyof ContactsNavigatorParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<ContactsNavigatorParamList, T>,
    CoreTabScreenProps<keyof CoreTabNavigatorParamList>
  >

const Stack = createNativeStackNavigator<ContactsNavigatorParamList>()
export const ContactsNavigator = () => {
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
      initialRouteName="ContactList"
    >
      <Stack.Screen name="ContactList" component={ContactListScreen} />
      <Stack.Screen name="Contact" component={ContactScreen} />
    </Stack.Navigator>
  )
}
