import { registerWebModule, NativeModule } from "expo"

import { ChangeEventPayload } from "./TwilioSdkExpo.types"

type TwilioSdkExpoModuleEvents = {
  onChange: (params: ChangeEventPayload) => void
}

class TwilioSdkExpoModule extends NativeModule<TwilioSdkExpoModuleEvents> {
  PI = Math.PI
  async setValueAsync(value: string): Promise<void> {
    this.emit("onChange", { value })
  }
  hello() {
    return "Hello world! 👋"
  }
}

export default registerWebModule(TwilioSdkExpoModule)
