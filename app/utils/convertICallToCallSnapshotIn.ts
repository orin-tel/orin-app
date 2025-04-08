import { CallSnapshotIn } from "@/models/Call"
import { ICall } from "@/types"

export function convertICallToSnapshotIn(iCall: ICall): CallSnapshotIn {
  return {
    id: iCall.id,
    userId: iCall.user_id,
    callId: iCall.call_id,
    toPhoneNumber: iCall.to_phone_number,
    fromPhoneNumber: iCall.from_phone_number,
    callerName: iCall.caller_name ?? undefined,
    receiverName: iCall.receiver_name ?? undefined,
    provider: iCall.provider,
    forwardedFrom: iCall.forwarded_from ?? undefined,
    callStartTime: iCall.call_start_time,
    callEndTime: iCall.call_end_time ?? undefined,
    callDuration: iCall.call_duration ?? undefined,
    duration: iCall.duration ?? undefined,
    metadata: iCall.metadata ?? undefined,

    callType: iCall.call_type as CallSnapshotIn["callType"],

    tags: iCall.tags?.length ? (iCall.tags as CallSnapshotIn["tags"]) : undefined,

    summary: iCall.summary ?? undefined,

    transcription: iCall.transcription?.length
      ? (iCall.transcription as CallSnapshotIn["transcription"])
      : undefined,

    notes: iCall.notes?.length ? (iCall.notes as CallSnapshotIn["notes"]) : undefined,

    createdAt: iCall.created_at,
    updatedAt: iCall.updated_at,
  }
}
