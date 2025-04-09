import { types, Instance, SnapshotIn, SnapshotOut, applySnapshot, cast } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { ListContactModel } from "./ListContactModel"
import { listContactApi } from "@/services/api/listContact/listContactApi"

export const ListContactStore = types
  .model("ListContactStore")
  .props({
    whitelist: types.array(ListContactModel),
    blacklist: types.array(ListContactModel),
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    async fetchWhitelist() {
      const response = await listContactApi.getListContacts()
      if (response.kind === "ok") {
        const whitelist = response.calls.filter((contact) => contact.list_type === "WHITELIST")
        store.setProp("whitelist", whitelist)
      } else {
        console.error("Failed to fetch whitelist:", response)
      }
    },
    async fetchBlacklist() {
      const response = await listContactApi.getListContacts()
      if (response.kind === "ok") {
        const blacklist = response.calls.filter((contact) => contact.list_type === "BLACKLIST")
        store.setProp("blacklist", blacklist)
      } else {
        console.error("Failed to fetch blacklist:", response)
      }
    },

    async createListContact(name: string, phone: string, list_type: string) {
      const response = await listContactApi.createListContact({
        name: name,
        phone_number_e164: phone,
        list_type: list_type,
      })
      if (response.kind === "ok") {
        if (response.contact.list_type === "WHITELIST")
          store.setProp("whitelist", [...store.whitelist, response.contact])
        if (response.contact.list_type === "BLACKLIST")
          store.setProp("whitelist", [...store.blacklist, response.contact])
      } else {
        console.error("Failed to create expected call:", response)
      }
    },

    async deleteListContact(id: string) {
      const response = await listContactApi.deleteListContact(id)
      if (response.kind === "ok") {
        const isInWhitelist = store.whitelist.some((contact) => contact.id === id)
        const isInBlacklist = store.blacklist.some((contact) => contact.id === id)

        if (isInWhitelist) {
          const updatedList = store.whitelist.filter((contact) => contact.id !== id)
          applySnapshot(store.whitelist, updatedList)
        }
        if (isInBlacklist) {
          const updatedList = store.blacklist.filter((contact) => contact.id !== id)
          applySnapshot(store.blacklist, updatedList)
        }
      } else {
        console.error("Failed to delete expected call:", response)
      }
    },
  }))

// Types for strict mode
export interface IListContactStore extends Instance<typeof ListContactStore> {}
export interface ListContactStoreSnapshot extends SnapshotOut<typeof ListContactModel> {}

// Create store instance
export const listContactStore = ListContactStore.create({})
