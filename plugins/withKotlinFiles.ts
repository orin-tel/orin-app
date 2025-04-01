import { ConfigPlugin, withAndroidManifest } from "@expo/config-plugins"
import * as path from "path"
import { copyKotlinFiles } from "./utils"

export const withKotlinFiles: ConfigPlugin = (config) => {
  return withAndroidManifest(config, (config) => {
    const modifiedKotlinFilesPath = "kotlinModifiedFiles"

    const bundleIdentifierPath = config.modRawConfig.android?.package?.replaceAll(".", "/")
    const androidRootPath = config.modRequest.platformProjectRoot
    const androidTargetPath = path.join(
      androidRootPath,
      `app/src/main/java/${bundleIdentifierPath}/`,
    )

    copyKotlinFiles(modifiedKotlinFilesPath, androidTargetPath)

    return config
  })
}
