import { CallInvite } from "@twilio/voice-react-native-sdk"
import { COUNTRY_MAP, LANGUAGE_MAP } from "./constants"

export type CountryISOCode = (typeof COUNTRY_MAP)[number]["value"]
export type CountryPhoneCode = (typeof COUNTRY_MAP)[number]["code"]

export type LanguageIcon = (typeof LANGUAGE_MAP)[number]["country"]

export enum CALL_TYPE {
  INCOMING_CALL = "incoming_call",
  OUTGOING_CALL = "outgoing_call",
  MISSED_CALL = "missed_call",
  RECEIVED_CALL = "received_call",
}

export enum TAG {
  SPAM = "SPAM",
  AI = "AI",
  CALLBACK = "CALLBACK",
}

export type CallLog = {
  call_type: "incoming_call" | "outgoing_call" | "missed_call" | "received_call"
  tag: "spam" | "ai" | "callback"
  datetime: string
  call_duration: number
  from_number: string
  caller_first_name: string
  caller_last_name: string
  caller_organisation: string
  subject_line: string
  call_id: string
}

export interface ICall {
  id: string
  call_id: string
  user_id: string
  to_phone_number: string
  from_phone_number: string
  caller_name: string | null
  receiver_name: string | null
  provider: string
  forwarded_from: string | null
  call_start_time: string // ISO 8601
  call_end_time: string | null
  call_duration: number | null
  duration: number | null
  metadata?: Record<string, any> | null
  call_type: string
  tags: string[]
  summary: string
  transcription: object[]
  notes: object[]
  created_at: string // ISO 8601
  updated_at: string // ISO 8601
}

export interface ITelephonyNotification {
  data: ITelephonyNotificationData
  from: string
  messageId: string
  originalPriority: number
  priority: number
  sentTime: number
  ttl: number
}

export interface ITelephonyNotificationData {
  twi_account_sid: string
  twi_answer_timeout: string
  twi_bridge_token: string
  twi_call_sid: string
  twi_from: string
  twi_message_id: string
  twi_message_type: string
  twi_params: string
  twi_stir_status: string
  twi_to: string
}

export interface ISNSNotification {
  collapseKey: string
  data: ISNSNotificationData
  from: string
  messageId: string
  notification: Notification
  originalPriority: string
  priority: string
  sentTime: string
  ttl: string
}

export interface ISNSNotificationData {
  payload: string
}

export interface ISNSNotificationNotification {
  android: ISNSNotificationNotificationAndroid
  body: string
  title: string
}

export interface ISNSNotificationNotificationAndroid {}
