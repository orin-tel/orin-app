import { CallInvite } from "@twilio/voice-react-native-sdk"
import { types, Instance, SnapshotIn, SnapshotOut } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

export const TelephonyCallStoreModel = types
  .model("ActiveCall")
  .volatile(
    (
      store,
    ): {
      activeCalls: CallInvite[]
    } => ({
      activeCalls: [],
    }),
  )
  .actions(withSetPropAction)
  .views((store) => ({
    getActiveCall(telephonyCallId: string): CallInvite | undefined {
      return store.activeCalls?.find((call) => call.getCallSid() === telephonyCallId)
    },
  }))
  .actions((store) => ({
    removeActiveCall(telephonyCallId: string): void {
      const newActiveCalls = store.activeCalls?.filter(
        (call) => call.getCallSid() !== telephonyCallId,
      )
      store.activeCalls = newActiveCalls
    },
    addActiveCall(call: CallInvite): void {
      if (!store.activeCalls) {
        return
      }
      if (store.activeCalls?.length === 0) {
        store.activeCalls.push(call)
        return
      }
      const newActiveCalls = [...store.activeCalls, call]
      store.activeCalls = newActiveCalls
    },
  }))
// TypeScript helpers
export interface TelephonyCallStore extends Instance<typeof TelephonyCallStoreModel> {}
export interface TelephonyCallStoreSnapshotIn extends SnapshotIn<typeof TelephonyCallStoreModel> {}
export interface TelephonyCallStoreSnapshotOut
  extends SnapshotOut<typeof TelephonyCallStoreModel> {}
