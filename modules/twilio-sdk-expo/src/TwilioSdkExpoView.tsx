import { requireNativeView } from "expo"
import * as React from "react"

import { TwilioSdkExpoViewProps } from "./TwilioSdkExpo.types"

const NativeView: React.ComponentType<TwilioSdkExpoViewProps> = requireNativeView("TwilioSdkExpo")

export default function TwilioSdkExpoView(props: TwilioSdkExpoViewProps) {
  return <NativeView {...props} />
}
