import { useEffect, useState } from "react"
import {
  getMessaging,
  getToken,
  onMessage,
  onTokenRefresh,
  requestPermission,
  isSupported,
  AuthorizationStatus,
} from "@react-native-firebase/messaging"
import { Platform, Alert } from "react-native"
import { voice } from "../voice/voice"
import { userApi } from "../api/user/userApi"
import { useStores } from "@/models"
import { ICall } from "@/types"

export function useFirebaseMessaging() {
  const [fcmToken, setFcmToken] = useState<string | null>(null)
  const { callStore } = useStores()

  useEffect(() => {
    const setupMessaging = async () => {
      try {
        const messaging = getMessaging()
        if (!isSupported(messaging)) {
          console.log("Firebase messaging is not supported on this platform")
          return () => {}
        }

        const authStatus = await requestPermission(messaging)
        const enabled =
          authStatus === AuthorizationStatus.AUTHORIZED ||
          authStatus === AuthorizationStatus.PROVISIONAL

        if (!enabled) {
          Alert.alert("Permission denied", "Unable to get push notification permission.")
          return () => {}
        }

        const token = await getToken(messaging)
        if (token) {
          setFcmToken(token)
          console.log("FCM Token:", token)
          await userApi.registerDevice(token)
        }

        const unsubscribeOnTokenRefresh = onTokenRefresh(messaging, async (newToken) => {
          setFcmToken(newToken)
          console.log("FCM Token refreshed:", newToken)
          try {
            await userApi.registerDevice(newToken)
            console.log("Updated device token on refresh")
          } catch (err) {
            console.error("Error updating device token on refresh:", err)
          }
        })

        const unsubscribeOnMessage = onMessage(messaging, async (remoteMessage) => {
          console.log("Received a foreground message:", remoteMessage)
          if (remoteMessage.data?.twi_account_sid) {
            voice.handleFirebaseMessage(remoteMessage.data as any)
          } else {
            if (typeof remoteMessage.data?.payload === "string") {
              try {
                const payload = JSON.parse(remoteMessage.data?.payload)
                await callStore.updateCallListFromNotification(payload as ICall)
              } catch (err) {
                console.log("PAYLOAD")
                console.log("INVALID TYPE OF PAYLOAD", err)
              }
            }
          }
        })

        return () => {
          unsubscribeOnTokenRefresh()
          unsubscribeOnMessage()
        }
      } catch (err) {
        console.error("Error in Firebase Messaging setup:", err)
        return () => {}
      }
    }

    setupMessaging()
  }, [])

  return { fcmToken }
}
