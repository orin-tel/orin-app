import { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, View, ViewStyle } from "react-native"
import { SettingStackScreenProps } from "@/navigators"
import { Button, Icon, Screen, Text, TextField } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import { colors, spacing, ThemedStyle } from "@/theme"
import { useStores } from "@/models"

// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "@/models"

export const ProfileScreen: FC<SettingStackScreenProps<"Profile">> = observer(
  function ProfileScreen(_props) {
    const {
      userStore: {
        userName,
        userAbout,
        userPhoneNumber,
        setUserName,
        setUserAbout,
      },
    } = useStores()

    const [editedName, setEditedName] = useState(userName);
    const [editedInfo, setEditedInfo] = useState(userAbout);

    const updateChanges = () => {
      setUserName(editedName);
      setUserAbout(editedInfo);
    }

    const { themed } = useAppTheme()
    return (
      <Screen style={themed($contentContainer)} preset="scroll">
        <View style={themed($container)}>
          <View style={themed($userHeader)}>
            <View style={themed($headerInterior)}>
              <View style={themed($pictureContainer)}>
                <View style={themed($profilePicture)}>
                  <Text text={`${userName?.charAt(0).toUpperCase()}`} size={"xl"} style={themed($profilePictureText)} />
                </View>
              </View>
              <View style={themed($nameNumber)}>
                {/* <Text text={`Sanando Chanda`} size="lg" weight="semiBold" /> */}
                <Text text={`${userName}`} size="lg" weight="semiBold" />
                <Text text={`+91 7679384799`} size="sm" weight="medium" />
                {/* <Text text={`${userPhoneNumber}`} size="sm" weight="medium" /> */}
              </View>
            </View>
          </View>
          <View style={themed($userDetails)}>
            <View>
              {/**User Name */}
              <Text tx="settingsProfileScreen:label_one" style={themed($label)}
                weight="medium" />
              <TextField
                inputWrapperStyle={themed($nameInputBox)}
                // placeholderTx={"onboardingAboutScreen:example_name"}
                placeholder={`${userName}`}
                // placeholder={`${editedName}`}
                onChangeText={setEditedName}
              />
            </View>
            <View>
              <Text tx="settingsProfileScreen:label_two" style={themed($label)}
                weight="medium" />
              <View style={themed($phoneNumberContainer)}>
                <Text style={themed($phoneNumber)} text="+91 7679384799" size="md" />
                {/* <Text style={themed($phoneNumber)} text={`${userPhoneNumber}`} size="md" /> */}
              </View>
            </View>
            <View>
              {/**User About */}
              <Text tx="onboardingAboutScreen:label_two" style={themed($label)}
                weight="medium" />
              <TextField
                multiline
                inputWrapperStyle={themed($infoInputWrapper)}
                style={themed($infoInput)}
                // placeholderTx="onboardingAboutScreen:example_info"
                placeholder={`${userAbout}`}
                // placeholder={`${editedInfo}`}
                onChangeText={setEditedInfo}
              />
            </View>
          </View>
          <Button tx="settingsProfileScreen:save"
            style={themed($saveBtn)}
            textStyle={themed($saveBtnText)}
            LeftAccessory={(props) => <Icon icon="saveInverted" />}
            onPress={updateChanges} />
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
const $container: ThemedStyle<ViewStyle> = () => ({

})

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
  alignItems: "center"
})

const $userDetails: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  backgroundColor: colors.inputBackground,
  // alignItems: "center",
  borderRadius: 20,
  padding: spacing.md,
  paddingTop: 0,

})
const $label: ThemedStyle<TextStyle> = ({ spacing }) => ({
  gap: spacing.xxs,
  paddingBottom: spacing.sm - spacing.xxxs,
  paddingTop: spacing.sm,

})
const $phoneNumberContainer: ThemedStyle<TextStyle> = ({ spacing, typography }) => ({
  width: 321,
  backgroundColor: colors.inputBackground,
  borderWidth: 0.5,
  borderRadius: 100,
  borderColor: colors.textPlaceholder,
  overflow: "hidden",
  fontFamily: typography.primary.normal,
  color: colors.text,
  fontSize: 16,
  height: spacing.xxl + spacing.xxs,
  textAlignVertical: "center",
  alignSelf: "center",
  justifyContent: "center",
  paddingLeft: spacing.md
})
const $phoneNumber: ThemedStyle<TextStyle> = ({ spacing }) => ({

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
  marginTop: spacing.lg,
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
  paddingLeft: spacing.sm
})


