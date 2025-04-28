import { ConfigPlugin, withAndroidManifest } from "@expo/config-plugins"

export const withLockedScreenActivity: ConfigPlugin = (config) => {
  return withAndroidManifest(config, (modConfig) => {
    const manifest = modConfig.modResults.manifest

    // ✅ Add <uses-permission android:name="android.permission.USE_FULL_SCREEN_INTENT" />
    const existingPermissions = manifest["uses-permission"] ?? []
    const hasPermission = existingPermissions.some(
      (item: any) => item.$["android:name"] === "android.permission.USE_FULL_SCREEN_INTENT",
    )

    if (!hasPermission) {
      manifest["uses-permission"] = [
        ...existingPermissions,
        {
          $: {
            "android:name": "android.permission.USE_FULL_SCREEN_INTENT",
          },
        },
      ]
    }

    // ✅ Modify MainActivity attributes
    const application = manifest.application?.[0]
    if (!application || !application.activity) {
      throw new Error("No <application> or <activity> tag found in AndroidManifest.xml")
    }

    const mainActivity = application.activity.find(
      (activity: any) => activity.$["android:name"] === ".MainActivity",
    )

    if (mainActivity) {
      mainActivity.$["android:showWhenLocked"] = "true"
      mainActivity.$["android:turnScreenOn"] = "true"
    } else {
      throw new Error("MainActivity not found in AndroidManifest.xml")
    }

    return modConfig
  })
}
