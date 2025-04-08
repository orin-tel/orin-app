import { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { ActivityIndicator, ViewStyle } from "react-native"
import { AppStackScreenProps } from "@/navigators"
import { Screen } from "@/components"
import { useStores } from "@/models"
import { useTheme } from "@react-navigation/native"
import { CallInvite } from "@twilio/voice-react-native-sdk"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "@/models"

export const AuthReconcileScreen: FC<AppStackScreenProps<"AuthReconcile">> = observer(
  function AuthReconcileScreen(_props) {
    // Pull in one of our MST stores
    const {
      userStore: { signInUser },
    } = useStores()

    const { colors } = useTheme()

    useEffect(() => {
      ;(async () => {
        const result = await signInUser()
        if (result)
          _props.navigation.navigate("Core", {
            screen: "CallLogs",
            params: {
              screen: "CallList",
            },
          })
        else
          _props.navigation.navigate("Onboarding", {
            screen: "OnboardingRegisterMobile",
          })
      })()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {}, [])
    return (
      <Screen style={$root} contentContainerStyle={$contentContainer} preset="scroll">
        <ActivityIndicator color={colors.primary} />
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}

const $contentContainer: ViewStyle = {
  width: "100%",
  height: "100%",
  alignItems: "center",
  justifyContent: "center",
}
