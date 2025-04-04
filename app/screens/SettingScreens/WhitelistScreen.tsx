import { FC, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { Keyboard, TextStyle, View, ViewStyle } from "react-native"
import { SettingStackScreenProps } from "@/navigators"
import { Button, Icon, Screen, Text, TextField } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import { spacing, ThemedStyle } from "@/theme"
import { BottomSheetBackdrop, BottomSheetFooter, BottomSheetModal } from "@gorhom/bottom-sheet"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { PhoneVerify } from "@/components/PhoneVerify"
import { ContactsSectionList } from "@/components/ContactList"

export const WhitelistScreen: FC<SettingStackScreenProps<"Whitelist">> = observer(
  function WhitelistScreen(_props) {
    const [searchQuery, setSearchQuery] = useState("")
    const [snapIndex, setSnapIndex] = useState(0)
    const [nameModal, setNameModal] = useState("")
    const [numberModal, setNumberModal] = useState("")
    const [phoneCodeModal, setPhoneCodeModal] = useState<string>("")
    const { themed } = useAppTheme()
    const addSheet = useRef<BottomSheetModal>(null)
    const removeSheet = useRef<BottomSheetModal>(null)
    const moveSheet = useRef<BottomSheetModal>(null)
    const { bottom } = useSafeAreaInsets()

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

    return (
      <>
        <Screen style={themed($contentContainer)} preset="fixed">
          <View style={themed($container)}>
            <View style={themed($searchSection)}>
              <TextField
                style={themed($searchBox)}
                inputWrapperStyle={themed($searchBoxWrapper)}
                placeholderTx="whitelistScreen:search"
                value={searchQuery}
                onChangeText={setSearchQuery}
                LeftAccessory={() => <Icon icon="search" containerStyle={themed($searchIcon)} />}
              />
            </View>
            <View style={themed($contactsSection)}>
              <ContactsSectionList />
            </View>
          </View>
          <View style={themed($btnView)}>
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
                onPress={() => {
                  dismissAdd()
                  setNameModal("")
                  setNumberModal("")
                }}
              />
            </BottomSheetFooter>
          )}
        >
          <View style={themed($inputFieldsModal)}>
            <View style={themed($modalHeading)}>
              <Text
                style={themed($label)}
                tx="whitelistScreen:modal_header"
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
              placeholderTx="onboardingAboutScreen:example_name"
              value={nameModal}
              onChangeText={setNameModal}
              LeftAccessory={(props) => (
                <Icon icon="person" size={20} containerStyle={props.style} />
              )}
            />
            {/* Number */}
            <Text
              style={themed($label)}
              tx="whitelistScreen:modal_number"
              size="sm"
              weight="medium"
            />
            <PhoneVerify
              style={themed($phoneComponent)}
              inputWrapperStyle={themed($phoneComponent)}
              value={numberModal ?? ""}
              setValue={setNumberModal}
              countryPhoneCode={phoneCodeModal ? phoneCodeModal : "+91"}
              setCountryPhoneCode={setPhoneCodeModal}
              placeholder="000-000-000"
            />
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
                  onPress={() => {
                    dismissRemove()
                  }}
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
              tx="whitelistScreen:modal_desc_remove"
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
                  onPress={() => {
                    dismissMove()
                  }}
                />
                <Button
                  tx="whitelistScreen:cancel"
                  style={themed($cancelBtnModal)}
                  textStyle={themed($cancelBtnTextModal)}
                  preset="reversed"
                  onPress={() => {
                    dismissMove()
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
                tx="whitelistScreen:modal_header_move"
                size="lg"
                weight="semiBold"
              />
              <Icon icon="x" onPress={dismissRemove} />
            </View>
            {/** Description */}
            <Text
              style={themed($descModalMove)}
              tx="whitelistScreen:modal_desc_move"
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
  padding: spacing.md,
})

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  // flexGrow: 1,
  // marginBottom: spacing.md + spacing.xxs,
  // paddingBottom: spacing.md + spacing.xxs,
})
const $searchSection: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  flex: 1,
  top: 40,
  // position: "absolute",
  // minWidth: 340,
})
const $searchIcon: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginLeft: spacing.md,
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
  top: 90,
})
const $btnView: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  // flex: 1,
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
  paddingLeft: spacing.sm,
})

const $label: ThemedStyle<ViewStyle> = () => ({
  paddingBottom: spacing.sm,
  paddingTop: spacing.xs,
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
})

const $modalHeading: ThemedStyle<ViewStyle> = () => ({
  paddingTop: spacing.sm,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
})
const $inputFieldsModal: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.lg,
  paddingTop: 0,
})

const $nameInputWrapperStyleModal: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.inputBackground,
  height: 46,
  marginBottom: spacing.xs,
})

const $numberInputWrapperStyleModal: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.inputBackground,
  height: 46,
  borderRadius: 20,
  marginBottom: spacing.xs,
})

const $descModalRemove: ThemedStyle<ViewStyle> = () => ({
  paddingBottom: spacing.sm,
  paddingTop: spacing.xs,
  marginLeft: spacing.xxs,
  width: 243,
  alignSelf: "center",
})
const $descModalMove: ThemedStyle<ViewStyle> = () => ({
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
const $cancelBtnModal: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background,
  borderColor: colors.defaultPrimary,
  borderWidth: 2,
  marginTop: spacing.md,
})
const $cancelBtnTextModal: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  color: colors.defaultPrimary,
})
