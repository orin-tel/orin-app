import { types, Instance, SnapshotIn, SnapshotOut, applySnapshot } from "mobx-state-tree"
import { COUNTRY_MAP, LANGUAGE_MAP } from "@/constants"
import { CountryPhoneCode, LanguageIcon } from "@/types"

export const UserStore = types
  .model("UserStore", {
    userPhoneNumber: types.maybeNull(types.string),
    userCountryPhoneCode: types.maybeNull(
      types.enumeration(
        "CountryPhoneCode",
        COUNTRY_MAP.map((c) => c.code),
      ),
    ),
    userTransferPhoneNumber: types.maybeNull(types.string),
    userTransferPhoneCode: types.maybeNull(
      types.enumeration(
        "CountryPhoneCode",
        COUNTRY_MAP.map((c) => c.code),
      ),
    ),
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
    
  })
  .actions((self) => ({
    setUserPhoneNumber(phoneNumber: string | null) {
      self.userPhoneNumber = phoneNumber;
    },
    setUserCountryPhoneCode(countryPhoneCode: CountryPhoneCode | null) {
      self.userCountryPhoneCode = countryPhoneCode;
    },
    // transfer
    setUserTransferPhoneNumber(transferPhoneNumber: string | null) {
      self.userTransferPhoneNumber = transferPhoneNumber;
    },
    setUserTransferPhoneCode(transferPhoneCode: CountryPhoneCode | null) {
      self.userTransferPhoneCode = transferPhoneCode;
    },
    setUserTransferPhoneCodeIcon(userTransferPhoneCodeIcon: string | null) {
      const country = LANGUAGE_MAP.find((item) => item.value === userTransferPhoneCodeIcon)?.country ?? null;
      self.userTransferPhoneCodeIcon = country;
    },
    // Country Screen-----
    setUserCountry(userCountry: string | null) {
      self.userCountry = userCountry;
    },
    setUserCountryIcon(userCountryIcon: string | null) {
      const country = COUNTRY_MAP.find((item) => item.value === userCountryIcon)?.value ?? null;
      self.userCountryIcon = country;
    },
    // -----Country Screen
    // About Screen-----
    setUserName(userName: string | null) {
      self.userName = userName;
    },
    setUserAbout(userAbout: string | null) {
      self.userAbout = userAbout;
    },
    // -----About Screen
    // Agent Screen-----
    setUserLanguage(userLanguage: string | null) {
      self.userLanguage = userLanguage;
    },
    setUserLanguageIcon(userLanguageIcon: string | null) {
      const country = LANGUAGE_MAP.find((item) => item.value === userLanguageIcon)?.country ?? null;
      self.userLanguageIcon = country;
    },
    setUserAgentName(userAgentName: string | null) {
      self.userAgentName = userAgentName;
    },
    setUserAgentVoice(userAgentVoice: string | null) {
      self.userAgentVoice = userAgentVoice;
    },
    // -----Agent Screen
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
