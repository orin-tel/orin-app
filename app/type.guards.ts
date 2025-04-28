import { ISNSNotificationData, ITelephonyNotificationData } from "./types"

export function isTelephonyNotification(data: any): data is ITelephonyNotificationData {
  return typeof data.twi_call_sid === "string"
}

export function isSNSNotification(data: any): data is ISNSNotificationData {
  return typeof data.payload === "string"
}
