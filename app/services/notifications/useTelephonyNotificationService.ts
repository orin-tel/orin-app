import { useStores } from "@/models"
import { useCallback, useEffect } from "react"
import { voice } from "../voice/voice"
import { useAuth } from "@clerk/clerk-react"
import { CallInvite, Voice } from "@twilio/voice-react-native-sdk"
import { navigationRef } from "@/navigators"

export const useTelephonyNotificationService = () => {
  const { userStore } = useStores()
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

  useEffect(() => {
    voice.on(Voice.Event.Registered, () => {
      console.log("Successfully registered for incoming calls")
    })

    voice.on(Voice.Event.CallInvite, (callInvite: CallInvite) => {
      console.log("voice listener event")
      if (navigationRef.isReady()) {
        navigationRef.navigate("ActiveCall", callInvite)
      }
    })

    return () => {
      voice.off(Voice.Event.Registered)
      voice.off(Voice.Event.CallInvite)
    }
  }, [])
}
