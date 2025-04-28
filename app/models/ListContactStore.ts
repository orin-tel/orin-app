import {
  types,
  Instance,
  SnapshotIn,
  SnapshotOut,
  applySnapshot,
  cast,
  getSnapshot,
  flow,
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
import * as Contacts from "expo-contacts"
import type { GeneralApiProblem } from "@/services/api/apiProblem"

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

const deduplicateByPhoneNumber = <T extends Omit<IListContact, "id"> | ListContactSnapshotIn>(
  contacts: T[],
) => {
  const seen = new Set() // To keep track of unique phone numbers
  return contacts.filter((item) => {
    if (!seen.has(item.phone_number_e164)) {
      seen.add(item.phone_number_e164) // Add phone number to the Set
      return true // Keep this item
    }
    return false // Skip duplicate items
  })
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
  .actions((store) => ({
    // EXPO CONTACTS START
    fetchContacts: flow(function* fetchContacts() {
      const { status }: Contacts.PermissionResponse = yield Contacts.requestPermissionsAsync()
      if (status !== Contacts.PermissionStatus.GRANTED) return false
      let allContacts: Contacts.Contact[] = []
      let startPage = 0
      const pageSize = 10_000
      let hasMore = true
      try {
        // Keep fetching until there are no more pages
        while (hasMore) {
          const contactQuery = {
            pageSize: pageSize, // Number of contacts per page
            pageStart: startPage, // The starting index for the query
            sort: Contacts.SortTypes.FirstName, // Sort contacts alphabetically
          }

          // Fetch contacts for the current page
          const { data, hasNextPage }: Contacts.ContactResponse =
            yield Contacts.getPagedContactsAsync(contactQuery)

          // Append fetched contacts to the allContacts array
          allContacts = [...allContacts, ...data]
          console.log("DATA FOR CONTACTS", data)
          // restructure data
          const creatableListContacts: Omit<IListContact, "id">[] = data.flatMap((contact) => {
            // Ensure there are phone numbers
            if (contact.phoneNumbers && contact.phoneNumbers?.length > 0) {
              return contact.phoneNumbers
                .filter((phoneNumber) => !!phoneNumber.number)
                .map((phoneNumber) => ({
                  name: contact.name,
                  phone_number_e164:
                    phoneNumber?.number?.[0] !== "+"
                      ? "+1" + phoneNumber.number?.replaceAll(/\s/g, "")
                      : (phoneNumber.number?.replaceAll(/\s/g, "") ?? ""),
                  list_type: "WHITELIST",
                }))
            }
            return [] // In case there are no phone numbers, return an empty array
          })
          const dedupedContacts = deduplicateByPhoneNumber(creatableListContacts)
          const response: { kind: "ok"; contact: ListContactSnapshotIn } | GeneralApiProblem =
            yield listContactApi.batchCreateListContact(dedupedContacts)

          if (response.kind === "ok") {
          } else {
            return response
          }
          // Update hasNextPage and pageStart for the next fetch
          hasMore = hasNextPage
          startPage += pageSize
        }
        return true
        // Once all contacts are fetched, set the contacts in the store
      } catch (error) {
        console.log("an error occured", error)
        return false
      }
    }),
    // EXPO CONTACTS END
    async fetchWhitelist() {
      // store.setProp("whitelist", [])
      store.setProp("groupedWhitelist", [])
      store.setProp("page", 0)
      const response = await listContactApi.getListContacts({
        list_type: "WHITELIST",
        limit: 30,
        offset: store.page * 30,
      })

      if (response.kind === "ok") {
        const whitelist = response.contacts
        const dedupedWhitelist = deduplicateByPhoneNumber(whitelist)
        console.log("DEDUPED WHITELIST", dedupedWhitelist)
        store.setProp("whitelist", dedupedWhitelist)
        if (whitelist.length === 0) store.setProp("page", 0)

        let grouped = store.groupedWhitelist
        dedupedWhitelist.forEach((item) => {
          grouped = insertIntoGrouped(grouped, item)
        })

        store.setProp("groupedWhitelist", grouped)
        store.setProp("page", store.page + 1)
      } else {
        console.error("Failed to fetch whitelist:", response)
        return response
      }
      return
    },

    async fetchBlacklist() {
      // store.setProp("blacklist", [])
      store.setProp("groupedBlacklist", [])
      store.setProp("page", 0)

      const response = await listContactApi.getListContacts({
        list_type: "BLACKLIST",
        limit: 30,
        offset: store.page * 30,
      })
      if (response.kind === "ok") {
        console.log("RESPONSE", response.kind)
        const blacklist = response.contacts
        const dedupedBlacklist = deduplicateByPhoneNumber(blacklist)
        store.setProp("blacklist", dedupedBlacklist)
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

    reset() {
      applySnapshot(store, {
        groupedBlacklist: [],
        groupedWhitelist: [],
      })
    },
  }))
  .views((store) => ({
    filteredAndGroupedWhitelist(searchQuery: string) {
      const data = store.groupedWhitelist?.map((section) => ({
        title: section.title,
        data: section.data
          ?.filter((data) => data.name?.includes(searchQuery))
          ?.map((c) => ({
            id: c.id,
            name: c.name,
            number: c.phone_number_e164,
          })),
      }))
      const filteredData = data?.filter((section) => section.data.length > 0)
      return filteredData
    },

    filteredAndGroupedBlacklist(searchQuery: string = "") {
      const data = store.groupedBlacklist?.map((section) => ({
        title: section.title,
        data: section.data
          ?.filter((data) => data.name?.includes(searchQuery))
          ?.map((c) => ({
            id: c.id,
            name: c.name,
            number: c.phone_number_e164,
          })),
      }))
      const filteredData = data?.filter((section) => section.data.length > 0)
      return filteredData
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
