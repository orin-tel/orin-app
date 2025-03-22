import { CallLog } from "@/types"
import { subDays, subMinutes, formatISO, compareDesc } from "date-fns"

const generateFakeNumber = (): string => {
  return `+91${Math.floor(1000000000 + Math.random() * 9000000000)}`
}

const callTypes: CallLog["call_type"][] = [
  "incoming_call",
  "outgoing_call",
  "missed_call",
  "received_call",
]
const tags: CallLog["tag"][] = ["spam", "ai", "callback"]
const names = ["Alice", "Bob", "Charlie", "David", "Emma", "Frank", "Grace", "Hannah"]
const organisations = ["Acme Corp", "Tech Solutions", "DataBridge", "InnovateX", "NextGen AI"]

const callLogs: CallLog[] = []

for (let day = 0; day < 14; day++) {
  const baseDate = subDays(new Date(), day)
  for (let i = 0; i < 5 + Math.floor(Math.random() * 10); i++) {
    const datetime = formatISO(subMinutes(baseDate, Math.floor(Math.random() * 1440)))
    callLogs.push({
      call_id: generateFakeNumber(),
      call_type: callTypes[Math.floor(Math.random() * callTypes.length)],
      tag: tags[Math.floor(Math.random() * tags.length)],
      datetime,
      call_duration: Math.floor(Math.random() * 300000), // Up to 5 minutes in milliseconds
      from_number: generateFakeNumber(),
      caller_first_name: names[Math.floor(Math.random() * names.length)],
      caller_last_name: names[Math.floor(Math.random() * names.length)],
      caller_organisation: organisations[Math.floor(Math.random() * organisations.length)],
      subject_line: "Follow-up regarding service inquiry",
    })
  }
}

// **Sort by datetime (newest first)**
callLogs.sort((a, b) => compareDesc(new Date(a.datetime), new Date(b.datetime)))

export const callLogFixture = callLogs
