import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * Enum for call types.
 */
export const CallTypeEnum = types.enumeration("CallType", [
  "incoming_call",
  "outgoing_call",
  "missed_call",
  "received_call",
])

/**
 * Enum for tags.
 */
export const TagEnum = types.enumeration("Tag", ["AI", "Spam", "Callback"])

/**
 * Represents a call record with transcription and notes.
 */
export const CallModel = types
  .model("Call")
  .props({
    phoneNumber: types.string,
    callerName: types.maybe(types.string),
    timestamp: types.string, // ISO 8601 format
    callType: CallTypeEnum,
    tags: types.array(TagEnum),
    summary: types.string,
    transcription: types.array(
      types.model({
        timestamp: types.string,
        speaker: types.string,
        text: types.string,
      }),
    ),
    notes: types.array(
      types.model({
        timestamp: types.string,
        text: types.string,
      }),
    ),
  })
  .actions(withSetPropAction)
  .actions((self) => ({
    addTranscription(timestamp: string, speaker: string, text: string) {
      self.transcription.push({ timestamp, speaker, text })
    },
    clearTranscriptions() {
      self.transcription.clear()
    },
    addNote(timestamp: string, text: string) {
      self.notes.push({ timestamp, text })
    },
    clearNotes() {
      self.notes.clear()
    },
  }))

export interface Call extends Instance<typeof CallModel> {}
export interface CallSnapshotOut extends SnapshotOut<typeof CallModel> {}
export interface CallSnapshotIn extends SnapshotIn<typeof CallModel> {}
