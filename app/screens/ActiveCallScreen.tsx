import { FC, useEffect, useMemo, useState } from "react"
import { observer } from "mobx-react-lite"
import { Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "@/navigators"
import { Button, Icon, Screen, Text } from "@/components"
import { $styles, ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import { activeCallCustomParamsFixture } from "@/fixtures/active-call.fixtures"
import { Call, CallInvite } from "@twilio/voice-react-native-sdk"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "@/models"
const avatar = require("../../assets/images/avatar.png")

export interface IActiveCallCustomParams {
  first_name: string
  from_phone_number: string
  last_name: string
  organization: string
  telephony_call_id: string
  to_phone_number: string | undefined
  user_first_name: string
  user_last_name: string
  user_primary_email: string
  voice_provider_call_id: string
}

export interface IActionItems {
  callState: CallInvite.State
  handleCallAccept: () => void
  handleCallReject: () => void
  handleHangUp: () => void
}

export const ActiveCallScreen: FC<AppStackScreenProps<"ActiveCall">> = observer(
  function ActiveCallScreen(_props) {
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()

    // Pull in navigation via hook
    // const navigation = useNavigation()
    const { themed } = useAppTheme()
    const activeCallInvite = _props.route.params
    const [activeCallInviteState, setActiveCallInviteState] = useState<CallInvite.State>(
      CallInvite.State.Pending,
    )
    const [activeCall, setActiveCall] = useState<Call>()

    // let activeCallParams: IActiveCallCustomParams =
    //   activeCall.getCustomParameters() as unknown as IActiveCallCustomParams
    const activeCallParams = useMemo(() => {
      if (typeof activeCallInvite.getCustomParameters === "function")
        return activeCallInvite.getCustomParameters()
      return activeCallCustomParamsFixture
    }, [activeCallInvite])

    const handleCallAccept = () => {
      if (typeof activeCallInvite.accept === "function") activeCallInvite.accept()
    }

    const handleCallReject = () => {
      if (typeof activeCallInvite.reject === "function") activeCallInvite.reject()
      setTimeout(() => {
        if (_props.navigation.canGoBack()) _props.navigation.goBack()
        else {
          _props.navigation.navigate("AuthReconcile")
        }
      }, 1000)
    }

    const handleHangUp = () => {
      if (activeCall && typeof activeCall.disconnect === "function") {
        activeCall.disconnect()
        setTimeout(() => {
          if (_props.navigation.canGoBack()) _props.navigation.goBack()
          else {
            _props.navigation.navigate("AuthReconcile")
          }
        }, 1000)
      }
    }

    useEffect(() => {
      activeCallInvite.on(CallInvite.Event.Accepted, (call: Call) => {
        setActiveCall(call)
        setActiveCallInviteState(CallInvite.State.Accepted)
      })

      activeCallInvite.on(CallInvite.Event.Rejected, () => {
        setActiveCall(undefined)
        setActiveCallInviteState(CallInvite.State.Rejected)
      })

      activeCallInvite.on(CallInvite.Event.Cancelled, () => {
        setActiveCall(undefined)
        setActiveCallInviteState(CallInvite.State.Cancelled)
      })

      return () => {
        activeCallInvite.off(CallInvite.Event.Accepted)
        activeCallInvite.off(CallInvite.Event.Rejected)
        activeCallInvite.off(CallInvite.Event.Cancelled)
      }
    }, [activeCallInvite])

    useEffect(() => {
      if (!activeCall) return
      activeCall.on(Call.Event.Connected, (call: Call) => {
        console.log("call connected successfully")
      })

      activeCall.on(Call.Event.Disconnected, (call: Call) => {
        setActiveCall(undefined)
        setActiveCallInviteState(CallInvite.State.Rejected)
      })

      activeCall.on(Call.Event.ConnectFailure, (call: Call, error: Error) => {
        console.error("Call connection failed:", error)
        setActiveCall(undefined)
        setActiveCallInviteState(CallInvite.State.Rejected)
      })

      activeCall.on(Call.Event.Reconnecting, (call: Call, error: Error) => {
        console.warn("Call reconnecting due to error:", error)
      })

      activeCall.on(Call.Event.Reconnected, (call: Call) => {
        console.log("Call reconnected successfully")
      })

      return () => {
        activeCall.off(Call.Event.Connected)
        activeCall.off(Call.Event.Disconnected)
        activeCall.off(Call.Event.ConnectFailure)
        activeCall.off(Call.Event.Reconnecting)
        activeCall.off(Call.Event.Reconnected)
      }
    }, [activeCall])

    return (
      <Screen
        style={themed($root)}
        contentContainerStyle={themed($container)}
        preset="scroll"
        safeAreaEdges={["top"]}
      >
        <View style={[$styles.row, themed($notificationHeader)]}>
          <Icon icon="incoming_call" />
          <Text tx={"activeCall:incoming_call"} />
        </View>
        <View>
          <Image source={avatar} style={themed($imageStyle)} />
        </View>
        <View style={themed($infoContainer)}>
          {activeCallParams && activeCallParams.first_name && (
            <Text preset="bold" size="xl">
              {activeCallParams.first_name + " " + (activeCallParams?.last_name ?? "")}
            </Text>
          )}
          {activeCallParams && activeCallParams.organization && (
            <Text preset="default" size="lg">
              {activeCallParams.organization}
            </Text>
          )}
          {activeCallParams && activeCallParams.from_phone_number && (
            <Text preset="default" size="xl" style={themed($fromPhoneNumber)}>
              {activeCallParams.from_phone_number}
            </Text>
          )}
        </View>
        <ActionItems
          callState={activeCallInviteState}
          handleCallAccept={handleCallAccept}
          handleCallReject={handleCallReject}
          handleHangUp={handleHangUp}
        />
      </Screen>
    )
  },
)

const ActionItems = (props: IActionItems) => {
  const { themed } = useAppTheme()
  const { callState, handleCallAccept, handleCallReject, handleHangUp } = props
  switch (callState) {
    case CallInvite.State.Pending:
      return (
        <View style={[$styles.row, themed($actionItemsPending)]}>
          <Button
            style={themed($rejectButton)}
            LeftAccessory={() => <Icon icon="missed_call" />}
            onPress={handleCallReject}
          />
          <Button
            style={themed($acceptButton)}
            LeftAccessory={() => <Icon icon="incoming_call" onPress={handleCallAccept} />}
          />
        </View>
      )
    case CallInvite.State.Accepted:
      return (
        <View style={themed($acceptedActions)}>
          <View style={[$styles.row, themed($callInteractions)]}>
            <Button
              style={themed($callInteractionButtons)}
              LeftAccessory={() => <Icon icon="micOff" />}
              preset="outline"
            />
            <Button
              style={themed($callInteractionButtons)}
              LeftAccessory={() => <Icon icon="speaker" />}
              preset="outline"
            />
            <Button
              style={themed($callInteractionButtons)}
              LeftAccessory={() => <Icon icon="dialer" />}
              preset="outline"
            />
          </View>
          <View style={[$styles.row, themed($hangupContainer)]}>
            <Button
              style={themed($rejectButton)}
              LeftAccessory={() => <Icon icon="missed_call" />}
              onPress={handleHangUp}
            />
          </View>
        </View>
      )
    case CallInvite.State.Rejected:
      return (
        <View>
          <Text tx="activeCall:rejected" />
        </View>
      )
    case CallInvite.State.Cancelled:
      return (
        <View>
          <Text tx="activeCall:cancelled" />
        </View>
      )
  }
}

const $root: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  justifyContent: "center",
  display: "flex",
  height: "100%",
  gap: spacing.xxl,
  paddingTop: spacing.xxxl * 1.5,
  paddingBottom: spacing.xxxl * 1.5,
})

const $notificationHeader: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.xs,
})

const $imageStyle: ThemedStyle<ImageStyle> = ({ spacing }) => ({
  height: spacing.xxxl * 1.5,
  width: spacing.xxxl * 1.5,
})

const $infoContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  justifyContent: "center",
  alignItems: "center",
})

const $fromPhoneNumber: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  marginTop: spacing.xl,
  color: colors.textDim,
})

const $actionItemsPending: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  width: "70%",
  height: spacing.xxl,
  justifyContent: "space-between",
  marginTop: "auto",
})

const $acceptButton: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  borderRadius: spacing.xxxl,
  borderCurve: "circular",
  height: spacing.xxxl * 1.25,
  width: spacing.xxxl * 1.25,
  backgroundColor: colors.success,
})

const $rejectButton: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  borderRadius: spacing.xxxl,
  borderCurve: "circular",
  height: spacing.xxxl * 1.25,
  width: spacing.xxxl * 1.25,
  backgroundColor: colors.error,
})

const $acceptedActions: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  width: "70%",
  gap: spacing.xxxl,
})

const $callInteractions: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  width: "100%",
  justifyContent: "space-between",
})

const $callInteractionButtons: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  borderRadius: spacing.xxxl,
  borderCurve: "circular",
  height: spacing.xxxl * 1.25,
  width: spacing.xxxl * 1.25,
})

const $hangupContainer: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  justifyContent: "center",
})
