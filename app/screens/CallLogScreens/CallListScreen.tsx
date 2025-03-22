import { FC, useMemo, useState } from "react"
import { observer } from "mobx-react-lite"
import { ActivityIndicator, ImageStyle, TextStyle, View, ViewStyle } from "react-native"
import { CallLogStackScreenProps } from "@/navigators"
import { Card, EmptyState, Icon, ListView, Screen, Text } from "@/components"
import { callLogFixture } from "@/fixtures/call-logs.fixtures"
import { CallLog } from "@/types"
import { useAppTheme } from "@/utils/useAppTheme"
import { $styles, ThemedStyle } from "@/theme"
import { isRTL } from "@/i18n"
import { ContentStyle } from "@shopify/flash-list"
import { format, isToday, isYesterday, parseISO } from "date-fns"
import { formatMilliseconds } from "@/utils/formatMiliseconds"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "@/models"

export const CallListScreen: FC<CallLogStackScreenProps<"CallList">> = observer(
  function CallListScreen() {
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()

    // Pull in navigation via hook
    // const navigation = useNavigation()

    // get data for fixture, this is only for DEV
    const call_logs = callLogFixture
    const { themed } = useAppTheme()
    const [refreshing, setRefreshing] = useState(false)
    const [isLoading, _setIsLoading] = useState(false)

    async function manualRefresh() {
      setRefreshing(true)
      // Data fetching
      setRefreshing(false)
    }

    return (
      <Screen style={$root} preset="scroll">
        <ListView<CallLog>
          data={call_logs}
          contentContainerStyle={themed([$listContentContainer])}
          refreshing={refreshing}
          onRefresh={manualRefresh}
          keyExtractor={(item) => item.call_id}
          estimatedItemSize={24}
          ListEmptyComponent={
            isLoading ? (
              <ActivityIndicator />
            ) : (
              <EmptyState
                preset="generic"
                style={themed($emptyState)}
                headingTx={"call_list:empty_state_title"}
                contentTx={"call_list:empty_state_content"}
                buttonOnPress={manualRefresh}
                imageStyle={$emptyStateImage}
                ImageProps={{ resizeMode: "contain" }}
              />
            )
          }
          // renderItem={({ item }) => <CallCard callLog={item} />}
          renderItem={({ item, index }) => {
            const previousItem = index > 0 ? call_logs[index - 1] : null
            const currentDateLabel = formatDate(item.datetime)
            const previousDateLabel = previousItem ? formatDate(previousItem.datetime) : null
            const showDivider = currentDateLabel !== previousDateLabel

            return (
              <>
                {showDivider && (
                  <View style={$styles.row}>
                    <Text style={themed($dividerTextStyle)}>{currentDateLabel}</Text>
                    <View style={themed($dividerStyle)}></View>
                  </View>
                )}
                <CallCard callLog={item} />
              </>
            )
          }}
        />
      </Screen>
    )
  },
)

const formatDate = (datetime: string) => {
  const date = parseISO(datetime)
  if (isToday(date)) return "Today"
  if (isYesterday(date)) return "Yesterday"
  return format(date, "dd MMMM") // Example: 15 March
}

const CallCard = observer(function CallCard({ callLog }: { callLog: CallLog }) {
  const {
    theme: { colors },
    themed,
  } = useAppTheme()

  const CallStateColor = useMemo(
    () => ({
      callback: {
        icon: colors.success,
        border: colors.success,
        background: colors.successBackground,
        text: colors.success,
      },
      ai: {
        border: colors.info,
        background: colors.infoBackground,
        text: colors.info,
      },
      spam: {
        border: colors.error,
        background: colors.errorBackground,
        text: colors.error,
      },
    }),
    [colors],
  )

  const CallIconColor = useMemo(
    () => ({
      incoming_call: colors.warning,
      received_call: colors.success,
      outgoing_call: colors.info,
      missed_call: colors.error,
    }),
    [colors],
  )

  return (
    <Card
      preset="paper"
      heading={callLog.caller_first_name}
      LeftComponent={
        <View style={themed($leftComponent)}>
          <Icon icon={callLog.call_type} color={CallIconColor[callLog.call_type]} />
        </View>
      }
      ContentComponent={
        <View style={themed([$styles.row, $contentContainerStyle])}>
          <Text text={callLog.from_number} />
          <View
            style={themed([
              {
                backgroundColor: CallStateColor[callLog.tag].background,
                borderColor: CallStateColor[callLog.tag].border,
              },
              $tagStyle,
            ])}
          >
            <Text
              text={callLog.tag}
              style={themed([{ color: CallStateColor[callLog.tag].text }, $tagTextStyle])}
            />
          </View>
        </View>
      }
      RightComponent={
        <View style={themed($rightComponent)}>
          <Text text={formatMilliseconds(callLog.call_duration)} />
          <Text text={format(new Date(callLog.datetime), "hh:mm a")} />
        </View>
      }
    />
  )
})

const $root: ViewStyle = {
  flex: 1,
}

const $listContentContainer: ThemedStyle<ContentStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.xs,
  paddingTop: spacing.md,
  paddingBottom: spacing.lg,
})

const $emptyState: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.xxl,
})

const $leftComponent: ThemedStyle<ViewStyle> = () => ({
  justifyContent: "center",
})

const $contentContainerStyle: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.sm,
})

const $dividerStyle: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  height: spacing.xxxs * 0.2,
  width: "100%",
  backgroundColor: colors.textDim,
  alignSelf: "center",
  marginTop: spacing.xxs + spacing.xxxs,
  opacity: 0.4,
})
const $dividerTextStyle: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  color: colors.textDim,
  marginRight: spacing.sm,
})

const $tagStyle: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingLeft: spacing.xs,
  paddingRight: spacing.xs,
  paddingBottom: spacing.xxs,
  borderRadius: spacing.xxxl,
  alignContent: "center",
  justifyContent: "center",
  alignItems: "center",
})

const $tagTextStyle: ThemedStyle<TextStyle> = () => ({
  textAlign: "center",
  textAlignVertical: "center",
})

const $rightComponent: ThemedStyle<ViewStyle> = () => ({
  alignItems: "flex-end",
})

const $emptyStateImage: ImageStyle = {
  transform: [{ scaleX: isRTL ? -1 : 1 }],
}
