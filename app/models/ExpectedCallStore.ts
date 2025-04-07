import { types, Instance, SnapshotIn, SnapshotOut, applySnapshot } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { expectedCallApi } from "@/services/api/expectedCalls/expectedCallApi"

export const ExpectedCallStore = types
  .model("ExpectedCallStore")
  .props({
    expectedCalls: types.optional(
      types.array(
        types.model("ExpectedCall", {
          id: types.identifier,
          name: types.string,
          reason: types.string,
        }),
      ),
      [],
    ),
  })
  .actions(withSetPropAction)
  .actions((self) => ({
    async fetchExpectedCalls() {
      const response = await expectedCallApi.getExpectedCalls()
      if (response.kind === "ok") {
        self.expectedCalls.replace(response.calls)
        console.log("from store fetch ", response.calls) // console
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
      if (response.kind === "ok") {
        console.log("from store ", response.call)

        self.setProp("expectedCalls", [
          ...self.expectedCalls,
          {
            id: response.call.id,
            name: response.call.name,
            reason: response.call.reason,
          },
        ])
      } else {
        console.error("Failed to create expected call:", response)
      }
    },

    async updateExpectedCall(id: string, name: string, reason: string) {
      const callToUpdate = self.expectedCalls.find((call) => call.id === id)
      if (!callToUpdate) {
        console.warn("Call to update not found")
        return
      }

      const response = await expectedCallApi.updateExpectedCall(id, { name, reason })
      if (response.kind === "ok") {
        callToUpdate.name = name
        callToUpdate.reason = reason
      } else {
        console.error("Failed to update expected call:", response)
      }
    },

    async deleteExpectedCall(id: string) {
      const response = await expectedCallApi.deleteExpectedCall(id)
      if (response.kind === "ok") {
        self.expectedCalls.replace(self.expectedCalls.filter((call) => call.id !== id))
      } else {
        console.error("Failed to delete expected call:", response)
      }
    },

    resetStore() {
      applySnapshot(self, { expectedCalls: [] })
    },
  }))
  .views((self) => ({
    get getExpectedCalls() {
      return self.expectedCalls
    },
  }))

// Types for strict mode
export interface IExpectedCallStore extends Instance<typeof ExpectedCallStore> {}
export type ExpectedCallStoreSnapshotIn = SnapshotIn<typeof ExpectedCallStore>
export type ExpectedCallStoreSnapshotOut = SnapshotOut<typeof ExpectedCallStore>

// Create store instance
export const expectedCallStore = ExpectedCallStore.create({})
