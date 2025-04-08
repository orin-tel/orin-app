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
import { IUser } from "./types"
import { getClerkInstance } from "@clerk/clerk-expo"

/**
 * Configuring the apisauce instance.
 */
export const USER_API_CONFIG: ApiConfig = {
  url: Config.API_BASE_URL + "/user",
  timeout: 10000,
}

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class UserApi {
  apisauce: ApisauceInstance
  config: ApiConfig

  /**
   * Set up our API instance. Keep this lightweight!
   */
  constructor(config: ApiConfig = USER_API_CONFIG) {
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
   * signIn user
   */
  async signInUser(): Promise<{ kind: "ok"; user: IUser } | GeneralApiProblem> {
    const token = await getClerkInstance().session?.getToken()
    this.apisauce.setHeader("authorization", `Bearer ${token}`)
    const response: ApiResponse<NestResponse<IUser>> = await this.apisauce.get(`/sign-in`)

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
        user: data?.data,
      }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }

  async requestOtp(phone_number_e164: string): Promise<{ kind: "ok" } | GeneralApiProblem> {
    const token = await getClerkInstance().session?.getToken()
    this.apisauce.setHeader("authorization", `Bearer ${token}`)
    const response: ApiResponse<NestResponse<string>> = await this.apisauce.post(`/request-otp`, {
      phone_number_e164,
    })

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
      }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }

  async verifyOtp(
    otp: string,
    phone_number_e164: string,
  ): Promise<{ kind: "ok"; user: IUser } | GeneralApiProblem> {
    const token = await getClerkInstance().session?.getToken()
    this.apisauce.setHeader("authorization", `Bearer ${token}`)
    const response: ApiResponse<NestResponse<IUser>> = await this.apisauce.post(`/verify-otp`, {
      otp,
      phone_number_e164,
    })

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
        user: data?.data,
      }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }

  async completeOnboarding(user: IUser): Promise<{ kind: "ok"; user: IUser } | GeneralApiProblem> {
    const token = await getClerkInstance().session?.getToken()
    this.apisauce.setHeader("authorization", `Bearer ${token}`)
    const response: ApiResponse<NestResponse<IUser>> = await this.apisauce.post(
      `/complete-onboarding`,
      {
        ...user,
      },
    )

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
        user: data?.data,
      }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }

  async registerDevice(device_token: string): Promise<{ kind: "ok" } | GeneralApiProblem> {
    const token = await getClerkInstance().session?.getToken()
    this.apisauce.setHeader("authorization", `Bearer ${token}`)
    const response: ApiResponse<NestResponse<string>> = await this.apisauce.post(
      "/register-device",
      {
        device_token,
      },
    )
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
export const userApi = new UserApi()
