import { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, View, ViewStyle } from "react-native"
import { SettingStackScreenProps } from "@/navigators"
import { Button, Icon, PhoneTextField, Screen, Text, TextField } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import { colors, spacing, ThemedStyle } from "@/theme"
import { useStores } from "@/models"

export const ProfileScreen: FC<SettingStackScreenProps<"Profile">> = observer(
  function ProfileScreen(_props) {
    const { userStore } = useStores()

    const [editedName, setEditedName] = useState(userStore.userName ?? "")
    const [editedInfo, setEditedInfo] = useState(userStore.userAbout ?? "")
    const [editedPhoneNumber, setEditedPhoneNumber] = useState(userStore.userPhoneNumber ?? "")
    const [editedPhoneNumberCode, setEditedPhoneNumberCode] = useState(
      userStore.userCountryPhoneCode ?? "",
    )

    const updateChanges = async () => {
      if (
        editedName.trim().length > 0 &&
        editedInfo.trim().length > 0 &&
        (editedName.trim() !== (userStore.userName ?? "").trim() ||
          editedInfo.trim() !== (userStore.userAbout ?? "").trim())
      ) {
        const success = await userStore.updateUserProfile(editedName.trim(), editedInfo.trim())
        if (success) {
          console.log("Profile updated successfully")
        }
      }
    }

    const { themed } = useAppTheme()
    return (
      <Screen style={themed($contentContainer)} preset="scroll">
        <View style={themed($container)}>
          <View style={themed($userHeader)}>
            <View style={themed($headerInterior)}>
              <View style={themed($pictureContainer)}>
                <View style={themed($profilePicture)}>
                  <Text
                    text={`${userStore.userName?.charAt(0).toUpperCase()}`}
                    size={"xl"}
                    style={themed($profilePictureText)}
                  />
                </View>
              </View>
              <Text text={userStore.userName ?? ""} />
              <Text
                text={(
                  (userStore.userCountryPhoneCode ?? "") +
                  " " +
                  (userStore.userPhoneNumber ?? "")
                )?.trim()}
              />
            </View>
          </View>
          <View style={themed($userDetails)}>
            <View>
              {/**User Name */}
              <Text tx="settingsProfileScreen:label_one" style={themed($label)} weight="medium" />
              <TextField
                inputWrapperStyle={themed($nameInputBox)}
                placeholderTx={"onboardingAboutScreen:example_name"}
                value={editedName ?? ""}
                // placeholder={`${editedName}`}
                onChangeText={setEditedName}
              />
            </View>
            <View>
              <Text tx="settingsProfileScreen:label_two" style={themed($label)} weight="medium" />
              <View style={themed($phoneNumberContainer)}>
                {/* <Text style={themed($phoneNumber)} text="+91 7679384799" size="md" /> */}
                <PhoneTextField
                  countryPhoneCode={editedPhoneNumberCode}
                  setCountryPhoneCode={setEditedPhoneNumberCode}
                  value={editedPhoneNumber}
                  setValue={() => {}}
                  inputWrapperStyle={themed($phoneNumber)}
                />
              </View>
            </View>
            <View>
              {/**User About */}
              <Text tx="onboardingAboutScreen:label_two" style={themed($label)} weight="medium" />
              <TextField
                multiline
                inputWrapperStyle={themed($infoInputWrapper)}
                style={themed($infoInput)}
                placeholderTx="onboardingAboutScreen:example_info"
                value={editedInfo ?? ""}
                // placeholder={`${editedInfo}`}
                onChangeText={setEditedInfo}
              />
            </View>
          </View>
          <Button
            tx="settingsProfileScreen:save"
            style={themed($saveBtn)}
            textStyle={themed($saveBtnText)}
            LeftAccessory={(props) => <Icon icon="saveInverted" />}
            onPress={updateChanges}
          />
        </View>
      </Screen>
    )
  },
)

const $root: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.background,
})

const $contentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.md,
})
const $container: ThemedStyle<ViewStyle> = () => ({})

const $userHeader: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingTop: spacing.md,
  paddingBottom: spacing.md + spacing.md,
  flexDirection: "column",
  alignItems: "center",
})
const $headerInterior: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "column",
  gap: spacing.xxs,
  alignItems: "center",
  width: "auto",
  flex: 1,
})
const $profilePicture: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 42,
  height: 42,
  borderRadius: 100,
  backgroundColor: colors.defaultPrimary,
  alignItems: "center",
  justifyContent: "center",
})
const $profilePictureText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.background,
  paddingBottom: 3,
})
const $pictureContainer: ThemedStyle<ViewStyle> = ({ colors }) => ({
  // paddingTop: 4,
})

const $nameNumber: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.xxs,
  alignItems: "center",
})

const $userDetails: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  backgroundColor: colors.inputBackground,
  // alignItems: "center",
  borderRadius: 20,
  padding: spacing.md,
  paddingTop: 0,
  marginTop: spacing.sm,
})
const $label: ThemedStyle<TextStyle> = ({ spacing }) => ({
  gap: spacing.xxs,
  paddingBottom: spacing.sm - spacing.xxxs,
  paddingTop: spacing.sm,
})
const $phoneNumberContainer: ThemedStyle<TextStyle> = ({ spacing, typography }) => ({})
const $phoneNumber: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background,
})

const $nameInputBox: ThemedStyle<TextStyle> = ({ colors }) => ({
  width: 321,
  backgroundColor: colors.background,
  alignSelf: "center",
  paddingLeft: spacing.xxs,
})
const $infoInputWrapper: ThemedStyle<TextStyle> = ({ colors }) => ({
  width: 345,
  minHeight: 140,
  borderRadius: 12,
  flexWrap: "wrap",
  textAlignVertical: "top",
  alignSelf: "center",
})
const $infoInput: ThemedStyle<TextStyle> = ({ colors }) => ({
  minHeight: 140,
  borderRadius: 12,
  flexWrap: "wrap",
  textAlignVertical: "top",
  backgroundColor: colors.background,
  padding: spacing.sm,
})
const $saveBtn: ThemedStyle<TextStyle> = ({ colors }) => ({
  width: 120,
  alignSelf: "center",
  marginTop: spacing.md,
  marginBottom: spacing.lg,
  backgroundColor: colors.background,
  borderColor: colors.defaultPrimary,
  borderWidth: 2,
  shadowColor: colors.shadowPrimary,
  shadowOpacity: 0.1,
  shadowRadius: 12,
  elevation: 4,
})
const $saveBtnText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.defaultPrimary,
  paddingLeft: spacing.sm,
})
