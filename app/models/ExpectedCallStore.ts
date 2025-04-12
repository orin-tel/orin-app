import { types, Instance, SnapshotIn, SnapshotOut, applySnapshot, cast } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { expectedCallApi } from "@/services/api/expectedCalls/expectedCallApi"
import { ExpectedCallModel, ExpectedCallSnapshotIn } from "./ExpectedCallModel"

export const ExpectedCallStore = types
  .model("ExpectedCallStore")
  .props({
    expectedCalls: types.array(ExpectedCallModel),
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    async fetchExpectedCalls() {
      const response = await expectedCallApi.getExpectedCalls()
      if (response.kind === "ok") {
        store.setProp("expectedCalls", response.calls)
      } else {
        console.error("Failed to fetch expected calls:", response)
      }
    },

    async createExpectedCall(name: string, reason: string) {
      const response = await expectedCallApi.createExpectedCall({
        caller_name: name,
        caller_reason: reason,
      })
      if (response.kind === "ok") {
        store.setProp("expectedCalls", [...store.expectedCalls, response.call])
      } else {
        console.error("Failed to create expected call:", response)
        return response
      }
      return
    },

    async updateExpectedCall(id: string, caller_name: string, caller_reason: string) {
      const callToUpdateIndex = store.expectedCalls.findIndex((call) => call.id === id)
      if (callToUpdateIndex === -1) {
        console.warn("Call to update not found")
        return
      }
      const updatedCall: ExpectedCallSnapshotIn = {
        id: id,
        caller_name: caller_name,
        caller_reason: caller_reason,
      }
      const newStore = store.expectedCalls.slice()
      newStore[callToUpdateIndex] = updatedCall
      store.setProp("expectedCalls", newStore)
      const response = await expectedCallApi.updateExpectedCall(id, {
        caller_name,
        caller_reason,
      })
      if (response.kind === "ok") {
        // do nothing
      } else {
        // in the next refresh it'll return to original state
        console.error("Failed to update expected call:", response)
        return response
      }
      return
    },

    async deleteExpectedCall(id: string) {
      const response = await expectedCallApi.deleteExpectedCall(id)
      if (response.kind === "ok") {
        // store.expectedCalls.replace(store.expectedCalls.filter((call) => call.id !== id))
        const updatedCalls = store.expectedCalls.filter((call) => call.id !== id)
        applySnapshot(store.expectedCalls, updatedCalls)
      } else {
        console.error("Failed to delete expected call:", response)
        return response
      }
      return
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

// Create store instance
export const expectedCallStore = ExpectedCallStore.create({})
