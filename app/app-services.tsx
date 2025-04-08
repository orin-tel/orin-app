import { type ReactNode } from "react"
// index.js or App.js (outside component scope)
import messaging from "@react-native-firebase/messaging"
import { voice } from "./services/voice/voice"

export function AppServices({ children }: { children?: ReactNode }) {
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log("Message handled in the background!", remoteMessage)
    if (remoteMessage.data?.twi_account_sid) voice.handleFirebaseMessage(remoteMessage.data as any)
  })
  return <>{children}</>
}
