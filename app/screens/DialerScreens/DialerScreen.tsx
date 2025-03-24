import { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { DialingStackScreenProps } from "@/navigators"
import { Screen, Text } from "@/components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "@/models"
// import TwilioVoiceSdkModule from "modules/twilio-voice-sdk/src/TwilioVoiceSdkModule"

export const DialerScreen: FC<DialingStackScreenProps<"Dialer">> = observer(
  function DialerScreen() {
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()

    // Pull in navigation via hook
    // const navigation = useNavigation()
    return (
      <Screen style={$root} preset="scroll">
        <Text text="dialer" />
        {/* <Text>{TwilioVoiceSdkModule.hello()}</Text> */}
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}
