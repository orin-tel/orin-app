import { FC, useCallback, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { ActivityIndicator, ViewStyle } from "react-native"
import { AppStackScreenProps } from "@/navigators"
import { Screen, Text } from "@/components"
import { useStores } from "@/models"
import { useFocusEffect, useTheme } from "@react-navigation/native"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "@/models"

export const AuthReconcileScreen: FC<AppStackScreenProps<"AuthReconcile">> = observer(
  function AuthReconcileScreen(_props) {
    // Pull in one of our MST stores
    const { userStore } = useStores()

    const { colors } = useTheme()
    useFocusEffect(
      useCallback(() => {
        const signIn = async () => {
          const result = await userStore.signInUser()
          if (result) {
            _props.navigation.navigate("Core", {
              screen: "CallLogs",
              params: {
                screen: "CallList",
              },
            })
          } else {
            _props.navigation.navigate("Onboarding", {
              screen: "OnboardingRegisterMobile",
            })
          }
        }

        signIn()
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [_props.navigation, userStore]),
    )

    return <Screen style={$root} contentContainerStyle={$contentContainer} preset="scroll"></Screen>
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
