import { FC, useEffect, useMemo, useState } from "react"
import { observer } from "mobx-react-lite"
import { ActivityIndicator, ImageStyle, TextStyle, View, ViewStyle } from "react-native"
import { CallLogStackScreenProps } from "@/navigators"
import { Card, EmptyState, Icon, ListView, Screen, Text } from "@/components"
import { callLogFixture } from "@/fixtures/call-logs.fixtures"
import { CallLog } from "@/types"
import { useAppTheme } from "@/utils/useAppTheme"
import { $styles, ThemedStyle } from "@/theme"
import { isRTL, translate } from "@/i18n"
import { ContentStyle } from "@shopify/flash-list"
import { format, isToday, isYesterday, parseISO } from "date-fns"
import { formatMilliseconds, formatSeconds } from "@/utils/formatMiliseconds"
import { useStores } from "@/models"
import { Call } from "@/models/Call"

import { IconTypes } from "@/components"
import { delay } from "@/utils/delay"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "@/models"

export const CallListScreen: FC<CallLogStackScreenProps<"CallList">> = observer(
  function CallListScreen() {
    // Pull in one of our MST stores
    const { callStore } = useStores()
    const [refreshing, setRefreshing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
      ;(async function load() {
        setIsLoading(true)
        await callStore.fetchCalls()
        setIsLoading(false)
      })()
    }, [callStore])
    // Pull in navigation via hook
    // const navigation = useNavigation()

    // get data for fixture, this is only for DEV
    const { themed } = useAppTheme()

    async function manualRefresh() {
      setRefreshing(true)
      await Promise.all([callStore.fetchCalls(), delay(750)])
      setRefreshing(false)
    }

    return (
      <Screen style={$root} preset="scroll">
        <ListView<Call>
          data={callStore.calls.slice()}
          contentContainerStyle={themed([$listContentContainer])}
          refreshing={refreshing}
          onRefresh={manualRefresh}
          keyExtractor={(item) => item?.callId}
          estimatedItemSize={100}
          onEndReached={() => callStore.fetchCallsBefore()}
          onEndReachedThreshold={0.6}
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
            const previousItem = index > 0 ? callStore.calls[index - 1] : null
            const currentDateLabel = formatDate(item.createdAt)
            const previousDateLabel = previousItem ? formatDate(previousItem.createdAt) : null
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

const CallCard = observer(function CallCard({ callLog }: { callLog: Call }) {
  const {
    theme: { colors },
    themed,
  } = useAppTheme()

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

  const CallIconColor = useMemo(
    () => ({
      INCOMING_CALL: colors.warning,
      RECEIVED_CALL: colors.success,
      OUTGOING_CALL: colors.info,
      MISSED_CALL: colors.error,
    }),
    [colors],
  )

  const callIconName = useMemo(
    () => ({
      INCOMING_CALL: "incoming_call" as IconTypes,
      RECEIVED_CALL: "received_call" as IconTypes,
      OUTGOING_CALL: "outgoing_call" as IconTypes,
      MISSED_CALL: "missed_call" as IconTypes,
    }),
    [],
  )

  return (
    <Card
      preset="paper"
      heading={
        callLog.callerName && callLog.callerName?.length > 0
          ? callLog.callerName
          : translate("call_list:unknown")
      }
      LeftComponent={
        <View style={themed($leftComponent)}>
          <Icon
            icon={callIconName[callLog.callType ?? "INCOMING_CALL"]}
            color={CallIconColor[callLog.callType ?? "INCOMING_CALL"]}
          />
        </View>
      }
      ContentComponent={
        <View style={themed([$styles.row, $contentContainerStyle])}>
          <Text text={callLog.fromPhoneNumber} />
          <View
            style={themed([
              {
                backgroundColor: CallStateColor[callLog.tags?.[0] ?? "AI"].background,
                borderColor: CallStateColor[callLog.tags?.[0] ?? "AI"].border,
              },
              $tagStyle,
            ])}
          >
            <Text
              text={callLog.tags?.[0]?.toLocaleLowerCase() ?? "ai"}
              style={themed([
                { color: CallStateColor[callLog.tags?.[0] ?? "AI"].text },
                $tagTextStyle,
              ])}
            />
          </View>
        </View>
      }
      RightComponent={
        <View style={themed($rightComponent)}>
          <Text text={formatSeconds(callLog.callDuration ?? 0)} />
          <Text text={format(new Date(callLog.createdAt), "hh:mm a")} />
        </View>
      }
    />
  )
})

const $root: ViewStyle = {
  flex: 1,
}

const $listContentContainer: ThemedStyle<ContentStyle> = ({ spacing }) => ({
  flex: 1,
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
