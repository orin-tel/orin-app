/* eslint-disable import/first */
/**
 * Welcome to the main entry point of the app. In this file, we'll
 * be kicking off our app.
 *
 * Most of this file is boilerplate and you shouldn't need to modify
 * it very often. But take some time to look through and understand
 * what is going on here.
 *
 * The app navigation resides in ./app/navigators, so head over there
 * if you're interested in adding screens and navigators.
 */
if (__DEV__) {
  // Load Reactotron in development only.
  // Note that you must be using metro's `inlineRequires` for this to work.
  // If you turn it off in metro.config.js, you'll have to manually import it.
  require("./devtools/ReactotronConfig.ts")
}
import "./utils/gestureHandler"
import { initI18n } from "./i18n"
import "./utils/ignoreWarnings"
import { useFonts } from "expo-font"
import { useEffect, useState } from "react"
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context"
import * as Linking from "expo-linking"
import * as SplashScreen from "expo-splash-screen"
import { useInitialRootStore } from "./models"
import { AppNavigator, useNavigationPersistence } from "./navigators"
import { ErrorBoundary } from "./screens/ErrorScreen/ErrorBoundary"
import * as storage from "./utils/storage"
import { customFontsToLoad } from "./theme"
import Config from "./config"
import { KeyboardProvider } from "react-native-keyboard-controller"
import { loadDateFnsLocale } from "./utils/formatDate"
import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-expo"
import { tokenCache } from "@/cache"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { ProgressProvider } from "./context/ProgressProvider"
import { AppServices } from "./app-services"
import "react-native-keyboard-controller"

export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE"
const CLERK_PUBLISHABLE_KEY = Config.CLERK_PUBLISHABLE_KEY

// Web linking configuration
const prefix = Linking.createURL("/")
const config = {
  screens: {
    Signup: "signup",
    AuthReconcile: "auth-reconcile",
    ActiveCall: "active-call",
    Onboarding: {
      path: "onboarding",
      screens: {
        OnboardingRegisterMobileScreen: "register-mobile",
        OnboardingVerifyOtpScreen: "onboarding-verify-otp",
        OnboardingCountryScreen: "country",
        OnboardingNumberScreen: "number",
      },
    },
    Welcome: "welcome",
    Core: {
      path: "core",
      screens: {
        CallLogs: {
          path: "call-logs",
          screens: {
            CallList: "list",
            Call: "detail",
          },
        },
        Dialer: {
          path: "dialer",
          screens: {
            Dialer: "",
          },
        },
        Contacts: {
          path: "contacts",
          screens: {
            ContactList: "list",
            Contact: "detail",
          },
        },
        Settings: {
          path: "settings",
          screens: {
            Settings: "",
          },
        },
      },
    },
    Demo: {
      screens: {
        DemoShowroom: {
          path: "showroom/:queryIndex?/:itemIndex?",
        },
        DemoDebug: "debug",
        DemoPodcastList: "podcast",
        DemoCommunity: "community",
      },
    },
  },
}

/**
 * This is the root component of our app.
 * @param {AppProps} props - The props for the `App` component.
 * @returns {JSX.Element} The rendered `App` component.
 */
export function App() {
  const {
    initialNavigationState,
    onNavigationStateChange,
    isRestored: isNavigationStateRestored,
  } = useNavigationPersistence(storage, NAVIGATION_PERSISTENCE_KEY)

  const [areFontsLoaded, fontLoadError] = useFonts(customFontsToLoad)
  const [isI18nInitialized, setIsI18nInitialized] = useState(false)

  useEffect(() => {
    initI18n()
      .then(() => setIsI18nInitialized(true))
      .then(() => loadDateFnsLocale())
  }, [])

  const { rehydrated } = useInitialRootStore(() => {
    // This runs after the root store has been initialized and rehydrated.

    // If your initialization scripts run very fast, it's good to show the splash screen for just a bit longer to prevent flicker.
    // Slightly delaying splash screen hiding for better UX; can be customized or removed as needed,
    setTimeout(SplashScreen.hideAsync, 500)
  })

  // Before we show the app, we have to wait for our state to be ready.
  // In the meantime, don't render anything. This will be the background
  // color set in native by rootView's background color.
  // In iOS: application:didFinishLaunchingWithOptions:
  // In Android: https://stackoverflow.com/a/45838109/204044
  // You can replace with your own loading component if you wish.
  if (
    !rehydrated ||
    !isNavigationStateRestored ||
    !isI18nInitialized ||
    (!areFontsLoaded && !fontLoadError)
  ) {
    return null
  }

  const linking = {
    prefixes: [prefix],
    config,
  }
  if (!CLERK_PUBLISHABLE_KEY) {
    throw new Error("Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file")
  }

  // otherwise, we're ready to render the app
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <ErrorBoundary catchErrors={Config.catchErrors}>
        <ClerkProvider tokenCache={tokenCache} publishableKey={CLERK_PUBLISHABLE_KEY}>
          <ClerkLoaded>
            <AppServices>
              <GestureHandlerRootView>
                <ProgressProvider>
                  <BottomSheetModalProvider>
                    <KeyboardProvider>
                      <AppNavigator
                        linking={linking}
                        initialState={initialNavigationState}
                        onStateChange={onNavigationStateChange}
                      />
                    </KeyboardProvider>
                  </BottomSheetModalProvider>
                </ProgressProvider>
              </GestureHandlerRootView>
            </AppServices>
          </ClerkLoaded>
        </ClerkProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  )
}
