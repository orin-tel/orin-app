import { COUNTRY_MAP, LANGUAGE_MAP } from "./constants"

export type CountryISOCode = (typeof COUNTRY_MAP)[number]["value"]
export type CountryPhoneCode = (typeof COUNTRY_MAP)[number]["code"]


export type LanguageIcon = (typeof LANGUAGE_MAP)[number]["country"]
