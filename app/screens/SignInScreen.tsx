import { Screen } from "@/components"
import { useSignIn } from "@clerk/clerk-expo"
import { Link, useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { Text, TextInput, Button, View } from "react-native"
import { $styles } from "@/theme"

export const SignInScreen = () => {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useNavigation()

  const [emailAddress, setEmailAddress] = useState("")
  const [password, setPassword] = useState("")
  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return
    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId })
        router.reset({
          index: 0,
          routes: [],
        })
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$styles.flex1}>
      <View>
        <TextInput
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        />
        <TextInput
          value={password}
          placeholder="Enter password"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
        <Button title="Sign in" onPress={onSignInPress} />
        <View>
          <Text>Don&apos;t have an account?</Text>
          <Link to="/sign-up">
            <Text>Sign up</Text>
          </Link>
        </View>
      </View>
    </Screen>
  )
}
