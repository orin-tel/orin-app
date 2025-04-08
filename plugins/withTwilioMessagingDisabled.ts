import { ConfigPlugin, withDangerousMod } from "@expo/config-plugins"
import fs from "fs"
import path from "path"

const CONFIG_XML_FILENAME = "config.xml"
const CONFIG_XML_CONTENT = `
<resources>
    <bool name="twiliovoicereactnative_firebasemessagingservice_enabled">false</bool>
</resources>
`

export const withTwilioMessagingDisabled: ConfigPlugin = (config) => {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const projectRoot = config.modRequest.projectRoot
      const valuesDir = path.join(projectRoot, "android", "app", "src", "main", "res", "values")

      // Ensure the values directory exists
      if (!fs.existsSync(valuesDir)) {
        fs.mkdirSync(valuesDir, { recursive: true })
      }

      const configXmlPath = path.join(valuesDir, CONFIG_XML_FILENAME)

      // Write the XML file
      fs.writeFileSync(configXmlPath, CONFIG_XML_CONTENT.trim())
      console.log(`✅ Wrote ${CONFIG_XML_FILENAME} to disable Twilio FCM service.`)

      return config
    },
  ])
}
