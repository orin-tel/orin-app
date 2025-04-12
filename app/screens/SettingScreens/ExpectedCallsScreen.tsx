import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import {
  ActivityIndicator,
  ImageStyle,
  Keyboard,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import { SettingStackScreenProps } from "@/navigators"
import { Button, EmptyState, Icon, ListView, Screen, Switch, Text, TextField } from "@/components"
import { $styles, ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import { BottomSheetBackdrop, BottomSheetFooter, BottomSheetModal } from "@gorhom/bottom-sheet"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useStores } from "@/models"
import { ExpectedCall } from "./../../models/ExpectedCallModel"
import { delay } from "@/utils/delay"
import { isRTL, TxKeyPath } from "@/i18n"
import { debounce } from "lodash"

interface ExpectedCallModified extends ExpectedCall {
  number: number
  expanded: boolean
}

export const ExpectedCallsScreen: FC<SettingStackScreenProps<"ExpectedCalls">> = observer(
  function ExpectedCallsScreen(_props) {
    const {
      themed,
      theme: { colors, spacing },
    } = useAppTheme()
    const sheet = useRef<BottomSheetModal>(null)
    const { bottom } = useSafeAreaInsets()
    function presentOptions() {
      sheet.current?.present()
    }
    function dismissOptions() {
      sheet.current?.dismiss()
    }
    const [searchQuery, setSearchQuery] = useState("")
    const [snapIndex, setSnapIndex] = useState(0)
    const [nameModal, setNameModal] = useState("")
    const [reasonModal, setReasonModal] = useState("")
    const [editName, setEditName] = useState("")
    const [editReason, setEditReason] = useState("")

    const { expectedCallStore } = useStores()

    // fetch calls and load
    const [refreshing, setRefreshing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [expectedCallError, setExpectedCallError] = useState<TxKeyPath>()

    const [isAdding, setIsAdding] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [callToBeDeletedId, setCallToBeDeletedId] = useState<string>()

    // initially, kick off a background refresh without the refreshing UI
    useEffect(() => {
      ;(async function load() {
        setIsLoading(true)
        await expectedCallStore.fetchExpectedCalls()
        setIsLoading(false)
      })()
    }, [expectedCallStore])

    async function manualRefresh() {
      setRefreshing(true)
      await Promise.all([expectedCallStore.fetchExpectedCalls(), delay(750)])
      setRefreshing(false)
    }

    console.log("from Screen first", expectedCallStore.expectedCalls)

    // add call
    const handleAddCall = async () => {
      setIsAdding(true)
      const response = await expectedCallStore.createExpectedCall(nameModal, reasonModal)
      if (response) {
        setExpectedCallError(`generalApiProblem:${response.kind}`)
      } else {
        dismissOptions()
        setNameModal("")
        setReasonModal("")
      }
      setIsAdding(false)
    }
    // edit call
    // const handleEditCall = async (id: string, field: "name" | "reason", value: string) => {
    //   const call = expectedCallStore.expectedCalls.find((c) => c.id === id)
    //   if (!call) return
    //   const updatedName = field === "name" ? value : call.caller_name
    //   const updatedReason = field === "reason" ? value : call.caller_reason

    //   await expectedCallStore.updateExpectedCall(call.id, updatedName, updatedReason)
    // }

    const editBuffer: Record<string, { name: string; reason: string }> = {}

    async function handleEditCall(id: string, name: string, reason: string) {
      const response = await expectedCallStore.updateExpectedCall(id, name, reason)
      if (response) {
        setExpectedCallError(`generalApiProblem:${response.kind}`)
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedHandleEditCall = useMemo(() => debounce(handleEditCall, 1000), [])

    // toggle expanded call
    const [expandedCalls, setExpandedCalls] = useState<Record<string, boolean>>({})
    const toggleCallExpansion = (id: string) => {
      setExpandedCalls((prev) => ({
        ...prev,
        [id]: !prev[id],
      }))
    }

    // delete call
    const deleteCall = async (id: string) => {
      setCallToBeDeletedId(id)
      setIsDeleting(true)
      const response = await expectedCallStore.deleteExpectedCall(id)
      if (response) {
        setExpectedCallError(`generalApiProblem:${response.kind}`)
        return
      }
      setExpandedCalls((prev) => {
        const updated = { ...prev }
        delete updated[id]
        return updated
      })
      setIsDeleting(false)
      setCallToBeDeletedId(undefined)
    }

    useEffect(() => {
      const showSub = Keyboard.addListener("keyboardDidShow", () => {
        setSnapIndex(1)
      })

      const hideSub = Keyboard.addListener("keyboardDidHide", () => {
        setSnapIndex(0)
      })

      return () => {
        showSub.remove()
        hideSub.remove()
      }
    }, [])

    const callsWithExpansion = expectedCallStore.getExpectedCalls.map((call, index) => ({
      ...call,
      id: call.id,
      number: index + 1,
      expanded: expandedCalls[Number(call.id)] ?? false,
    }))

    return (
      <>
        <Screen style={themed($contentContainer)} preset="fixed">
          <View style={themed($container)}>
            <View style={themed($searchSection)}>
              <TextField
                style={themed($searchBox)}
                inputWrapperStyle={themed($searchBoxWrapper)}
                placeholderTx="expectedCallsScreen:search"
                placeholderTextColor={colors.textPlaceholder}
                value={searchQuery}
                onChangeText={setSearchQuery}
                LeftAccessory={() => <Icon icon="search" containerStyle={themed($searchIcon)} />}
              />
            </View>
            <View style={themed($itemsContainer)}>
              {/* ----- Expected call item generation*/}
              <ListView<ExpectedCallModified>
                // data={expectedCalls}
                data={callsWithExpansion.slice()}
                keyExtractor={(item) => item.id.toString()}
                refreshing={refreshing}
                onRefresh={manualRefresh}
                estimatedItemSize={24}
                ListEmptyComponent={
                  isLoading ? (
                    <ActivityIndicator />
                  ) : (
                    <EmptyState
                      preset="generic"
                      style={themed($emptyState)}
                      headingTx={"expectedCallsScreen:empty_state_title"}
                      contentTx={"expectedCallsScreen:empty_state_content"}
                      buttonOnPress={manualRefresh}
                      imageStyle={$emptyStateImage}
                      ImageProps={{ resizeMode: "contain" }}
                    />
                  )
                }
                // ListFooterComponent={
                //   isLoading ? (
                //     <ActivityIndicator size="large" style={themed($activityIndicatorFooter)} />
                //   ) : null
                // }
                renderItem={({ item }) => (
                  <View key={item.id} style={themed($expectingCall)}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => toggleCallExpansion(item.id)}
                      style={themed($transferInnerOne)}
                    >
                      <View style={themed($textContainer)}>
                        <Text text={`Expected call ${item.number}`} size="sm" weight="semiBold" />
                      </View>
                      <View style={themed($toggleContainer)}>
                        <Switch
                          value={!!expandedCalls[item.id]}
                          onValueChange={() => toggleCallExpansion(item.id)}
                        />
                        {isDeleting && callToBeDeletedId === item.id ? (
                          <ActivityIndicator color={colors.error} />
                        ) : (
                          <TouchableOpacity onPress={() => deleteCall(item.id)}>
                            <Icon icon="delete" color="error" />
                          </TouchableOpacity>
                        )}
                        {expandedCalls?.[item?.id] ? (
                          <Icon
                            icon="caretLeft"
                            size={20}
                            style={{ transform: [{ rotate: "90deg" }] }}
                          />
                        ) : (
                          <Icon icon="dropdown" size={20} />
                        )}
                      </View>
                    </TouchableOpacity>
                    {/** ---- Name and reason inputs */}
                    {expandedCalls?.[item?.id] && (
                      <View style={themed($inputFields)}>
                        <Text
                          style={themed($label)}
                          tx="expectedCallsScreen:caller_name"
                          size="sm"
                          weight="medium"
                        />
                        <TextField
                          style={themed($nameTextStyle)}
                          value={item.caller_name}
                          onChangeText={(text) =>
                            debouncedHandleEditCall(item.id, text, item.caller_reason)
                          }
                          inputWrapperStyle={themed($nameTextWrapperStyle)}
                          placeholderTx="expectedCallsScreen:caller_name_example"
                          // placeholder={item.caller_name}
                          placeholderTextColor={colors.textPlaceholder}
                        />
                        <Text
                          style={themed($label)}
                          tx="expectedCallsScreen:reason"
                          size="sm"
                          weight="medium"
                        />
                        <TextField
                          style={themed($reasonTextStyle)}
                          multiline
                          value={item.caller_reason}
                          onChangeText={(text) => handleEditCall(item.id, item.caller_name, text)}
                          inputWrapperStyle={themed($reasonTextWrapperStyle)}
                          placeholderTx="expectedCallsScreen:reason_example"
                          // placeholder={item.caller_reason}
                          placeholderTextColor={colors.textPlaceholder}
                        />
                      </View>
                    )}
                  </View>
                )}
              />
            </View>
            <Button
              style={themed($addBtn)}
              textStyle={themed($addBtnText)}
              tx="expectedCallsScreen:add"
              onPress={presentOptions}
              LeftAccessory={(props) => (
                <Icon icon="plusCircle" size={20} containerStyle={props.style} />
              )}
            />
          </View>
        </Screen>
        <BottomSheetModal
          ref={sheet}
          snapPoints={["56%", "85%"]}
          index={snapIndex}
          stackBehavior="replace"
          enableDismissOnClose
          handleComponent={null}
          backdropComponent={(props) => (
            <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
          )}
          backgroundStyle={themed($modalBgStyle)}
          footerComponent={(props) => (
            <BottomSheetFooter {...props} style={themed($bottomSheetFooter)} bottomInset={bottom}>
              <Button
                tx="expectedCallsScreen:add"
                preset="filled"
                loading={isAdding}
                onPress={() => {
                  handleAddCall()
                }}
              />
            </BottomSheetFooter>
          )}
        >
          <View style={themed($inputFieldsModal)}>
            <View style={themed($modalHeading)}>
              <Text
                style={themed($label)}
                tx="expectedCallsScreen:modal_header"
                size="lg"
                weight="semiBold"
              />
              <Icon icon="x" onPress={dismissOptions} />
            </View>
            <Text
              style={themed($label)}
              tx="expectedCallsScreen:caller_name"
              size="sm"
              weight="medium"
            />
            <TextField
              style={themed($nameTextStyle)}
              value={nameModal}
              onChangeText={setNameModal}
              inputWrapperStyle={themed($nameTextWrapperStyleModal)}
              placeholderTx="expectedCallsScreen:caller_name_example"
              placeholderTextColor={colors.textPlaceholder}
            />
            <Text
              style={themed($label)}
              tx="expectedCallsScreen:reason"
              size="sm"
              weight="medium"
            />
            <TextField
              style={themed($reasonTextStyle)}
              multiline
              value={reasonModal}
              onChangeText={setReasonModal}
              inputWrapperStyle={themed($reasonTextWrapperStyleModal)}
              placeholderTx="expectedCallsScreen:reason_example"
              placeholderTextColor={colors.textPlaceholder}
            />
            {expectedCallError && (
              <View style={[$styles.row, themed($errorContainer)]}>
                <Icon icon="infoCircle" color={themed($errorStyle).color?.toString()} />
                <Text tx={expectedCallError} style={themed($errorStyle)} />
              </View>
            )}
          </View>
        </BottomSheetModal>
      </>
    )
  },
)

const $contentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  padding: spacing.md,
  height: "100%",
})

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingBottom: spacing.md + spacing.xxs,
  position: "relative",
  height: "100%",
})

const $searchSection: ThemedStyle<ViewStyle> = ({ spacing }) => ({})

const $searchIcon: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginLeft: spacing.md,
})
const $searchBox: ThemedStyle<TextStyle> = ({ spacing }) => ({
  paddingLeft: spacing.xs,
})
const $searchBoxWrapper: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  height: 48,
})

const $itemsContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.md + spacing.xxs,
  height: "100%",
})

const $textContainer: ThemedStyle<TextStyle> = ({ spacing }) => ({
  gap: spacing.xs,
})

const $toggleContainer: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  gap: 20,
})
const $label: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  paddingBottom: spacing.sm,
  paddingTop: spacing.xs,
  color: colors.text,
})
const $nameTextStyle: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
})

const $nameTextWrapperStyle: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.background,
  height: 46,
  marginBottom: spacing.xs,
})
const $reasonTextStyle: ThemedStyle<ViewStyle> = ({ colors }) => ({
  alignSelf: "flex-start",
  textAlignVertical: "top",
  height: 150,
  color: colors.text,
})

const $reasonTextWrapperStyle: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.background,
  height: 150,
  borderRadius: 20,
  marginBottom: spacing.xs,
})

const $expectingCall: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  padding: spacing.sm,
  borderRadius: 20,
  gap: spacing.sm,
  justifyContent: "space-between",
  backgroundColor: colors.inputBackground,
  marginTop: spacing.md + spacing.xxs,
})

const $transferInnerOne: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  borderRadius: 20,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: colors.inputBackground,
})

const $inputFields: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({})

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
  marginTop: spacing.md + spacing.xxs,
  position: "absolute",
  bottom: 10,
})

const $addBtnText: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  color: colors.defaultPrimary,
  paddingLeft: spacing.sm,
})

const $bottomSheetFooter: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingBottom: spacing.xs,
})

const $modalBgStyle: ThemedStyle<ViewStyle> = ({ colors }) => ({
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  backgroundColor: colors.background,
  elevation: 10,
  shadowColor: colors.shadowPrimary,
})

const $modalHeading: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingTop: spacing.sm,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
})
const $inputFieldsModal: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.lg,
  paddingTop: 0,
})
const $nameTextWrapperStyleModal: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.inputBackground,
  height: 46,
  marginBottom: spacing.xs,
})

const $reasonTextWrapperStyleModal: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.inputBackground,
  height: 150,
  borderRadius: 20,
  marginBottom: spacing.xs,
})
const $addBtnModal: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.defaultPrimary,
})

const $addBtnModalText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
})

const $emptyState: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.xxl + spacing.xxl,
})
const $activityIndicatorFooter: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginVertical: spacing.lg,
})

const $emptyStateImage: ImageStyle = {
  transform: [{ scaleX: isRTL ? -1 : 1 }],
}

const $errorContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  width: "100%",
  alignItems: "center",
  justifyContent: "center",
  marginTop: spacing.md,
  gap: spacing.sm,
})

const $errorStyle: ThemedStyle<TextStyle> = ({ colors }) => ({
  // alignItems: "center",
  // justifyContent: "center",
  textAlign: "center",
  color: colors.error,
})
