import { types, Instance, SnapshotIn, SnapshotOut, applySnapshot, cast } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { expectedCallApi } from "@/services/api/expectedCalls/expectedCallApi"
import { ExpectedCallModel } from "./ExpectedCallModel"

// use types.frozen for type in model
export const ExpectedCallStore = types
  .model("ExpectedCallStore")
  .props({
    expectedCalls: types.array(
      ExpectedCallModel,
      // types.model("ExpectedCall", {
      //   id: types.identifier,
      //   name: types.maybe(types.string),
      //   reason: types.maybe(types.string),
      // }),
    ),
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    async fetchExpectedCalls() {
      const response = await expectedCallApi.getExpectedCalls()
      if (response.kind === "ok") {
        store.setProp("expectedCalls", response.calls)
        // store.expectedCalls.replace(response.calls)
        console.log("from store fetch ", response.calls) //
      } else {
        console.error("Failed to fetch expected calls:", response)
      }
    },

    async createExpectedCall(name: string, reason: string) {
      const response = await expectedCallApi.createExpectedCall({
        caller_name: name,
        caller_reason: reason,
        caller_number: "+91134124124",
      })
      // if (response.kind === "ok" && response.call) {
      //   store.expectedCalls.push(response.call)
      // } else {
      //   console.error("Failed to add expected call:", response)
      // }

      if (response.kind === "ok") {
        console.log("from store ", response.call) //

        store.setProp("expectedCalls", [...store.expectedCalls, response.call])

        console.log("from store after prop", response.call)
      } else {
        console.error("Failed to create expected call:", response)
      }
    },

    async updateExpectedCall(id: string, caller_name: string, caller_reason: string) {
      const callToUpdate = store.expectedCalls.find((call) => call.id === id)
      if (!callToUpdate) {
        console.warn("Call to update not found")
        return
      }

      const response = await expectedCallApi.updateExpectedCall(id, {
        caller_name,
        caller_reason,
        caller_number: "9809809809",
      })
      if (response.kind === "ok") {
        callToUpdate.caller_name = caller_name
        callToUpdate.caller_reason = caller_reason
      } else {
        console.error("Failed to update expected call:", response)
      }
    },

    async deleteExpectedCall(id: string) {
      const response = await expectedCallApi.deleteExpectedCall(id)
      if (response.kind === "ok") {
        // store.expectedCalls.replace(store.expectedCalls.filter((call) => call.id !== id))
        const updatedCalls = store.expectedCalls.filter((call) => call.id !== id)
        applySnapshot(store.expectedCalls, updatedCalls)
      } else {
        console.error("Failed to delete expected call:", response)
      }
    },

    // resetStore() {
    //   applySnapshot(self, { expectedCalls: [] })
    // },
  }))
  .views((store) => ({
    get getExpectedCalls() {
      return store.expectedCalls
    },
  }))

// Types for strict mode
export interface IExpectedCallStore extends Instance<typeof ExpectedCallStore> {}
export interface ExpectedCallStoreSnapshot extends SnapshotOut<typeof ExpectedCallModel> {}
// export type ExpectedCallStoreSnapshotIn = SnapshotIn<typeof ExpectedCallStore>
// export type ExpectedCallStoreSnapshotOut = SnapshotOut<typeof ExpectedCallStore>

// Create store instance
export const expectedCallStore = ExpectedCallStore.create({})
