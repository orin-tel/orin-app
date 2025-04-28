import { PhoneNumberType, PhoneNumberUtil } from "google-libphonenumber"

export const COUNTRY_MAP = [
  { value: "US", label: "United States", code: "+1" },
  // Commenting canada because same code as USA
  { value: "CA", label: "Canada", code: "+1" },
  { value: "GB", label: "United Kingdom", code: "+44" },
  { value: "AU", label: "Australia", code: "+61" },
  { value: "IN", label: "India", code: "+91" },
  { value: "DE", label: "Germany", code: "+49" },
  { value: "FR", label: "France", code: "+33" },
  { value: "IT", label: "Italy", code: "+39" },
  { value: "ES", label: "Spain", code: "+34" },
  { value: "BR", label: "Brazil", code: "+55" },
  { value: "CN", label: "China", code: "+86" },
  { value: "JP", label: "Japan", code: "+81" },
  { value: "RU", label: "Russia", code: "+7" },
  { value: "ZA", label: "South Africa", code: "+27" },
  { value: "MX", label: "Mexico", code: "+52" },
  { value: "AR", label: "Argentina", code: "+54" },
  { value: "NG", label: "Nigeria", code: "+234" },
  { value: "SA", label: "Saudi Arabia", code: "+966" },
  { value: "KR", label: "South Korea", code: "+82" },
  { value: "ID", label: "Indonesia", code: "+62" },
  { value: "TR", label: "Turkey", code: "+90" },
  { value: "PH", label: "Philippines", code: "+63" },
  { value: "PK", label: "Pakistan", code: "+92" },
  { value: "BD", label: "Bangladesh", code: "+880" },
  { value: "EG", label: "Egypt", code: "+20" },
]

export const PHONE_CODE_MAP: Record<string, string> = {
  "+1": "US", // CA is excluded
  "+44": "GB",
  "+61": "AU",
  "+91": "IN",
  "+49": "DE",
  "+33": "FR",
  "+39": "IT",
  "+34": "ES",
  "+55": "BR",
  "+86": "CN",
  "+81": "JP",
  "+7": "RU",
  "+27": "ZA",
  "+52": "MX",
  "+54": "AR",
  "+234": "NG",
  "+966": "SA",
  "+82": "KR",
  "+62": "ID",
  "+90": "TR",
  "+63": "PH",
  "+92": "PK",
  "+880": "BD",
  "+20": "EG",
}

export const LANGUAGE_MAP = [
  { value: "EN", country: "GB", label: "English", code: "" },

  { value: "HIN", country: "IN", label: "Hindi", code: "" },
  { value: "BEN", country: "IN", label: "Bengali", code: "" },

  { value: "FR", country: "FR", label: "French", code: "" },
]

export const ACTIVE_CALL_SCREEN = "active-call-screen"
