import {
  types,
  flow,
  Instance,
  SnapshotIn,
  SnapshotOut,
  applySnapshot,
  getSnapshot,
} from "mobx-state-tree"
import * as Location from "expo-location"
import { COUNTRY_MAP } from "@/constants"
import { withSetPropAction } from "./helpers/withSetPropAction"

export const COUNTRY_PHONE_MAP: Record<string, string> = COUNTRY_MAP.reduce(
  (acc, { value, code }) => {
    acc[value] = code
    return acc
  },
  {} as Record<string, string>,
)

export const LocationStore = types
  .model("LocationStore")
  .props({
    permissionGranted: types.optional(types.boolean, false),
    latitude: types.maybeNull(types.number),
    longitude: types.maybeNull(types.number),
    countryISOCode: types.maybeNull(types.string),
    countryPhoneCode: types.maybeNull(types.string),
    error: types.maybeNull(types.string),
    loading: types.optional(types.boolean, false),
  })
  .actions(withSetPropAction)
  .actions((self) => ({
    fetchLocation: flow(function* () {
      self.loading = true
      self.error = null
      try {
        // Check if permission is already granted
        const permissionStatus = yield Location.getForegroundPermissionsAsync()
        if (permissionStatus.status === "granted") {
          self.permissionGranted = true
        } else {
          // Request permission only if not granted
          const { status } = yield Location.requestForegroundPermissionsAsync()
          if (status !== "granted") {
            self.error = "Permission denied"
            self.loading = false
            return
          }
          self.permissionGranted = true
        }

        // Get current location
        const location = yield Location.getCurrentPositionAsync({})
        self.latitude = location.coords.latitude
        self.longitude = location.coords.longitude

        // Reverse geocode to get country
        if (self.latitude !== null && self.longitude !== null) {
          const address = yield Location.reverseGeocodeAsync({
            latitude: self.latitude,
            longitude: self.longitude,
          })

          if (address.length > 0 && address[0].isocountryISOCode) {
            const countryISOCode = address[0].isocountryISOCode.toUpperCase()
            self.countryISOCode = countryISOCode
            self.countryPhoneCode = COUNTRY_PHONE_MAP[countryISOCode] || "Unknown"
          } else {
            self.error = "Unable to fetch country"
          }
        } else {
          self.error = "Invalid coordinates"
        }
      } catch (err) {
        self.error = err instanceof Error ? err.message : "An unknown error occurred"
      }
      self.loading = false
    }),
    saveSnapshot() {
      return getSnapshot(self)
    },
    reset() {
      applySnapshot(self, {})
    },
  }))

// TypeScript Types for Snapshots
export type ILocationStore = Instance<typeof LocationStore>
export type ILocationStoreSnapshotIn = SnapshotIn<typeof LocationStore>
export type ILocationStoreSnapshotOut = SnapshotOut<typeof LocationStore>
