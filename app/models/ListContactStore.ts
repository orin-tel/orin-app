import { types, Instance, SnapshotIn, SnapshotOut, applySnapshot, cast } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { ListContact, ListContactModel, SectionListModel } from "./ListContactModel"
import { listContactApi } from "@/services/api/listContact/listContactApi"

export const ListContactStore = types
  .model("ListContactStore")
  .props({
    whitelist: types.array(ListContactModel),
    blacklist: types.array(ListContactModel),
    groupedWhitelist: types.array(SectionListModel),
    groupedBlacklist: types.array(SectionListModel),
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
    insertIntoGrouped(
      groupedArray: { title: string; data: ListContact[] }[],
      contact: ListContact,
    ) {
      const letter = contact.name[0].toUpperCase()
      const section = groupedArray.find((sec) => sec.title === letter)

      if (section) {
        section.data.push(contact)
        section.data.sort((a, b) => a.name.localeCompare(b.name))
      } else {
        groupedArray.push({
          title: letter,
          data: [contact],
        })
        groupedArray.sort((a, b) => a.title.localeCompare(b.title))
      }
    },

    removeFromGrouped(groupedArray: { title: string; data: ListContact[] }[], contactId: string) {
      for (let i = 0; i < groupedArray.length; i++) {
        const section = groupedArray[i]
        const index = section.data.findIndex((c) => c.id === contactId)

        if (index !== -1) {
          section.data.splice(index, 1)
          // Remove the section if it's now empty
          if (section.data.length === 0) {
            groupedArray.splice(i, 1)
          }
          break
        }
      }
    },

    moveBetweenGrouped(
      from: { title: string; data: ListContact[] }[],
      to: { title: string; data: ListContact[] }[],
      contact: ListContact,
    ) {
      this.removeFromGrouped(from, contact.id)
      this.insertIntoGrouped(to, contact)
    },

    async fetchWhitelist(limit: number, offset: number) {
      const response = await listContactApi.getListContacts({
        list_type: "WHITELIST",
        limit,
        offset,
      })

      if (response.kind === "ok") {
        const whitelist = response.contacts
        store.setProp("whitelist", whitelist)

        console.log("basic whitelist" + response.contacts) //------------

        const grouped = cast<typeof store.groupedWhitelist>([])
        whitelist.forEach((contact) => {
          this.insertIntoGrouped(grouped, contact)
        })
        applySnapshot(store.groupedWhitelist, grouped)

        console.log("grouped whitelist" + store.groupedWhitelist) //-----------
      } else {
        console.error("Failed to fetch whitelist:", response)
      }
    },

    async fetchBlacklist(limit: number, offset: number) {
      const response = await listContactApi.getListContacts({
        list_type: "BLACKLIST",
        limit,
        offset,
      })
      if (response.kind === "ok") {
        const blacklist = response.contacts
        store.setProp("blacklist", blacklist)

        console.log("basic blacklist" + response.contacts) // -------------------

        const grouped = cast<typeof store.groupedBlacklist>([])
        blacklist.forEach((contact) => {
          this.insertIntoGrouped(grouped, contact)
        })
        applySnapshot(store.groupedBlacklist, grouped)
        console.log("grouped blacklist" + store.groupedBlacklist) // ----------------
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
        const contact = response.contact

        if (contact.list_type === "WHITELIST") {
          store.whitelist.push(contact)
          this.insertIntoGrouped(store.groupedWhitelist, contact)
          // const updated = [...store.groupedWhitelist]
          // this.insertIntoGrouped(updated, contact)
          // applySnapshot(store.groupedWhitelist, updated)

          console.log(store.groupedWhitelist)
        }

        if (contact.list_type === "BLACKLIST") {
          store.blacklist.push(contact)
          this.insertIntoGrouped(store.groupedBlacklist, contact)
          // const updated = [...store.groupedBlacklist]
          // this.insertIntoGrouped(updated, contact)
          // applySnapshot(store.groupedBlacklist, updated)

          console.log(store.groupedBlacklist)
        }
      } else {
        console.error("Failed to create contact:", response)
      }
    },

    async deleteListContact(id: string) {
      const response = await listContactApi.deleteListContact(id)
      if (response.kind === "ok") {
        if (store.whitelist.some((contact) => contact.id === id)) {
          const updatedList = store.whitelist.filter((contact) => contact.id !== id)
          applySnapshot(store.whitelist, updatedList)
          this.removeFromGrouped(store.groupedWhitelist, id)
        } else if (store.blacklist.some((contact) => contact.id === id)) {
          const updatedList = store.blacklist.filter((contact) => contact.id !== id)
          applySnapshot(store.blacklist, updatedList)
          this.removeFromGrouped(store.groupedBlacklist, id)
        }
      } else {
        console.error("Failed to delete contact:", response)
      }
    },

    // async deleteListContact(id: string) {
    //   const response = await listContactApi.deleteListContact(id)
    //   if (response.kind === "ok") {
    //     const isInWhitelist = store.whitelist.some((contact) => contact.id === id)
    //     const isInBlacklist = store.blacklist.some((contact) => contact.id === id)

    //     if (isInWhitelist) {
    //       const updatedList = store.whitelist.filter((contact) => contact.id !== id)
    //       applySnapshot(store.whitelist, updatedList)
    //     }
    //     if (isInBlacklist) {
    //       const updatedList = store.blacklist.filter((contact) => contact.id !== id)
    //       applySnapshot(store.blacklist, updatedList)
    //     }
    //   } else {
    //     console.error("Failed to delete expected call:", response)
    //   }
    // },

    // async moveListContact(id: string, list_type: string) {
    //   const response = await listContactApi.updateListContact(id, { list_type: list_type })

    //   if (response.kind === "ok") {
    //     const updatedContact = response.contact

    //     const fromList = updatedContact.list_type === "WHITELIST" ? store.blacklist : store.whitelist
    //     const toList = updatedContact.list_type === "WHITELIST" ? store.whitelist : store.blacklist

    //     const fromGrouped = updatedContact.list_type === "WHITELIST" ? store.groupedBlacklist : store.groupedWhitelist
    //     const toGrouped = updatedContact.list_type === "WHITELIST" ? store.groupedWhitelist : store.groupedBlacklist

    //     // Remove from old list
    //     const newFromList = fromList.filter((c) => c.id !== id)
    //     applySnapshot(fromList, newFromList)

    //     // Add to new list
    //     toList.push(updatedContact)

    //     // Update grouped arrays
    //     moveBetweenGrouped(fromGrouped, toGrouped, updatedContact)
    //   } else {
    //     console.error("Failed to move contact:", response)
    //   }
    // }
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
