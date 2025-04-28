import { useStores } from "@/models"
import { useCallback, useEffect, useRef, useState } from "react"
import { voice } from "../voice/voice"
import { useAuth } from "@clerk/clerk-react"
import { Call, CallInvite, IncomingCallMessage, Voice } from "@twilio/voice-react-native-sdk"
import { navigationRef } from "@/navigators"
import { AppState } from "react-native"
import { useAppState } from "@/utils/useAppState"
import notifee, { AndroidCategory, AndroidImportance } from "@notifee/react-native"
import NotificationSounds from "react-native-notification-sounds"
import { ACTIVE_CALL_SCREEN } from "@/constants"
import { LinkingContext } from "@react-navigation/native"
import * as Linking from "expo-linking"

export const useTelephonyNotificationService = () => {
  const { userStore, telephonyCallStore } = useStores()
  const { sessionId } = useAuth()

  const { fetchTelephonyAccessToken, userPrimaryEmail } = userStore

  const fetchAccessTokenAndRegister = useCallback(async (register: (token: string) => void) => {
    const token = await fetchTelephonyAccessToken()
    if (!token) {
      return
    }
    register(token)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /** Register with Voice */
  const registerVoice = async (token: string) => {
    try {
      await voice.register(token)
    } catch (err) {
      console.log("Error while registering voice", err)
    }
  }
  useEffect(() => {
    if (sessionId && userPrimaryEmail) {
      fetchAccessTokenAndRegister(registerVoice)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, userPrimaryEmail])

  async function onDisplayNotification() {
    try {
      console.log("WHAT IS GOING ON")
      // Request permissions (required for iOS)
      await notifee.requestPermission()
      const soundsList = await NotificationSounds.getNotifications("ringtone")
      console.log("WHAT IS GOING ON", soundsList)

      // Create a channel (required for Android)
      const channelId = await notifee.createChannel({
        id: "incoming-call",
        name: "Incoming Call Channel",
        sound: soundsList?.[0].url,
        vibration: true,
        vibrationPattern: [300, 500],
      })
      console.log("WHY NOW")

      // Display a notification
      await notifee.displayNotification({
        title: "Incoming Call",
        body: "Incoming Call FullScreen",
        android: {
          channelId,
          category: AndroidCategory.CALL,
          importance: AndroidImportance.HIGH,
          fullScreenAction: {
            // For custom component:
            id: "incoming-call-component",
            mainComponent: ACTIVE_CALL_SCREEN,
          },
          // smallIcon: "name-of-a-small-icon", // optional, defaults to 'ic_launcher'.
          // pressAction is needed if you want the notification to open the app when pressed
          pressAction: {
            id: "incoming-call-press",
          },
        },
      })
      console.log("NOT HAPPY")
    } catch (err) {
      console.log("ERROR WHILE NOTIFEE", err)
    }
  }
  useEffect(() => {
    voice.on(Voice.Event.Registered, () => {
      console.log("Successfully registered for incoming calls")
    })
    return () => {
      voice.off(Voice.Event.Registered)
    }
  }, [])

  voice.on(Voice.Event.CallInvite, async (callInvite: CallInvite) => {
    telephonyCallStore.addActiveCall(callInvite)
    console.log("RECEIVED CALL INVITE", AppState.isAvailable, AppState.currentState)
    if (AppState.isAvailable && AppState.currentState !== "active") {
      callInvite.on(CallInvite.Event.NotificationTapped, async () => {
        setTimeout(async () => {
          if (navigationRef.isReady()) {
            navigationRef.navigate("ActiveCall", {
              telephonyCallId: callInvite.getCallSid(),
            })
          }
        }, 500)
      })
    } else {
      if (navigationRef.isReady()) {
        console.log("NAVIGATION IS READY")
        navigationRef.navigate("ActiveCall", {
          telephonyCallId: callInvite.getCallSid(),
        })
      }
    }
  })
}
