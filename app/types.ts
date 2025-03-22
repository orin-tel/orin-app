import { COUNTRY_MAP, LANGUAGE_MAP } from "./constants"

export type CountryISOCode = (typeof COUNTRY_MAP)[number]["value"]
export type CountryPhoneCode = (typeof COUNTRY_MAP)[number]["code"]

export type LanguageIcon = (typeof LANGUAGE_MAP)[number]["country"]
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
