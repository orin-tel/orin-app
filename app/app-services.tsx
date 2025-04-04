import { type ReactNode } from "react"

import { useTelephonyNotificationService } from "./services/notifications"

export function AppServices({ children }: { children?: ReactNode }) {
  useTelephonyNotificationService()

  return <>{children}</>
}
