import { subDays, subMinutes, formatISO } from "date-fns"

export type CallLog = {
  call_type: "incoming" | "outgoing" | "missed" | "received_by_agent"
  tag: "span" | "ai" | "callback"
  datetime: string
  call_duration: number
  from_number: string
  caller_first_name: string
  caller_last_name: string
  caller_organisation: string
  subject_line: string
}

const generateFakeNumber = (): string => {
  return `+91${Math.floor(1000000000 + Math.random() * 9000000000)}`
}

const callTypes: CallLog["call_type"][] = ["incoming", "outgoing", "missed", "received_by_agent"]
const tags: CallLog["tag"][] = ["span", "ai", "callback"]
const names = ["Alice", "Bob", "Charlie", "David", "Emma", "Frank", "Grace", "Hannah"]
const organisations = ["Acme Corp", "Tech Solutions", "DataBridge", "InnovateX", "NextGen AI"]

const callLogs: CallLog[] = []

for (let day = 0; day < 14; day++) {
  const baseDate = subDays(new Date(), day)
  for (let i = 0; i < 5 + Math.floor(Math.random() * 10); i++) {
    const datetime = formatISO(subMinutes(baseDate, Math.floor(Math.random() * 1440)))
    callLogs.push({
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

export const callLogFixture = callLogs
