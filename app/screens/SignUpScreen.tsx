import { FC, useCallback } from "react"
import { TextStyle, ViewStyle } from "react-native"
import { Text, Button, Icon } from "../components"
import { $styles, ThemedStyle } from "@/theme"
import { Screen } from "@/components"
import { AppStackScreenProps } from "@/navigators"
import { useAppTheme } from "@/utils/useAppTheme"
import * as WebBrowser from "expo-web-browser"
import * as AuthSession from "expo-auth-session"
import { useSSO } from "@clerk/clerk-expo"
import { useWarmUpBrowser } from "@/utils/useWarmupBrowser"

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession()

export const SignUpScreen: FC<AppStackScreenProps<"SignUp">> = function SignUpScreen(_props) {
  useWarmUpBrowser()
  // Use the `useSSO()` hook to access the `startSSOFlow()` method
  const { startSSOFlow } = useSSO()
  const { themed } = useAppTheme()

  const onPress = useCallback(async () => {
    try {
      // Start the authentication process by calling `startSSOFlow()`
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
        strategy: "oauth_google",
        // Defaults to current path
        redirectUrl: AuthSession.makeRedirectUri({
          native: "orinapp://onboarding/country",
        }),
      })

      // If sign in was successful, set the active session
      if (createdSessionId) {
        console.log("CREATE SESSION ID", createdSessionId)
        setActive!({ session: createdSessionId })
      } else {
        console.log("NO CREATE SESSION ID")
        // If there is no `createdSessionId`,
        // there are missing requirements, such as MFA
        // Use the `signIn` or `signUp` returned from `startSSOFlow`
        // to handle next steps
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Screen
      preset="fixed"
      contentContainerStyle={[$styles.container, themed($container)]}
      safeAreaEdges={["top"]}
    >
      <Text preset="subheading" tx="signUpScreen:welcome" style={themed($welcome)} />
      <Text preset="heading" tx="signUpScreen:title" style={themed($title)} />
      <Text preset="default" tx="signUpScreen:intro_one" style={themed($intro)} />
      <Text preset="default" tx="signUpScreen:intro_two" style={themed($intro)} />
      <Button
        preset="filled"
        tx="signUpScreen:google_oauth"
        style={themed($emailBtn)}
        onPress={onPress}
        LeftAccessory={(props) => <Icon style={props.style} icon="github" />}
      />
    </Screen>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  justifyContent: "center",
  display: "flex",
  height: "100%",
  gap: spacing.sm,
})

const $welcome: ThemedStyle<TextStyle> = ({ spacing, typography, colors }) => ({
  // marginBottom: spacing.sm,
  fontSize: spacing.xl,
  lineHeight: spacing.xl,
  fontFamily: typography.fonts.spaceGrotesk.medium,
  color: colors.textDim,
})

const $title: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.xxl,
  fontSize: spacing.xxxl,
  lineHeight: spacing.xxxl,
})

const $intro: ThemedStyle<TextStyle> = ({ spacing, typography, colors }) => ({
  // marginBottom: spacing.xxl,
  fontSize: spacing.lg,
  lineHeight: spacing.lg,
  fontFamily: typography.fonts.spaceGrotesk.light,
  color: colors.textDim,
  textAlign: "center",
})

const $emailBtn: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginTop: spacing.xxxl * 2,
  gap: spacing.sm,
  width: "90%",
  borderRadius: 100,
})

// export function SignUpScreen() {
//   const { isLoaded, signUp, setActive } = useSignUp()
//   const router = useNavigation()

//   const [emailAddress, setEmailAddress] = useState("")
//   const [password, setPassword] = useState("")
//   const [pendingVerification, setPendingVerification] = useState(false)
//   const [code, setCode] = useState("")

//   // Handle submission of sign-up form
//   const onSignUpPress = async () => {
//     if (!isLoaded) return

//     // Start sign-up process using email and password provided
//     try {
//       await signUp.create({
//         emailAddress,
//         password,
//       })

//       // Send user an email with verification code
//       await signUp.prepareEmailAddressVerification({ strategy: "email_code" })

//       // Set 'pendingVerification' to true to display second form
//       // and capture OTP code
//       setPendingVerification(true)
//     } catch (err) {
//       // See https://clerk.com/docs/custom-flows/error-handling
//       // for more info on error handling
//       console.error(JSON.stringify(err, null, 2))
//     }
//   }

//   // Handle submission of verification form
//   const onVerifyPress = async () => {
//     if (!isLoaded) return

//     try {
//       // Use the code the user provided to attempt verification
//       const signUpAttempt = await signUp.attemptEmailAddressVerification({
//         code,
//       })

//       // If verification was completed, set the session to active
//       // and redirect the user
//       if (signUpAttempt.status === "complete") {
//         await setActive({ session: signUpAttempt.createdSessionId })
//         router.reset({
//           index: 0,
//           routes: [],
//         })
//       } else {
//         // If the status is not complete, check why. User may need to
//         // complete further steps.
//         console.error(JSON.stringify(signUpAttempt, null, 2))
//       }
//     } catch (err) {
//       // See https://clerk.com/docs/custom-flows/error-handling
//       // for more info on error handling
//       console.error(JSON.stringify(err, null, 2))
//     }
//   }

//   if (pendingVerification) {
//     return (
//       <>
//         <Text>Verify your email</Text>
//         <TextInput
//           value={code}
//           placeholder="Enter your verification code"
//           onChangeText={(code) => setCode(code)}
//         />
//         <Button title="Verify" onPress={onVerifyPress} />
//       </>
//     )
//   }

//   return (
//     <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$styles.flex1}>
//       <View>
//         <>
//           <Text>Sign up</Text>
//           <TextInput
//             autoCapitalize="none"
//             value={emailAddress}
//             placeholder="Enter email"
//             onChangeText={(email) => setEmailAddress(email)}
//           />
//           <TextInput
//             value={password}
//             placeholder="Enter password"
//             secureTextEntry={true}
//             onChangeText={(password) => setPassword(password)}
//           />
//           <Button title="Continue" onPress={onSignUpPress} />
//         </>
//       </View>
//     </Screen>
//   )
// }
