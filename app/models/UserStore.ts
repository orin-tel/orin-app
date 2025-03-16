import { types, Instance, SnapshotIn, SnapshotOut, applySnapshot } from "mobx-state-tree"
import { COUNTRY_MAP } from "@/constants"
import { CountryPhoneCode } from "@/types"

export const UserStore = types
  .model("UserStore", {
    userPhoneNumber: types.maybeNull(types.string),
    userCountryPhoneCode: types.maybeNull(
      types.enumeration(
        "CountryPhoneCode",
        COUNTRY_MAP.map((c) => c.code),
      ),
    ),
  })
  .actions((self) => ({
    setUserPhoneNumber(phoneNumber: string | null) {
      self.userPhoneNumber = phoneNumber
    },
    setUserCountryPhoneCode(countryPhoneCode: CountryPhoneCode | null) {
      self.userCountryPhoneCode = countryPhoneCode
    },
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
