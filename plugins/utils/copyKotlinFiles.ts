import * as fs from "fs"
import * as path from "path"

export const copyKotlinFiles = (sourcePath: string, targetPath: string): void => {
  if (!fs.existsSync(sourcePath)) {
    throw new Error("The source path not exist.")
  }

  if (!fs.lstatSync(sourcePath).isDirectory())
    throw new Error("The source path is not a directory.")

  const files = fs.readdirSync(sourcePath)

  files.forEach((file) => {
    console.log("Copying: ", file)
    copyFileSync(path.join(sourcePath, file), targetPath)
    console.log(" - File copied")
  })
}

const copyFileSync = (filePath: string, targetPath: string) => {
  let targetFile = targetPath

  if (fs.existsSync(targetPath) && fs.lstatSync(targetPath).isDirectory()) {
    targetFile = path.join(targetPath, path.basename(filePath))
  }

  fs.writeFileSync(targetFile, fs.readFileSync(filePath))
}
