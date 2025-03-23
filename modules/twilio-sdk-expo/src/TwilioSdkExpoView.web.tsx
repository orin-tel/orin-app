import * as React from "react"

import { TwilioSdkExpoViewProps } from "./TwilioSdkExpo.types"

export default function TwilioSdkExpoView(props: TwilioSdkExpoViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  )
}
