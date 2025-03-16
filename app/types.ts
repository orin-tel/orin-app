import { COUNTRY_MAP } from "./constants"

export type CountryISOCode = (typeof COUNTRY_MAP)[number]["value"]
export type CountryPhoneCode = (typeof COUNTRY_MAP)[number]["code"]
