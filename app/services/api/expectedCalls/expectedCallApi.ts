import { ApiResponse, ApisauceInstance, create } from "apisauce"
import Config from "../../../config"
import { GeneralApiProblem, getGeneralApiProblem } from "../apiProblem"
import type { ApiConfig, NestResponse } from "../api.types"

import { getClerkInstance } from "@clerk/clerk-expo"
import { IExpectedCall } from "./types"
import { ExpectedCallSnapshotIn } from "@/models/ExpectedCallModel"

/**
 * Configuring the apisauce instance.
 */
export const EXPECTED_CALL_API_CONFIG: ApiConfig = {
  url: Config.API_BASE_URL + "/expecting-call",
  timeout: 10000,
}

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class ExpectedCallApi {
  apisauce: ApisauceInstance
  config: ApiConfig

  /**
   * Set up our API instance. Keep this lightweight!
   */
  constructor(config: ApiConfig = EXPECTED_CALL_API_CONFIG) {
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

  async getExpectedCalls(): Promise<{ kind: "ok"; calls: IExpectedCall[] } | GeneralApiProblem> {
    const token = await getClerkInstance().session?.getToken()
    this.apisauce.setHeader("authorization", `Bearer ${token}`)

    const response: ApiResponse<NestResponse<IExpectedCall[]>> = await this.apisauce.get("")

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    return { kind: "ok", calls: response.data?.data ?? [] }
  }

  async createExpectedCall(callData: {
    caller_name: string
    caller_reason: string
  }): Promise<{ kind: "ok"; call: ExpectedCallSnapshotIn } | GeneralApiProblem> {
    const token = await getClerkInstance().session?.getToken()
    this.apisauce.setHeader("authorization", `Bearer ${token}`)

    const response: ApiResponse<NestResponse<IExpectedCall>> = await this.apisauce.post(
      "",
      callData,
    )

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    const data = response.data
    if (!data) throw new Error("data not available")
    const snapshotIn: ExpectedCallSnapshotIn = {
      id: data.data.id,
      caller_name: data.data.caller_name,
      caller_reason: data.data.caller_reason,
    }
    return { kind: "ok", call: snapshotIn }
  }

  async updateExpectedCall(
    id: string,
    data: {
      caller_name: string
      caller_reason: string
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

  async deleteExpectedCall(id: string): Promise<{ kind: "ok" } | GeneralApiProblem> {
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
export const expectedCallApi = new ExpectedCallApi()
