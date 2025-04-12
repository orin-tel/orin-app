import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"

export const ListContactModel = types.model("ListContact").props({
  id: types.identifier,
  name: types.string,
  phone_number_e164: types.string,
  list_type: types.string,
})

export const SectionListModel = types.model("SectionList", {
  title: types.string,
  data: types.array(ListContactModel),
})

export interface ListContact extends Instance<typeof ListContactModel> {}
export interface ListContactSnapshotOut extends SnapshotOut<typeof ListContactModel> {}
export interface ListContactSnapshotIn extends SnapshotIn<typeof ListContactModel> {}

export interface SectionList extends Instance<typeof SectionListModel> {}
export interface SectionListSnapshotOut extends SnapshotOut<typeof SectionListModel> {}
export interface SectionListSnapshotIn extends SnapshotIn<typeof SectionListModel> {}
