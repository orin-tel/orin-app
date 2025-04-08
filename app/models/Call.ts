import { types, Instance, SnapshotIn, SnapshotOut } from "mobx-state-tree"

export const CallTypeEnum = types.enumeration("CallType", [
  "INCOMING_CALL",
  "OUTGOING_CALL",
  "MISSED_CALL",
  "RECEIVED_CALL",
])

export const TagEnum = types.enumeration("Tag", ["AI", "SPAM", "CALLBACK"])

export const CallModel = types.model("Call").props({
  id: types.identifier,
  userId: types.string,
  callId: types.string,
  toPhoneNumber: types.string,
  fromPhoneNumber: types.string,
  callerName: types.maybe(types.string),
  receiverName: types.maybe(types.string),
  provider: types.string,
  forwardedFrom: types.maybe(types.string),
  callStartTime: types.string,
  callEndTime: types.maybe(types.string),
  callDuration: types.maybe(types.number),
  duration: types.maybe(types.number),
  metadata: types.maybe(types.frozen()),

  callType: types.maybe(CallTypeEnum),
  tags: types.maybe(types.array(TagEnum)),
  summary: types.maybe(types.string),
  transcription: types.frozen(),
  notes: types.frozen(),

  createdAt: types.string,
  updatedAt: types.string,
})

// TypeScript helpers
export interface Call extends Instance<typeof CallModel> {}
export interface CallSnapshotIn extends SnapshotIn<typeof CallModel> {}
export interface CallSnapshotOut extends SnapshotOut<typeof CallModel> {}
