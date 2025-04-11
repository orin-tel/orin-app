import { FC, useCallback, useMemo } from "react"
import { observer } from "mobx-react-lite"
import { Linking, TextStyle, View, ViewStyle } from "react-native"
import { CallLogStackScreenProps } from "@/navigators"
import { Button, Header, Icon, Screen, Text } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import { formatDate } from "@/utils/formatDate"
import { format } from "date-fns"
import { $styles, ThemedStyle } from "@/theme"
import { Divider } from "@/components/Divider"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "@/models"

export const CallScreen: FC<CallLogStackScreenProps<"Call">> = observer(
  function CallScreen(_props) {
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()

    // Pull in navigation via hook
    // const navigation = useNavigation()

    const {
      themed,
      theme: { colors },
    } = useAppTheme()
    const { callerName, fromPhoneNumber, createdAt, tags, summary } = _props.route.params

    const handleGoBack = () => {
      if (_props.navigation.canGoBack()) {
        _props.navigation.goBack()
      }
    }

    const CallStateColor = useMemo(
      () => ({
        CALLBACK: {
          icon: colors.success,
          border: colors.success,
          background: colors.successBackground,
          text: colors.success,
        },
        AI: {
          border: colors.info,
          background: colors.infoBackground,
          text: colors.info,
        },
        SPAM: {
          border: colors.error,
          background: colors.errorBackground,
          text: colors.error,
        },
      }),
      [colors],
    )

    const handleDial = useCallback(() => {
      if (!fromPhoneNumber) return
      Linking.openURL(`tel:${fromPhoneNumber}`)
    }, [fromPhoneNumber])
    return (
      <Screen style={$root} preset="scroll" safeAreaEdges={["top"]}>
        <View style={[$styles.row, themed($headerView)]}>
          <View>
            <Icon icon="arrowLeftCircle" onPress={handleGoBack} />
          </View>
          <View>
            <Text text={callerName ?? "Unknown"} />
            <Text preset="bold" size="xl" text={fromPhoneNumber} />
            <Text
              text={`${format(new Date(createdAt), "hh:mm aaaa").toLowerCase()}  -  ${format(new Date(createdAt), "MM/dd/yy")}`}
            />
          </View>
        </View>
        <View style={[$styles.row, themed($actionButtonContainer)]}>
          <Button
            style={themed($actionButtons)}
            LeftAccessory={() => <Icon icon="call" />}
            preset="outline"
            disabledStyle={themed($disabledStyle)}
            disabled={!!!fromPhoneNumber}
            onPress={handleDial}
          />
          <Button
            style={themed($actionButtons)}
            LeftAccessory={() => <Icon icon="message" />}
            preset="outline"
            disabledStyle={themed($disabledStyle)}
            disabled
          />
          <Button
            style={themed($actionButtons)}
            LeftAccessory={() => <Icon icon="email" />}
            preset="outline"
            disabledStyle={themed($disabledStyle)}
            disabled
          />
        </View>
        <Divider
          size={1}
          line={true}
          style={themed($dividerStyle)}
          lineStyle={themed($dividerLineStyle)}
        />
        <View style={themed($section)}>
          <Text tx="call:status" preset="subheading" />
          <View style={[$styles.row, themed($sectionContainer)]}>
            <Icon icon="received_call" color={colors.success} />
            <Text tx="call:connected" />
          </View>
        </View>
        <Divider
          size={1}
          line={true}
          style={themed($dividerStyle)}
          lineStyle={themed($dividerLineStyle)}
        />
        <View style={themed($section)}>
          <Text tx="call:tags" preset="subheading" />
          <View style={[$styles.row, themed($sectionContainer)]}>
            {(tags ?? []).length > 0 ? (
              tags?.map((tag, id) => (
                <View key={id}>
                  <View
                    style={themed([
                      {
                        backgroundColor:
                          CallStateColor[(tag as keyof typeof CallStateColor) ?? "AI"]
                            ?.background ?? colors.warningBackground,
                        borderColor:
                          CallStateColor[(tag as keyof typeof CallStateColor) ?? "AI"]?.border ??
                          colors.warningBackground,
                      },
                      $tagStyle,
                    ])}
                  >
                    <Text
                      text={(tags ?? []).length > 0 ? (tag?.toLocaleLowerCase() ?? "ai") : ""}
                      style={themed([
                        {
                          color:
                            CallStateColor[(tag as keyof typeof CallStateColor) ?? "AI"]?.text ??
                            colors.warning,
                        },
                        $tagTextStyle,
                      ])}
                    />
                  </View>
                </View>
              ))
            ) : (
              <Text tx="call:no_tags_found" />
            )}
          </View>
        </View>
        <Divider
          size={1}
          line={true}
          style={themed($dividerStyle)}
          lineStyle={themed($dividerLineStyle)}
        />
        <View style={themed($section)}>
          <Text tx="call:ai_summary" preset="subheading" />

          <View style={[$styles.row, themed($sectionContainer)]}>
            <Text text={summary ?? "No summary found"} />
          </View>
        </View>
        <Divider
          size={1}
          line={true}
          style={themed($dividerStyle)}
          lineStyle={themed($dividerLineStyle)}
        />
      </Screen>
    )
  },
)

const $headerView: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  gap: spacing.md,
  alignItems: "center",
  padding: spacing.sm,
  backgroundColor: colors.backgroundDim,
})

const $actionButtonContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.xxl,
  alignItems: "center",
  justifyContent: "center",
  padding: spacing.xl,
})

const $actionButtons: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  width: spacing.xxxl,
  height: spacing.xxxl,
  borderRadius: 100,
  padding: spacing.xxxl,
})

const $disabledStyle: ThemedStyle<ViewStyle> = () => ({
  opacity: 0.6,
})

const $dividerStyle: ThemedStyle<ViewStyle> = () => ({
  justifyContent: "center",
  alignItems: "center",
})

const $dividerLineStyle: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: "95%",
  opacity: 0.4,
  height: 1.5,
  borderRadius: 100,
  backgroundColor: colors.textDim,
})

const $section: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  padding: spacing.xl,
  paddingTop: spacing.sm,
})

const $tagStyle: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingLeft: spacing.xs,
  paddingRight: spacing.xs,
  // paddingBottom: spacing.xxs,
  borderRadius: spacing.xxxl,
  alignContent: "center",
  justifyContent: "center",
  alignItems: "center",
})

const $tagTextStyle: ThemedStyle<TextStyle> = () => ({
  textAlign: "center",
  textAlignVertical: "center",
})
const $sectionContainer: ThemedStyle<TextStyle> = ({ spacing }) => ({
  paddingTop: spacing.sm,
  gap: spacing.md,
  flexWrap: "wrap",
})

const $root: ViewStyle = {
  flex: 1,
}
