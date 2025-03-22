import { FC } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { SettingStackScreenProps } from "@/navigators"
import { Icon, Screen, Text } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import { spacing, ThemedStyle } from "@/theme"
import { useStores } from "@/models"

// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "@/models"

export const OverviewScreen: FC<SettingStackScreenProps<"Overview">> = observer(
  function OverviewScreen() {
    const {
      userStore: {
        userName,
      },
    } = useStores()
    const { themed } = useAppTheme()
    return (
      <Screen style={themed($contentContainer)} preset="scroll">
        <View style={themed($container)}>
          <View style={themed($userHeader)}>
            <View style={themed($headerLeft)}>
              <View style={themed($pictureContainer)}>
                <View style={themed($profilePicture)}>

                </View>
              </View>
              <View style={themed($nameNumber)}>
                {/* <Text text={`${userName}`}/> */}
                <Text text={`Sanando Chanda`} size="lg" weight="semiBold" />
                <Text text={`+91 7679384799`} size="sm" weight="normal" />
              </View>
            </View>
            <View style={themed($headerIcon)}>
              <Icon icon="caretRight" />
            </View>
          </View>
          <View style={themed($horizontalLine)} />
          <View style={themed($settingsNav)}>
            <View style={themed($item)}>
              <Icon icon="person" />
              <View>
                <Text tx="overviewScreen:agent_config" />
                <Text tx="overviewScreen:agent_config_desc" />
              </View>
            </View>
            <View style={themed($item)}>
              <Icon icon="person" />
              <View>
                <Text tx="overviewScreen:agent_config" />
                <Text tx="overviewScreen:agent_config_desc" />
              </View>
            </View>
            <View style={themed($item)}>
              <Icon icon="person" />
              <View>
                <Text tx="overviewScreen:agent_config" />
                <Text tx="overviewScreen:agent_config_desc" />
              </View>
            </View>
            <View style={themed($item)}>
              <Icon icon="person" />
              <View>
                <Text tx="overviewScreen:agent_config" />
                <Text tx="overviewScreen:agent_config_desc" />
              </View>
            </View>
            <View style={themed($item)}>
              <Icon icon="person" />
              <View>
                <Text tx="overviewScreen:agent_config" />
                <Text tx="overviewScreen:agent_config_desc" />
              </View>
            </View>
          </View>
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
})
const $pictureContainer: ThemedStyle<ViewStyle> = ({ colors }) => ({
  paddingTop: 4,
})

const $nameNumber: ThemedStyle<ViewStyle> = () => ({
  gap: 4,
})
const $headerIcon: ThemedStyle<ViewStyle> = () => ({
  paddingTop: 4,

})
const $settingsNav: ThemedStyle<ViewStyle> = () => ({

})
const $item: ThemedStyle<ViewStyle> = () => ({
  padding:12,
  flexDirection: "row",
  alignItems: "center"
})
