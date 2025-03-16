import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { AuthenticationStoreModel } from "./AuthenticationStore"
import { EpisodeStoreModel } from "./EpisodeStore"
import { LocationStore } from "./LocationStore"
import { UserStore } from "./UserStore"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  authenticationStore: types.optional(AuthenticationStoreModel, {}),
  episodeStore: types.optional(EpisodeStoreModel, {}),
  locationStore: types.optional(LocationStore, {}),
  userStore: types.optional(UserStore, {}),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
