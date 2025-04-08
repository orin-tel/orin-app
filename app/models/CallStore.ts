import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { api, telephonyApi } from "../services/api"
import { CallModel, Call } from "./Call"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { ICall } from "@/types"
import { convertICallToSnapshotIn } from "@/utils/convertICallToCallSnapshotIn"

export const CallStoreModel = types
  .model("CallStore")
  .props({
    calls: types.array(CallModel),
    hasMore: false,
    nextCursor: types.maybeNull(types.string),
    // manage filters here
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    // FETCH CALLS on mount
    async fetchCalls() {
      const newDate = new Date().toISOString()
      const before = newDate
      const response = await telephonyApi.getAllCallsBefore(before)
      if (response.kind === "ok") {
        const data = response.data
        store.setProp("calls", data.calls)
        store.setProp("hasMore", data.hasMore)
        store.setProp("nextCursor", data.nextCursor)
      } else {
        console.error(`Error fetching episodes: ${JSON.stringify(response)}`)
      }
    },
    async fetchCallsBefore() {
      if (!store.nextCursor || !store.hasMore) {
        return
      }
      const beforeDate = new Date(store.nextCursor)
      const response = await telephonyApi.getAllCallsBefore(beforeDate?.toISOString())
      if (response.kind === "ok") {
        const data = response.data
        store.setProp("hasMore", data.hasMore)
        store.setProp("nextCursor", data.nextCursor)
        store.setProp("calls", [...store.calls, ...data.calls])
      } else {
        console.error(`Error fetching episodes: ${JSON.stringify(response)}`)
      }
    },
    async updateCallListFromNotification(call: ICall) {
      const existingIndex = store.calls.findIndex((c) => c.id === call.id)
      console.log("DATA AFTER NOTIF", call)
      console.log("STORE DATA FIRST", store.calls.length)
      // convert call to CallSnapshotIn
      const newCall = convertICallToSnapshotIn(call)
      if (existingIndex !== -1) {
        const updatedCalls = [...store.calls]
        const callCreated = CallModel.create(newCall)
        updatedCalls[existingIndex] = callCreated
        store.setProp("calls", updatedCalls)
      } else {
        console.log("BIHARI AGAYI")
        console.log("NEW CALL", newCall)
        store.setProp("calls", [newCall, ...store.calls])
        console.log("BIHARI CHALI GAYI")
      }
      console.log("STORE DATA LAST", store.calls.length)
    },
  }))

export interface CallStore extends Instance<typeof CallStoreModel> {}
export interface CallStoreSnapshot extends SnapshotOut<typeof CallStoreModel> {}
