import { useEffect, useState } from "react"
import { AppState, AppStateStatus } from "react-native"

export function useAppState() {
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState ?? "active")

  useEffect(() => {
    const isMounted = true
    const onChange = (newState: AppStateStatus) => {
      try {
        if (typeof newState === "string") {
          if (isMounted) {
            setAppState(newState)
          }
        } else {
          console.warn("AppState received non-string value:", newState)
        }
      } catch (err) {
        console.error("Error setting appState:", err)
      }
    }

    const subscription = AppState.addEventListener("change", onChange)

    return () => {
      subscription.remove()
    }
  }, [])

  return appState
}
