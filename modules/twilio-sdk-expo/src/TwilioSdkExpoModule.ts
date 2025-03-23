import { NativeModule, requireNativeModule } from "expo"

import { TwilioSdkExpoModuleEvents } from "./TwilioSdkExpo.types"

declare class TwilioSdkExpoModule extends NativeModule<TwilioSdkExpoModuleEvents> {
  PI: number
  hello(): string
  setValueAsync(value: string): Promise<void>
}

// This call loads the native module object from the JSI.
export default requireNativeModule<TwilioSdkExpoModule>("TwilioSdkExpo")
