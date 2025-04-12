import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { AuthenticationStoreModel } from "./AuthenticationStore"
import { EpisodeStoreModel } from "./EpisodeStore"
import { LocationStore } from "./LocationStore"
import { UserStore } from "./UserStore"
import { CallStoreModel } from "./CallStore"
import { ExpectedCallStore } from "./ExpectedCallStore"
import { ListContactStore } from "./ListContactStore"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  authenticationStore: types.optional(AuthenticationStoreModel, {}),
  episodeStore: types.optional(EpisodeStoreModel, {}),
  locationStore: types.optional(LocationStore, {}),
  userStore: types.optional(UserStore, {
    userCountryPhoneCode: "+1",
  }),
  callStore: types.optional(CallStoreModel, {
    calls: [],
  }),
  expectedCallStore: types.optional(ExpectedCallStore, {}),
  listContactStore: types.optional(ListContactStore, {
    groupedBlacklist: [],
    groupedWhitelist: [],
  }),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
