import { ApiResponse, ApisauceInstance, create } from "apisauce"
import Config from "../../../config"
import { GeneralApiProblem, getGeneralApiProblem } from "../apiProblem"
import type { ApiConfig, NestResponse } from "../api.types"
import { getClerkInstance } from "@clerk/clerk-expo"
import { SnapshotIn } from "mobx-state-tree"
import { ListContactSnapshotIn } from "@/models/ListContactModel"
import { IListContact } from "./types"

/**
 * Configuring the apisauce instance.
 */
export const LIST_CONTACT_API_CONFIG: ApiConfig = {
  url: Config.API_BASE_URL + "/list-contact",
  timeout: 10000,
}

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class ListContactApi {
  apisauce: ApisauceInstance
  config: ApiConfig

  /**
   * Set up our API instance. Keep this lightweight!
   */
  constructor(config: ApiConfig = LIST_CONTACT_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
  }

  // expected calls

  async getListContacts(params: {
    list_type: string
    limit: number
    offset: number
  }): Promise<{ kind: "ok"; contacts: ListContactSnapshotIn[] } | GeneralApiProblem> {
    const token = await getClerkInstance().session?.getToken()
    this.apisauce.setHeader("authorization", `Bearer ${token}`)

    const response: ApiResponse<NestResponse<IListContact[]>> = await this.apisauce.get("", params)
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    const data = response.data
    if (!data) throw new Error("data not available")
    const snapshotIn: ListContactSnapshotIn[] = data.data.map((contact) => ({
      id: contact.id,
      name: contact.name,
      phone_number_e164: contact.phone_number_e164,
      list_type: contact.list_type,
    }))
    return { kind: "ok", contacts: snapshotIn ?? [] }
  }

  async createListContact(contactData: {
    name: string
    phone_number_e164: string
    list_type: string
  }): Promise<{ kind: "ok"; contact: ListContactSnapshotIn } | GeneralApiProblem> {
    const token = await getClerkInstance().session?.getToken()
    this.apisauce.setHeader("authorization", `Bearer ${token}`)
    const response: ApiResponse<NestResponse<IListContact>> = await this.apisauce.post(
      "",
      contactData,
    )
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    const data = response.data
    if (!data) throw new Error("data not available")
    const snapshotIn: ListContactSnapshotIn = {
      id: data.data.id,
      name: data.data.name,
      phone_number_e164: data.data.phone_number_e164,
      list_type: data.data.list_type,
    }
    return { kind: "ok", contact: snapshotIn }
  }

  async updateListContact(
    id: string,
    data: {
      list_type: string
    },
  ): Promise<{ kind: "ok" } | GeneralApiProblem> {
    const token = await getClerkInstance().session?.getToken()
    this.apisauce.setHeader("authorization", `Bearer ${token}`)
    const response = await this.apisauce.put(`${id}`, data)

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    return { kind: "ok" }
  }

  async deleteListContact(id: string): Promise<{ kind: "ok" } | GeneralApiProblem> {
    const token = await getClerkInstance().session?.getToken()
    this.apisauce.setHeader("authorization", `Bearer ${token}`)
    const response = await this.apisauce.delete(`${id}`)
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    return { kind: "ok" }
  }
}
export const listContactApi = new ListContactApi()
