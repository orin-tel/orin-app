import { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { ImageStyle, TextStyle, View, ViewStyle } from "react-native"
import { SettingStackScreenProps } from "@/navigators"
import { Button, Icon, Screen, Text, TextField } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import { spacing, ThemedStyle } from "@/theme"


export const WhitelistScreen: FC<SettingStackScreenProps<"Whitelist">> = observer(
  function WhitelistScreen(_props) {

    const [searchQuery, setSearchQuery] = useState("");

    const { themed } = useAppTheme();
    return (
      <Screen style={themed($contentContainer)} preset="scroll">
        <View style={themed($container)}>
          <View style={themed($searchSection)}>
            <TextField
              style={themed($searchBox)}
              inputWrapperStyle={themed($searchBoxWrapper)}
              placeholderTx="whitelistScreen:search"
              value={searchQuery}
              onChangeText={setSearchQuery}
              LeftAccessory={() => (
                <Icon icon="search" style={{ marginLeft: spacing.md }} />
              )} />
          </View>
        </View>
        <View style={themed($btnView)}>
          <Button
            style={themed($addBtn)}
            textStyle={themed($addBtnText)}
            tx="expectingCallsScreen:add"
            LeftAccessory={(props) => (
              <Icon icon="plusCircle" size={20} containerStyle={props.style} />
            )} />
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
const $searchSection: ThemedStyle<ViewStyle> = ({ spacing }) => ({

})
const $searchBox: ThemedStyle<TextStyle> = ({ spacing }) => ({
  paddingLeft: spacing.xs,
})
const $searchBoxWrapper: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  height: 48,
})
const $addBtn: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  width: 106,
  height: 48,
  alignSelf: "center",
  backgroundColor: colors.background,
  borderColor: colors.defaultPrimary,
  borderWidth: 2,
  shadowColor: colors.shadowPrimary,
  shadowOpacity: 0.1,
  shadowRadius: 12,
  elevation: 4,
})

const $addBtnText: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  color: colors.defaultPrimary,
  paddingLeft: spacing.sm
})
const $btnView: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({

})




