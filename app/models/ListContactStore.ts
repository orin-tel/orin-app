import {
  types,
  Instance,
  SnapshotIn,
  SnapshotOut,
  applySnapshot,
  cast,
  getSnapshot,
} from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import {
  ListContact,
  ListContactModel,
  ListContactSnapshotIn,
  ListContactSnapshotOut,
  SectionListModel,
  SectionListSnapshotIn,
  SectionListSnapshotOut,
  SectionListType,
} from "./ListContactModel"
import { listContactApi } from "@/services/api/listContact/listContactApi"
import { SectionList } from "react-native"
import { IListContact } from "@/services/api/listContact/types"

// util functions
export const removeFromGrouped = (
  groupedArray: SectionListSnapshotOut[],
  contactId: string,
): SectionListSnapshotOut[] => {
  return groupedArray.reduce<SectionListSnapshotOut[]>((acc, section) => {
    const data = section.data ?? []
    const filteredData = data.filter((contact) => contact.id !== contactId)

    if (filteredData.length > 0) {
      acc.push({ ...section, data: filteredData })
    }

    return acc
  }, [])
}

export const insertIntoGrouped = (
  groupedArray: SectionListSnapshotOut[],
  contact: ListContactSnapshotIn,
): SectionListSnapshotOut[] => {
  const letter = (contact.name?.[0] || "#").toUpperCase()
  const sectionIndex = groupedArray.findIndex((sec) => sec.title === letter)

  if (sectionIndex !== -1) {
    const existingSection = groupedArray[sectionIndex]
    const updatedData = [...existingSection.data, contact].sort((a, b) =>
      a.name.localeCompare(b.name),
    )

    const updatedSection = { ...existingSection, data: updatedData }

    const newGroupedArray = [...groupedArray]
    newGroupedArray[sectionIndex] = updatedSection

    return newGroupedArray.sort((a, b) => a.title.localeCompare(b.title))
  } else {
    return [...groupedArray, { title: letter, data: [contact] }].sort((a, b) =>
      a.title.localeCompare(b.title),
    )
  }
}

export const moveBetweenGrouped = (
  from: SectionListSnapshotOut[],
  to: SectionListSnapshotOut[],
  contact: ListContactSnapshotOut,
) => {
  removeFromGrouped(from, contact.id)
  insertIntoGrouped(to, contact)
}

export const ListContactStore = types
  .model("ListContactStore")
  .props({
    whitelist: types.array(ListContactModel),
    blacklist: types.array(ListContactModel),
    groupedWhitelist: types.frozen<SectionListSnapshotOut[]>(),
    groupedBlacklist: types.frozen<SectionListSnapshotOut[]>(),
    page: 0,
  })
  .actions(withSetPropAction)
  // .views((self) => ({
  //   get groupedWhitelistView() {
  //     return self.groupedWhitelist.map((section) => ({
  //       title: section.title,
  //       data: section.data.map((c) => ({
  //         name: c.name,
  //         number: c.phone_number_e164,
  //       })),
  //     }))
  //   },
  // }))
  .actions((store) => ({
    async fetchWhitelist() {
      store.setProp("whitelist", [])
      store.setProp("groupedWhitelist", [])
      store.setProp("page", 0)
      const response = await listContactApi.getListContacts({
        list_type: "WHITELIST",
        limit: 30,
        offset: store.page * 30,
      })

      if (response.kind === "ok") {
        const whitelist = response.contacts
        store.setProp("whitelist", whitelist)
        if (whitelist.length === 0) store.setProp("page", 0)
        console.log("basic whitelist" + response.contacts) //------------

        let grouped = store.groupedWhitelist
        whitelist.forEach((item) => {
          grouped = insertIntoGrouped(grouped, item)
        })

        store.setProp("groupedWhitelist", grouped)
        store.setProp("page", store.page + 1)
        console.log("grouped whitelist" + store.groupedWhitelist) //-----------
      } else {
        console.error("Failed to fetch whitelist:", response)
        return response
      }
      return
    },

    async fetchBlacklist() {
      store.setProp("blacklist", [])
      store.setProp("groupedBlacklist", [])
      store.setProp("page", 0)
      const response = await listContactApi.getListContacts({
        list_type: "BLACKLIST",
        limit: 30,
        offset: store.page * 30,
      })
      if (response.kind === "ok") {
        const blacklist = response.contacts
        store.setProp("blacklist", blacklist)
        if (blacklist.length === 0) store.setProp("page", 0)
        console.log("basic blacklist" + response.contacts) // -------------------

        let grouped = store.groupedBlacklist
        blacklist.forEach((contact) => {
          grouped = insertIntoGrouped(grouped, contact)
        })
        store.setProp("groupedBlacklist", grouped)
        store.setProp("page", store.page + 1)
        console.log("grouped blacklist" + store.groupedBlacklist) // ----------------
      } else {
        console.error("Failed to fetch blacklist:", response)
        return response
      }
      return
    },

    async createListContact(name: string, phone: string, list_type: string) {
      const response = await listContactApi.createListContact({
        name: name,
        phone_number_e164: phone,
        list_type: list_type,
      })

      if (response.kind === "ok") {
        const contact = response.contact
        console.log("CONTACT IS", contact)
        if (contact.list_type === "WHITELIST") {
          const grouped = insertIntoGrouped(store.groupedWhitelist, contact)
          store.setProp("groupedWhitelist", grouped)
          console.log(store.groupedWhitelist)
          store.setProp("whitelist", [...store.whitelist, contact])
        }
        if (contact.list_type === "BLACKLIST") {
          const grouped = insertIntoGrouped(store.groupedBlacklist, contact)
          store.setProp("groupedBlacklist", grouped)
          console.log(store.groupedBlacklist)
          store.setProp("blacklist", [...store.blacklist, contact])
        }
      } else {
        console.error("Failed to create contact:", response)
        return response
      }
      return
    },

    async deleteListContact(id: string) {
      const response = await listContactApi.deleteListContact(id)
      if (response.kind === "ok") {
        if (store.whitelist.some((contact) => contact.id === id)) {
          const group = removeFromGrouped(store.groupedWhitelist, id)
          store.setProp("groupedWhitelist", group)
          store.setProp(
            "whitelist",
            store.whitelist.filter((item) => item.id !== id),
          )
        } else if (store.blacklist.some((contact) => contact.id === id)) {
          const group = removeFromGrouped(store.groupedBlacklist, id)
          store.setProp("groupedBlacklist", group)
          store.setProp(
            "blacklist",
            store.blacklist.filter((item) => item.id !== id),
          )
        }
      } else {
        console.error("Failed to delete contact:", response)
        return response
      }
      return
    },

    async moveListContact(id: string, list_type: string) {
      // get from list
      let movedItem
      if (list_type === "BLACKLIST") {
        movedItem = store.whitelist.find((contact) => contact.id === id)
      } else if (list_type === "WHITELIST") {
        movedItem = store.blacklist.find((contact) => contact.id === id)
      }
      if (!movedItem) return
      const response = await listContactApi.updateListContact(id, { list_type: list_type })

      if (response.kind === "ok") {
        // item is being added to blacklist
        if (list_type === "BLACKLIST") {
          const whitelistGroup = removeFromGrouped(store.groupedWhitelist, id)
          // validate moved item
          const movedItemSnapshot: ListContactSnapshotIn = {
            name: movedItem.name,
            id: movedItem.id,
            phone_number_e164: movedItem.phone_number_e164,
            list_type: "BLACKLIST",
          }
          const blacklistGroup = insertIntoGrouped(store.groupedBlacklist, movedItemSnapshot)
          // assign to groups
          store.setProp("groupedWhitelist", whitelistGroup)
          store.setProp("groupedBlacklist", blacklistGroup)
          // assign to list
          store.setProp(
            "whitelist",
            store.whitelist.filter((item) => item.id !== id),
          )
          store.setProp("blacklist", [...store.blacklist, movedItemSnapshot])
        }
        // Item is being moved to whitelist
        else if (list_type === "WHITELIST") {
          const blacklistGroup = removeFromGrouped(store.groupedBlacklist, id)
          // validate moved item
          const movedItemSnapshot: ListContactSnapshotIn = {
            name: movedItem.name,
            id: movedItem.id,
            phone_number_e164: movedItem.phone_number_e164,
            list_type: "WHITELIST",
          }
          const whitelistGroup = insertIntoGrouped(store.groupedWhitelist, movedItemSnapshot)
          // assign to groups
          store.setProp("groupedWhitelist", whitelistGroup)
          store.setProp("groupedBlacklist", blacklistGroup)
          // assign to list
          store.setProp(
            "blacklist",
            store.blacklist.filter((item) => item.id !== id),
          )
          store.setProp("whitelist", [...store.whitelist, movedItemSnapshot])
        }
      } else {
        console.error("Failed to move contact:", response)
        return response
      }
      return
    },
  }))

// Types for strict mode
export interface IListContactStore extends Instance<typeof ListContactStore> {}
export interface ListContactStoreSnapshot extends SnapshotOut<typeof ListContactModel> {}

// Create store instance
export const listContactStore = ListContactStore.create({
  whitelist: [],
  blacklist: [],
  groupedWhitelist: [],
  groupedBlacklist: [],
})
