import { types, Instance, SnapshotIn, SnapshotOut, applySnapshot } from "mobx-state-tree"
import { COUNTRY_MAP, LANGUAGE_MAP } from "@/constants"
import { CountryPhoneCode } from "@/types"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { telephonyApi } from "@/services/api/telephony/telephonyApi"
import { userApi } from "@/services/api/user/userApi"

export const UserStore = types
  .model("UserStore")
  .props({
    authProvider: types.maybeNull(types.string),
    authProviderId: types.maybeNull(types.string),
    userPhoneNumber: types.maybeNull(types.string),
    userCountryPhoneCode: types.maybeNull(
      types.enumeration(
        "CountryPhoneCode",
        COUNTRY_MAP.map((c) => c.code),
      ),
    ),
    userPrimaryEmail: types.maybeNull(types.string),
    userProfilePicture: types.maybeNull(types.string),
    userTransferPhoneNumber: types.maybeNull(types.string),
    userTransferPhoneCode: types.maybeNull(
      types.enumeration(
        "CountryPhoneCode",
        COUNTRY_MAP.map((c) => c.code),
      ),
    ),
    isUserOnboardingComplete: types.maybeNull(types.boolean),
    userTransferPhoneCodeIcon: types.maybeNull(types.string),
    // Country Screen-----
    userCountry: types.maybeNull(types.string),
    userCountryIcon: types.maybeNull(types.string),
    // -----Country Screen
    // About Screen-----
    userName: types.maybeNull(types.string),
    userAbout: types.maybeNull(types.string),
    // -----About Screen
    // Agent Screen-----
    userLanguage: types.maybeNull(types.string),
    userLanguageIcon: types.maybeNull(types.string),
    userAgentName: types.maybeNull(types.string),
    userAgentVoice: types.maybeNull(types.string),
    // -----Agent Screen

    // ------ Call related -------
    telephonyAccessToken: types.maybeNull(types.string),
    // ------ Call related -------
  })
  .actions(withSetPropAction)
  .actions((self) => ({
    setUserPhoneNumber(phoneNumber: string | null) {
      self.userPhoneNumber = phoneNumber
    },
    setUserCountryPhoneCode(countryPhoneCode: CountryPhoneCode | null) {
      self.userCountryPhoneCode = countryPhoneCode
    },
    // transfer
    setUserTransferPhoneNumber(transferPhoneNumber: string | null) {
      self.userTransferPhoneNumber = transferPhoneNumber
    },
    setUserTransferPhoneCode(transferPhoneCode: CountryPhoneCode | null) {
      self.userTransferPhoneCode = transferPhoneCode
    },
    setUserTransferPhoneCodeIcon(userTransferPhoneCodeIcon: string | null) {
      const country =
        LANGUAGE_MAP.find((item) => item.value === userTransferPhoneCodeIcon)?.country ?? null
      self.userTransferPhoneCodeIcon = country
    },
    // Country Screen-----
    setUserCountry(userCountry: string | null) {
      self.userCountry = userCountry
    },
    setUserCountryIcon(userCountryIcon: string | null) {
      const country = COUNTRY_MAP.find((item) => item.value === userCountryIcon)?.value ?? null
      self.userCountryIcon = country
    },
    // -----Country Screen
    // About Screen-----
    setUserName(userName: string | null) {
      self.userName = userName
    },
    setUserAbout(userAbout: string | null) {
      self.userAbout = userAbout
    },
    // -----About Screen
    // Agent Screen-----
    setUserLanguage(userLanguage: string | null) {
      self.userLanguage = userLanguage
    },
    setUserLanguageIcon(userLanguageIcon: string | null) {
      const country = LANGUAGE_MAP.find((item) => item.value === userLanguageIcon)?.country ?? null
      self.userLanguageIcon = country
    },
    setUserAgentName(userAgentName: string | null) {
      self.userAgentName = userAgentName
    },
    setUserAgentVoice(userAgentVoice: string | null) {
      self.userAgentVoice = userAgentVoice
    },
    // -----Agent Screen
    // ------ Call related -------
    setTelephonyAccessToken(telephonyAccessToken: string | null) {
      self.telephonyAccessToken = telephonyAccessToken
    },
    async fetchTelephonyAccessToken(): Promise<string> {
      const response = await telephonyApi.getTelephonyToken()
      if (response.kind === "ok") {
        self.setProp("telephonyAccessToken", response.token)
        return response.token
      } else {
        console.error(`Error fetching telephonyAccessToken: ${JSON.stringify(response)}`)
        return ""
      }
    },
    /**
     * returns true if user already existed
     * false if onboarding is needed
     */
    async signInUser(): Promise<boolean> {
      const response = await userApi.signInUser()
      if (response.kind === "ok") {
        const user = response.user
        self.setProp("authProvider", user.auth_provider)
        self.setProp("authProviderId", user.auth_provider_id)
        self.setProp("userAgentName", user.agent_name)
        self.setProp("userAgentVoice", user.agent_voice)
        self.setProp("userCountry", user.location)
        self.setProp("userLanguage", user.language)
        self.setProp("userName", user.first_name + " " + user.last_name)
        self.setProp("userPhoneNumber", user.phone_number)
        self.setProp("userPrimaryEmail", user.primary_email)
        self.setProp("userProfilePicture", user.profile_picture_url)
        if (user.is_onboarding_complete) return true
        return false
      } else {
        console.error(`Error signing in user: ${JSON.stringify(response)}`)
        return false
      }
    },
    // ------ Call related -------
    resetStore() {
      applySnapshot(self, {})
    },
  }))

// Types for strict mode
export interface IUserStore extends Instance<typeof UserStore> {}
export type UserStoreSnapshotIn = SnapshotIn<typeof UserStore>
export type UserStoreSnapshotOut = SnapshotOut<typeof UserStore>

// Create store instance
export const userStore = UserStore.create({})
