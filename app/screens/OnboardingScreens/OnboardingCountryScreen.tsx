import { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
// import { AppStackScreenProps } from "@/navigators"
import { Screen, Text } from "@/components"
import { OnboardingStackScreenProps } from "@/navigators"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "@/models"

export const OnboardingCountryScreen: FC<OnboardingStackScreenProps<"OnboardingCountry">> =
  observer(function OnboardingCountryScreen() {
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()

    // Pull in navigation via hook
    // const navigation = useNavigation()
    return (
      <Screen style={$root} preset="scroll">
        <Text text="This is the Onboarding Country screen" />
      </Screen>
    )
  })

const $root: ViewStyle = {
  flex: 1,
}
