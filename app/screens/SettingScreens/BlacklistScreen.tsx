import { FC, useEffect, useMemo, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import {
  ActivityIndicator,
  ImageStyle,
  Keyboard,
  SectionList,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"
import { SettingStackScreenProps } from "@/navigators"
import { Button, EmptyState, Icon, PhoneTextField, Screen, Text, TextField } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import { $styles, ThemedStyle } from "@/theme"
import { BottomSheetBackdrop, BottomSheetFooter, BottomSheetModal } from "@gorhom/bottom-sheet"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useStores } from "@/models"
import { isRTL, TxKeyPath } from "@/i18n"
import { delay } from "@/utils/delay"

interface Contact {
  id: string
  name: string
  number: string
}

interface Section {
  title: string
  data: Contact[]
}

export const BlacklistScreen: FC<SettingStackScreenProps<"Blacklist">> = observer(
  function BlacklistScreen(_props) {
    const { listContactStore } = useStores()
    const [searchQuery, setSearchQuery] = useState("")
    const [snapIndex, setSnapIndex] = useState(0)
    const [nameModal, setNameModal] = useState("")
    const [numberModal, setNumberModal] = useState("")
    const [phoneCodeModal, setPhoneCodeModal] = useState<string>("+91")
    const {
      themed,
      theme: { colors, spacing, isDark },
    } = useAppTheme()
    const addSheet = useRef<BottomSheetModal>(null)
    const removeSheet = useRef<BottomSheetModal>(null)
    const moveSheet = useRef<BottomSheetModal>(null)
    const [contactToDeleteId, setContactToDeleteId] = useState<string | null>(null)
    const [contactToBeMovedId, setContactToBeMovedId] = useState<string | null>(null)
    const { bottom } = useSafeAreaInsets()
    const [isLoading, setIsLoading] = useState(false)
    const [isAdding, setIsAdding] = useState(false)
    const [listError, setListError] = useState<TxKeyPath>()
    const [refreshing, setRefreshing] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isBeingMoved, setIsBeingMoved] = useState(false)

    function presentAdd() {
      addSheet.current?.present()
    }
    function dismissAdd() {
      addSheet.current?.dismiss()
    }

    function presentRemove() {
      removeSheet.current?.present()
    }
    function dismissRemove() {
      removeSheet.current?.dismiss()
    }

    function presentMove() {
      moveSheet.current?.present()
    }
    function dismissMove() {
      moveSheet.current?.dismiss()
    }

    const addContact = async () => {
      setListError(undefined)
      setIsAdding(true)
      if (!phoneCodeModal || !numberModal || !nameModal) {
        setIsAdding(false)
        setListError("whitelistScreen:invalid_details")
        return
      }
      const response = await listContactStore.createListContact(
        nameModal,
        `${phoneCodeModal}${numberModal}`,
        "BLACKLIST",
      )
      if (response) {
        setListError(`generalApiProblem:${response.kind}`)
      }
      setNameModal("")
      setNumberModal("")
      console.log("CRAZY")
      setIsAdding(false)
      dismissAdd()
    }

    const deleteContact = async () => {
      setIsDeleting(true)
      if (contactToDeleteId) {
        await listContactStore.deleteListContact(contactToDeleteId)
        dismissRemove()
      }
      setIsDeleting(false)
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

    const moveContact = async () => {
      setIsBeingMoved(true)
      if (!contactToBeMovedId) return
      await listContactStore.moveListContact(contactToBeMovedId, "WHITELIST")
      setIsBeingMoved(false)

      setContactToBeMovedId(null)

      dismissMove()
    }

    // initially, kick off a background refresh without the refreshing UI
    useEffect(() => {
      ;(async function load() {
        setIsLoading(true)
        await listContactStore.fetchBlacklist()
        setIsLoading(false)
      })()
    }, [listContactStore])

    async function manualRefresh() {
      setRefreshing(true)
      await Promise.all([listContactStore.fetchBlacklist(), delay(750)])
      setRefreshing(false)
    }

    const contacts: Section[] = useMemo(() => {
      return listContactStore.groupedBlacklist.map((section) => ({
        title: section.title,
        data: section.data.map((c) => ({
          id: c.id,
          name: c.name,
          number: c.phone_number_e164,
        })),
      }))
    }, [listContactStore.groupedBlacklist])

    // const contacts: Section[] = [
    //   { title: "A", data: [{ name: "Aaron Johnson", number: "+917622365663" }] },
    //   {
    //     title: "D",
    //     data: [
    //       { name: "David Attenborough", number: "+917622365663" },
    //       { name: "Daisy Richards", number: "+917622365663" },
    //     ],
    //   },
    //   {
    //     title: "S",
    //     data: [{ name: "Orin", number: "+917622365663" }],
    //   },
    //   {
    //     title: "U",
    //     data: [
    //       { name: "Unknown", number: "+917622365663" },
    //       { name: "Unknown", number: "+917622365663" },
    //       { name: "Unknown", number: "+917622365663" },
    //       { name: "Unknown", number: "+917622365663" },
    //       { name: "Unknown", number: "+917622365663" },
    //       { name: "Unknown", number: "+917622365663" },
    //       { name: "Unknown", number: "+917622365663" },
    //     ],
    //   },
    // ]

    return (
      <>
        <Screen style={themed($contentContainer)} preset="fixed">
          <View style={themed($container)}>
            {/* <View style={themed($searchSection)}>
              <TextField
                style={themed($searchBox)}
                inputWrapperStyle={themed($searchBoxWrapper)}
                placeholderTx="whitelistScreen:search"
                value={searchQuery}
                onChangeText={setSearchQuery}
                LeftAccessory={() => <Icon icon="search" containerStyle={themed($searchIcon)} />}
              />
            </View> */}
            <View style={themed($contactsSection)}>
              {/* Contact List Section --------------- */}
              <SectionList
                ListHeaderComponent={
                  <TextField
                    style={themed($searchBox)}
                    inputWrapperStyle={themed($searchBoxWrapper)}
                    placeholderTx="whitelistScreen:search"
                    placeholderTextColor={colors.textPlaceholder}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    LeftAccessory={() => (
                      <Icon icon="search" containerStyle={themed($searchIcon)} />
                    )}
                  />
                }
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
                sections={contacts}
                renderItem={({ item }) => {
                  return (
                    <>
                      <View style={themed($contactContainer)}>
                        <View style={themed($left)}>
                          <View style={themed($profilePicture)}>
                            <Text
                              text={`${item.name?.charAt(0).toUpperCase()}`}
                              size={"sm"}
                              style={themed($profilePictureText)}
                            />
                          </View>
                          <View style={themed($nameNumber)}>
                            <Text size="md" weight="semiBold">
                              {item.name}
                            </Text>
                            <Text size="sm" weight="normal">
                              {item.number}
                            </Text>
                          </View>
                        </View>
                        <View style={themed($right)}>
                          {isBeingMoved ? (
                            <ActivityIndicator color={colors.error} />
                          ) : (
                            <Icon
                              icon="person"
                              color={colors.error}
                              onPress={() => {
                                presentMove()
                                setContactToBeMovedId(item.id)
                              }}
                            />
                          )}
                          {isDeleting ? (
                            <ActivityIndicator color={colors.error} />
                          ) : (
                            <Icon
                              icon="delete"
                              color={colors.error}
                              onPress={() => {
                                presentRemove()
                                setContactToDeleteId(item.id)
                              }}
                            />
                          )}
                        </View>
                      </View>
                    </>
                  )
                }}
                renderSectionHeader={({ section: { title } }) => (
                  <>
                    <View>
                      <Text style={themed($header)}>{title}</Text>
                      <View>
                        <View style={themed($horizontalLine)} />
                      </View>
                    </View>
                  </>
                )}
              />
              {/* <ContactsSectionList /> */}
              {/* ---------------------------------------- */}
            </View>
            <Button
              style={themed($addBtn)}
              textStyle={themed($addBtnText)}
              onPress={presentAdd}
              tx="expectedCallsScreen:add"
              LeftAccessory={(props) => (
                <Icon icon="plusCircle" size={20} containerStyle={props.style} />
              )}
            />
          </View>
        </Screen>
        {/* --------------Add sheet modal */}
        <BottomSheetModal
          ref={addSheet}
          snapPoints={["45%", "72%"]}
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
                style={themed($addBtnModal)}
                textStyle={themed($addBtnTextModal)}
                preset="filled"
                loading={isAdding}
                onPress={addContact}
              />
            </BottomSheetFooter>
          )}
        >
          <View style={themed($inputFieldsModal)}>
            <View style={themed($modalHeading)}>
              <Text
                style={themed($label)}
                tx="whitelistScreen:modal_header_blacklist"
                size="lg"
                weight="semiBold"
              />
              <Icon icon="x" onPress={dismissAdd} />
            </View>
            {/** Name */}
            <Text
              style={themed($label)}
              tx="whitelistScreen:modal_name"
              size="sm"
              weight="medium"
            />
            <TextField
              inputWrapperStyle={themed($nameInputWrapperStyleModal)}
              style={themed($inputStyle)}
              placeholderTx="onboardingAboutScreen:example_name"
              value={nameModal}
              onChangeText={setNameModal}
              LeftAccessory={(props) => (
                <Icon icon="person" size={20} containerStyle={props.style} color={colors.text} />
              )}
              placeholderTextColor={colors.textPlaceholder}
            />
            {/* Number */}
            <Text
              style={themed($label)}
              tx="whitelistScreen:modal_number"
              size="sm"
              weight="medium"
            />
            <PhoneTextField
              value={numberModal ?? ""}
              setValue={setNumberModal}
              countryPhoneCode={phoneCodeModal ? phoneCodeModal : "+1"}
              setCountryPhoneCode={setPhoneCodeModal}
              placeholder="000-000-000"
              dismissOnSelect
            />
            {listError && (
              <View style={[$styles.row, themed($errorContainer)]}>
                <Icon icon="infoCircle" color={themed($errorStyle).color?.toString()} />
                <Text tx={listError} style={themed($errorStyle)} />
              </View>
            )}
          </View>
        </BottomSheetModal>
        {/* --------------Remove sheet modal */}
        <BottomSheetModal
          ref={removeSheet}
          snapPoints={["35%"]}
          stackBehavior="replace"
          enableDismissOnClose
          handleComponent={null}
          backdropComponent={(props) => (
            <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
          )}
          backgroundStyle={themed($modalBgStyle)}
          footerComponent={(props) => (
            <BottomSheetFooter {...props} style={themed($bottomSheetFooter)} bottomInset={bottom}>
              <View>
                <Button
                  tx="whitelistScreen:remove"
                  style={themed($removeBtnModal)}
                  textStyle={themed($addBtnTextModal)}
                  preset="filled"
                  loading={isDeleting}
                  onPress={deleteContact}
                />
                <Button
                  tx="whitelistScreen:cancel"
                  style={themed($cancelBtnModal)}
                  textStyle={themed($cancelBtnTextModal)}
                  preset="reversed"
                  onPress={() => {
                    dismissRemove()
                  }}
                />
              </View>
            </BottomSheetFooter>
          )}
        >
          <View style={themed($inputFieldsModal)}>
            <View style={themed($modalHeading)}>
              <Text
                style={themed($label)}
                tx="whitelistScreen:modal_header_remove"
                size="lg"
                weight="semiBold"
              />
              <Icon icon="x" onPress={dismissRemove} />
            </View>
            {/** Description */}
            <Text
              style={themed($descModalRemove)}
              tx="whitelistScreen:modal_desc_remove_blacklist"
              size="md"
              weight="normal"
            />
          </View>
        </BottomSheetModal>
        {/* ------------------Move sheet modal */}
        <BottomSheetModal
          ref={moveSheet}
          snapPoints={["35%"]}
          stackBehavior="replace"
          enableDismissOnClose
          handleComponent={null}
          backdropComponent={(props) => (
            <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
          )}
          backgroundStyle={themed($modalBgStyle)}
          footerComponent={(props) => (
            <BottomSheetFooter {...props} style={themed($bottomSheetFooter)} bottomInset={bottom}>
              <View>
                <Button
                  tx="whitelistScreen:move"
                  style={themed($addBtnModal)}
                  textStyle={themed($addBtnTextModal)}
                  preset="filled"
                  loading={isBeingMoved}
                  onPress={moveContact}
                />
                <Button
                  tx="whitelistScreen:cancel"
                  style={themed($cancelBtnModal)}
                  textStyle={themed($cancelBtnTextModal)}
                  preset="reversed"
                  onPress={dismissMove}
                />
              </View>
            </BottomSheetFooter>
          )}
        >
          <View style={themed($inputFieldsModal)}>
            <View style={themed($modalHeading)}>
              <Text
                style={themed($label)}
                tx="whitelistScreen:modal_header_move"
                size="lg"
                weight="semiBold"
              />
              <Icon icon="x" onPress={dismissMove} />
            </View>
            {/** Description */}
            <Text
              style={themed($descModalMove)}
              tx="whitelistScreen:modal_desc_move_blacklist"
              size="md"
              weight="normal"
            />
          </View>
        </BottomSheetModal>
      </>
    )
  },
)

const $contentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  // flex: 1,
  // padding: spacing.md,
  width: "100%",
})

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  height: "100%",
})
const $searchSection: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  flex: 1,
  top: 40,
  // position: "absolute",
  // minWidth: 340,
})
const $searchIcon: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  marginLeft: spacing.md,
  color: colors.text,
})
const $searchBox: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  paddingLeft: spacing.xs,
  backgroundColor: colors.inputBackground,
})
const $searchBoxWrapper: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  height: 48,
})

const $contactsSection: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  // minHeight: 472,
  padding: spacing.sm,
  height: "100%",
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
  position: "absolute",
  bottom: 60,
})

const $addBtnText: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  color: colors.defaultPrimary,
  paddingLeft: spacing.sm,
})

const $label: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  paddingBottom: spacing.sm,
  paddingTop: spacing.xs,
  color: colors.text,
})

const $bottomSheetFooter: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingBottom: spacing.xs,
})

const $phoneComponent: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 330,
  borderRadius: 20,
  alignSelf: "center",
  // marginTop: spacing.sm,
  // backgroundColor: colors.inputBackground,
})

const $modalBgStyle: ThemedStyle<ViewStyle> = ({ colors }) => ({
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  backgroundColor: colors.background,
  elevation: 20,
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

const $nameInputWrapperStyleModal: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.inputBackground,
  height: 46,
  marginBottom: spacing.xs,
  color: colors.text,
})

const $numberInputWrapperStyleModal: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.inputBackground,
  height: 46,
  borderRadius: 20,
  marginBottom: spacing.xs,
})

const $descModalRemove: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingBottom: spacing.sm,
  paddingTop: spacing.xs,
  marginLeft: spacing.xxs,
  width: 243,
  alignSelf: "center",
})
const $descModalMove: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingBottom: spacing.sm,
  paddingTop: spacing.xs,
  marginLeft: spacing.xxs,
  width: 225,
  alignSelf: "center",
})

const $addBtnModal: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.defaultPrimary,
})
const $addBtnTextModal: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.background,
})
const $removeBtnModal: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.error,
})
const $cancelBtnModal: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.background,
  borderColor: colors.defaultPrimary,
  borderWidth: 2,
  marginTop: spacing.md,
})
const $cancelBtnTextModal: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  color: colors.defaultPrimary,
})

// //

const $header: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  fontSize: spacing.md,
  backgroundColor: colors.background,
  color: colors.textDim,
})

const $contactContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
})
const $left: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  gap: spacing.sm,
  paddingBottom: spacing.sm,
  alignItems: "center",
})
const $right: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  gap: spacing.md,
  alignSelf: "center",
  paddingRight: spacing.md,
  paddingBottom: spacing.xs,
})
const $profilePicture: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 30,
  height: 30,
  borderRadius: 100,
  backgroundColor: colors.defaultPrimary,
  alignItems: "center",
  justifyContent: "center",
})
const $profilePictureText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.background,
  paddingBottom: 3,
})

const $nameNumber: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({})
const $horizontalLine: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  paddingTop: spacing.xs,
  marginBottom: spacing.xs,
  borderBottomColor: colors.textPlaceholder,
  borderBottomWidth: 1,
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

const $emptyStateImage: ImageStyle = {
  transform: [{ scaleX: isRTL ? -1 : 1 }],
}

const $emptyState: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.xxl + spacing.xxl,
})

const $inputStyle: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
})

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
