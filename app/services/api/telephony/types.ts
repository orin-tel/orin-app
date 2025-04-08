import { ICall } from "@/types"

export interface ICallPaginated {
  calls: ICall[]
  hasMore: boolean
  nextCursor: string | null // UNIX
}
