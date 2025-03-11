import { FC } from "react"
import { observer } from "mobx-react-lite" 
import { ViewStyle } from "react-native"
// import { AppStackScreenProps } from "@/navigators"
import { Screen, Text } from "@/components"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { OnboardingNavigatorParamList } from "@/navigators"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "@/models" 

interface OnboardingCountryScreenProps extends NativeStackScreenProps<OnboardingNavigatorParamList, "OnboardingCountryScreen"> {}


export const OnboardingCountryScreen: FC<OnboardingCountryScreenProps> = function OnboardingCountryScreen() {
  
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={$root} preset="scroll">
      <Text text="This is the Onboarding Country screen" />
    </Screen>
  )

}

const $root: ViewStyle = {
  flex: 1,
}
