import { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { SettingStackScreenProps } from "@/navigators"
import { Icon, Screen, Text } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import { colors, spacing, ThemedStyle } from "@/theme"
import { useStores } from "@/models"
import { useAuth } from "@clerk/clerk-expo"

// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "@/models"

export const OverviewScreen: FC<SettingStackScreenProps<"Overview">> = observer(
  function OverviewScreen(_props) {
    const {
      userStore: { fetchUserDetails, userName, userPhoneNumber, userCountryPhoneCode },
    } = useStores()

    useEffect(() => {
      ;(async () => {
        try {
          await fetchUserDetails()
        } catch (err) {
          console.error("Error loading user details:", err)
        }
      })()
    }, [])

    const { signOut } = useAuth()
    const { navigation } = _props

    const gotoProfile = () => {
      navigation.navigate("Profile")
    }
    const gotoAgentConfig = () => {
      navigation.navigate("AgentConfig")
    }
    const gotoConnectCalls = () => {
      navigation.navigate("ConnectCalls")
    }
    const gotoWhitelistBlacklist = () => {
      navigation.navigate("WhitelistBlacklist")
    }

    const { themed } = useAppTheme()
    return (
      <Screen style={themed($contentContainer)} preset="scroll">
        <View style={themed($container)}>
          <TouchableOpacity style={themed($userHeader)} activeOpacity={0.8} onPress={gotoProfile}>
            <View style={themed($headerLeft)}>
              <View style={themed($pictureContainer)}>
                <View style={themed($profilePicture)}>
                  <Text
                    text={`${userName?.charAt(0).toUpperCase()}`}
                    size={"xl"}
                    style={themed($profilePictureText)}
                  />
                </View>
              </View>
              <View style={themed($nameNumber)}>
                {/* <Text text={`Sanando Chanda`} size="lg" weight="semiBold" /> */}
                <Text text={`${userName}`} size="lg" weight="semiBold" />
                <Text
                  text={userCountryPhoneCode + " " + userPhoneNumber}
                  size="sm"
                  weight="medium"
                />
                {/* <Text text={`${userPhoneNumber}`} size="sm" weight="medium" /> */}
              </View>
            </View>
            <View style={themed($headerIcon)}>
              <Icon icon="caretRight" />
            </View>
          </TouchableOpacity>
          <View style={themed($horizontalLine)} />
          <View style={themed($settingsNav)}>
            <TouchableOpacity activeOpacity={0.8} onPress={gotoAgentConfig} style={themed($item)}>
              <View style={themed($iconContainer)}>
                <Icon icon="person" size={spacing.md + spacing.xxs} />
              </View>
              <View style={themed($textContainer)}>
                <Text tx="overviewScreen:agent_config" size="sm" weight="semiBold" />
                <Text tx="overviewScreen:agent_config_desc" size="xs" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} onPress={gotoConnectCalls} style={themed($item)}>
              <View style={themed($iconContainer)}>
                <Icon icon="phoneOutgoing" />
              </View>
              <View style={themed($textContainer)}>
                <Text tx="overviewScreen:connect_calls" size="sm" weight="semiBold" />
                <Text tx="overviewScreen:connect_calls_desc" size="xs" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={gotoWhitelistBlacklist}
              style={themed($item)}
            >
              <View style={themed($iconContainer)}>
                <Icon icon="block" />
              </View>
              <View style={themed($textContainer)}>
                <Text tx="overviewScreen:whitelist_blacklist" size="sm" weight="semiBold" />
                <Text tx="overviewScreen:whitelist_blacklist_desc" size="xs" />
              </View>
            </TouchableOpacity>
            <View style={themed($item)}>
              <View style={themed($iconContainer)}>
                <Icon icon="calendar" />
              </View>
              <View style={themed($textContainer)}>
                <Text tx="overviewScreen:calendar_settings" size="sm" weight="semiBold" />
                <Text tx="overviewScreen:calendar_settings_desc" size="xs" />
              </View>
            </View>
            <TouchableOpacity
              style={themed($item)}
              onPress={() => {
                console.log("THIS CRAZY")
                signOut()
              }}
            >
              <View style={themed($iconContainer)}>
                <Icon icon="calendar" />
              </View>
              <View style={themed($textContainer)}>
                <Text tx="overviewScreen:contact_orin" size="sm" weight="semiBold" />
                <Text tx="overviewScreen:contact_orin_desc" size="xs" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Screen>
    )
  },
)

const $contentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.md,
})
const $container: ThemedStyle<ViewStyle> = () => ({})
const $horizontalLine: ThemedStyle<ViewStyle> = ({ colors }) => ({
  paddingVertical: 15,
  borderBottomColor: colors.defaultPrimary,
  borderBottomWidth: 0.5,
})
const $userHeader: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
})
const $headerLeft: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  gap: 25,
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
  paddingTop: 4,
})

const $nameNumber: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.xxs,
})
const $headerIcon: ThemedStyle<ViewStyle> = () => ({
  paddingTop: 4,
})
const $settingsNav: ThemedStyle<ViewStyle> = () => ({
  paddingTop: spacing.xs,
})
const $textContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.xs,
})

const $iconContainer: ThemedStyle<ViewStyle> = () => ({
  paddingTop: 4,
  width: 24,
  alignItems: "center",
})
const $item: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: 12,
  flexDirection: "row",
  alignItems: "center",
  gap: spacing.md + spacing.xxs,
})
