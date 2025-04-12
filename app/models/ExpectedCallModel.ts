import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"

export const ExpectedCallModel = types.model("ExpectedCall").props({
  id: types.identifier,
  caller_name: types.string,
  caller_reason: types.string,
})

export interface ExpectedCall extends Instance<typeof ExpectedCallModel> {}
export interface ExpectedCallSnapshotOut extends SnapshotOut<typeof ExpectedCallModel> {}
export interface ExpectedCallSnapshotIn extends SnapshotIn<typeof ExpectedCallModel> {}
