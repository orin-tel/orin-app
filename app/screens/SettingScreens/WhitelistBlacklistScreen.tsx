import { FC } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, View, ViewStyle } from "react-native"
import { SettingStackScreenProps } from "@/navigators"
import { Button, Icon, Screen, Text } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import { ThemedStyle } from "@/theme"


export const WhitelistBlacklistScreen: FC<SettingStackScreenProps<"WhitelistBlacklist">> = observer(
  function WhitelistBlacklistScreen(_props) {

    const { navigation } = _props;

    const gotoWhitelist = () => {
      navigation.navigate("Whitelist");
    }
    const gotoBlacklist = () => {
      navigation.navigate("Whitelist");
    }

    const { themed } = useAppTheme();
    return (
      <Screen style={themed($contentContainer)} preset="scroll">
        <View style={themed($container)}>
          <View style={themed($connectSection)}>
            <Button
              style={themed($connectBtn)}
              textStyle={themed($connectBtnText)}
              tx="whitelistBlacklistScreen:connect_google"
              LeftAccessory={(props) => (
                <Icon icon="google" size={20} containerStyle={props.style} />
              )} />
            <Button
              style={themed($connectBtn)}
              textStyle={themed($connectBtnText)}
              tx="whitelistBlacklistScreen:connect_apple"
              LeftAccessory={(props) => (
                <Icon icon="apple" size={20} containerStyle={props.style} />
              )} />
            <Text style={themed($or)} tx="whitelistBlacklistScreen:or" weight="bold" />
          </View>
          <View style={themed($manualSection)}>
            <Text tx="whitelistBlacklistScreen:add_manually" size="sm" weight="semiBold" />
            <Text tx="whitelistBlacklistScreen:add_manually_desc" size="xs" weight="normal" />
            <View style={themed($horizontalLine)} />
            <Button
              onPress={gotoWhitelist}
              style={themed($manualBtn1)}
              tx="whitelistBlacklistScreen:whitelist_numbers"
              textStyle={themed($manualBtnText)}
              RightAccessory={(props) => (
                <Icon icon="caretRight" style={props.style} />
              )} />
            <Button
              onPress={gotoBlacklist}
              style={themed($manualBtn2)}
              tx="whitelistBlacklistScreen:blacklist_numbers"
              textStyle={themed($manualBtnText)}
              RightAccessory={(props) => (
                <Icon icon="caretRight" style={props.style} />
              )} />
          </View>
        </View>
      </Screen>
    );
  })

const $contentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  padding: spacing.md,
})

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingBottom: spacing.md + spacing.xxs,

})
const $connectSection: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.md,
  paddingBottom: spacing.sm,

})
const $or: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignSelf: "center",

})
const $connectBtn: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  backgroundColor: colors.background,
  borderColor: colors.defaultPrimary,
  borderWidth: 2,
  height: 48,
})
const $connectBtnText: ThemedStyle<TextStyle> = ({ spacing, colors, typography }) => ({
  color: colors.defaultPrimary,
  paddingLeft: spacing.sm,
  alignSelf: "center",
})


const $manualSection: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.inputBackground,
  padding: spacing.sm,
  gap: spacing.xs,
  borderRadius: 20,
})

const $horizontalLine: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  paddingTop: spacing.xs,
  borderBottomColor: colors.defaultPrimary,
  borderBottomWidth: 0.5,
})

const $manualBtn1: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.infoBackground,
  height: 48,
  marginTop: spacing.xs,
  justifyContent: "space-between",
  paddingHorizontal: spacing.md,
})
const $manualBtn2: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.errorBackground,
  height: 48,
  marginTop: spacing.xs,
  justifyContent: "space-between",
  paddingHorizontal: spacing.md,
})
const $manualBtnText: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.text,

})
