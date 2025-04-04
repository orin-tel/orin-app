/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://docs.infinite.red/ignite-cli/boilerplate/app/services/#backend-api-integration)
 * documentation for more details.
 */
import { ApiResponse, ApisauceInstance, create } from "apisauce"
import Config from "../../../config"
import { GeneralApiProblem, getGeneralApiProblem } from "../apiProblem"
import type { ApiConfig, NestResponse } from "../api.types"
import { getClerkInstance } from "@clerk/clerk-expo"

/**
 * Configuring the apisauce instance.
 */
export const CALLS_API_CONFIG: ApiConfig = {
  url: Config.API_BASE_URL + "/calls",
  timeout: 10000,
}

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class TelephonyApi {
  apisauce: ApisauceInstance
  config: ApiConfig

  /**
   * Set up our API instance. Keep this lightweight!
   */
  constructor(config: ApiConfig = CALLS_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
  }

  /**
   * getTelephony registration token
   */
  async getTelephonyToken(): Promise<{ kind: "ok"; token: string } | GeneralApiProblem> {
    const token = await getClerkInstance().session?.getToken()
    this.apisauce.setHeader("authorization", `Bearer ${token}`)
    const response: ApiResponse<NestResponse<string>> = await this.apisauce.get(`/telephony-token`)

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    try {
      const data = response.data
      if (!data) {
        throw new Error("data not available")
      }
      return {
        kind: "ok",
        token: data?.data,
      }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }
}

// Singleton instance of the API for convenience
export const telephonyApi = new TelephonyApi()
