/**
 * The app navigator is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "core" flow which the user will use once logged in.
 */
import {
  createNavigationContainerRef,
  NavigationContainer,
  NavigatorScreenParams,
} from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import * as Screens from "@/screens"
import Config from "@/config"
import { DemoNavigator, DemoTabParamList } from "./DemoNavigator"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import { useAppTheme, useThemeProvider } from "@/utils/useAppTheme"
import { ComponentProps, useEffect } from "react"
import { useAuth } from "@clerk/clerk-expo"
import { OnboardingNavigator, OnboardingNavigatorParamList } from "./OnboardingNavigator"
import { useStores } from "@/models"
import { CoreNavigator, CoreTabNavigatorParamList } from "./CoreNavigator"
import { AppServices } from "@/app-services"
import { CallInvite } from "@twilio/voice-react-native-sdk"

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */

export type AppStackParamList = {
  Welcome: undefined
  SignUp: undefined
  Demo: NavigatorScreenParams<DemoTabParamList>
  // 🔥 Your screens go here
  SignIn: undefined
  Onboarding: NavigatorScreenParams<OnboardingNavigatorParamList>
  Core: NavigatorScreenParams<CoreTabNavigatorParamList>
  OnboardingValidate: undefined
  OnboardingCongratulations: undefined
  OnboardingAbout: undefined
  OnboardingAgent: undefined
  AuthReconcile: undefined
  ActiveCall: {
    telephonyCallId: string
  }
  // IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST
}
/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStack = observer(function AppStack() {
  const { isSignedIn: isAuthenticated } = useAuth()

  const {
    theme: { colors },
  } = useAppTheme()

  const {
    locationStore: { fetchLocation },
    userStore,
  } = useStores()

  useEffect(() => {
    fetchLocation()
  }, [fetchLocation])

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        navigationBarColor: colors.background,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
      // initialRouteName={"Core"}
      initialRouteName={isAuthenticated ? "AuthReconcile" : "SignUp"}
      // initialRouteName={"Demo"}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="AuthReconcile" component={Screens.AuthReconcileScreen} />
          <Stack.Screen name="Core" component={CoreNavigator} />
          <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
          {/* <Stack.Screen name="Demo" component={DemoNavigator} /> */}
          {/* <Stack.Screen name="Welcome" component={Screens.WelcomeScreen} /> */}
        </>
      ) : (
        <>
          <Stack.Screen name="SignUp" component={Screens.SignUpScreen} />
          <Stack.Screen name="SignIn" component={Screens.SignInScreen} />
        </>
      )}
      {/** 🔥 Your screens go here */}
      <Stack.Screen name="ActiveCall" component={Screens.ActiveCallScreen} />
      {/* IGNITE_GENERATOR_ANCHOR_APP_STACK_SCREENS */}
    </Stack.Navigator>
  )
})

export interface NavigationProps extends Partial<ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = observer(function AppNavigator(props: NavigationProps) {
  const { themeScheme, navigationTheme, setThemeContextOverride, ThemeProvider } =
    useThemeProvider()

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <ThemeProvider value={{ themeScheme, setThemeContextOverride }}>
      <NavigationContainer ref={navigationRef} theme={navigationTheme} {...props}>
        <AppStack />
      </NavigationContainer>
    </ThemeProvider>
  )
})
