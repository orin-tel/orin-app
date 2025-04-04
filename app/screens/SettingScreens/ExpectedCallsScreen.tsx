import { FC, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { SettingStackScreenProps } from "@/navigators"
import { Button, Icon, ListView, Screen, Switch, Text, TextField } from "@/components"
import { colors, spacing, ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import { BottomSheetBackdrop, BottomSheetFooter, BottomSheetModal } from "@gorhom/bottom-sheet"
import { useSafeAreaInsets } from "react-native-safe-area-context"

interface ExpectedCall {
  id: number
  number: number
  name: string
  reason: string
  expanded: boolean
}

export const ExpectedCallsScreen: FC<SettingStackScreenProps<"ExpectedCalls">> = observer(
  function ExpectedCallsScreen(_props) {
    const { themed } = useAppTheme()
    const sheet = useRef<BottomSheetModal>(null);
    const { bottom } = useSafeAreaInsets();

    function presentOptions() {
      sheet.current?.present();
    }

    function dismissOptions() {
      sheet.current?.dismiss();
    }


    const [searchQuery, setSearchQuery] = useState("")
    const [expectedCalls, setExpectedCalls] = useState<ExpectedCall[]>([])


    const handleAddCall = () => {
      setExpectedCalls([...expectedCalls, { id: Date.now(), number: expectedCalls.length + 1, name: "", reason: "", expanded: true }])
    }
    const handleEditCall = (id: number, field: "name" | "reason", value: string) => {
      setExpectedCalls((prev) =>
        prev.map((call) =>
          call.id === id ? { ...call, [field]: value } : call
        )
      )
    }
    const toggleCallExpansion = (id: number) => {
      setExpectedCalls((prev) =>
        prev.map((call) =>
          call.id === id ? { ...call, expanded: !call.expanded } : call
        )
      )
    }
    const deleteCall = (id: number) => {
      setExpectedCalls((prev) => prev.filter((call) => call.id !== id))
    }

    return (
      <>
        <Screen style={themed($contentContainer)} preset="scroll">
          <View style={themed($container)}>
            <View style={themed($searchSection)}>
              <TextField
                style={themed($searchBox)}
                inputWrapperStyle={themed($searchBoxWrapper)}
                placeholderTx="expectedCallsScreen:search"
                value={searchQuery}
                onChangeText={setSearchQuery}
                LeftAccessory={() => (
                  <Icon icon="search" style={{ marginLeft: spacing.md }} />
                )}
              />
            </View>
            <View style={themed($itemsContainer)}>
              {/* ----- Expected call item generation*/}
              <ListView<ExpectedCall>
                data={expectedCalls}
                keyExtractor={(item) => item.id.toString()}
                estimatedItemSize={24}
                renderItem={({ item }) => (
                  <View key={item.id} style={themed($expectingCall)}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => toggleCallExpansion(item.id)}
                      style={themed($transferInnerOne)}>
                      <View style={themed($textContainer)}>
                        <Text text={`Expected call ${item.number}`} size="sm" weight="semiBold" />
                      </View>
                      <View style={themed($toggleContainer)}>
                        <Switch
                          value={item.expanded}
                          onValueChange={() => toggleCallExpansion(item.id)}
                        />
                        <TouchableOpacity onPress={() => deleteCall(item.id)}>
                          <Icon icon="delete" color="error" />
                        </TouchableOpacity>
                        {item.expanded ? (
                          <Icon icon="caretLeft" size={20} style={{ transform: [{ rotate: "90deg" }] }} />
                        ) : (
                          <Icon icon="dropdown" size={20} />
                        )}
                      </View>
                    </TouchableOpacity>
                    {/** ---- Name and reason inputs */}
                    {item.expanded && (
                      <View style={themed($inputFields)}>
                        <Text style={themed($label)} tx="expectedCallsScreen:caller_name" size="sm" weight="medium" />
                        <TextField
                          style={themed($nameTextStyle)}
                          value={item.name}
                          onChangeText={(text) => handleEditCall(item.id, "name", text)}
                          inputWrapperStyle={themed($nameTextWrapperStyle)}
                          placeholderTx="expectedCallsScreen:caller_name_example"
                        />
                        <Text style={themed($label)} tx="expectedCallsScreen:reason" size="sm" weight="medium" />
                        <TextField
                          style={themed($reasonTextStyle)}
                          multiline
                          value={item.reason}
                          onChangeText={(text) => handleEditCall(item.id, "reason", text)}
                          inputWrapperStyle={themed($reasonTextWrapperStyle)}
                          placeholderTx="expectedCallsScreen:reason_example"
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
        </Screen >
        <BottomSheetModal
          ref={sheet}
          snapPoints={["35%"]}
          stackBehavior="replace"
          enableDismissOnClose
          handleComponent={null}
          backdropComponent={(props) => (
            <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
          )}
          backgroundStyle={themed($modalBgStyle)}
          footerComponent={(props) => (
            <BottomSheetFooter
              {...props}
              style={themed($bottomSheetFooter)}
              bottomInset={bottom}
            >
              <Button text="Dismiss" preset="reversed" onPress={dismissOptions} />
            </BottomSheetFooter>
          )}
          >
            <View>

            </View>
          </BottomSheetModal>
      </>
    )
  }
)


const $contentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  padding: spacing.md,
})

const $container: ThemedStyle<ViewStyle> = () => ({
  paddingBottom: spacing.md + spacing.xxs,

})

const $bottomSheetFooter: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingBottom: spacing.xs,
})

const $modalBgStyle: ThemedStyle<ViewStyle> = ({ colors }) => ({
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  backgroundColor: colors.background,
})
const $searchSection: ThemedStyle<ViewStyle> = ({ spacing }) => ({

})
const $searchBox: ThemedStyle<TextStyle> = ({ spacing }) => ({
  paddingLeft: spacing.xs,
})
const $searchBoxWrapper: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  height: 48,
})

const $itemsContainer: ThemedStyle<ViewStyle> = () => ({
  gap: spacing.md + spacing.xxs,

})

const $textContainer: ThemedStyle<TextStyle> = ({ spacing }) => ({
  gap: spacing.xs,
})

const $toggleContainer: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  gap: 20,
})
const $label: ThemedStyle<ViewStyle> = () => ({
  paddingBottom: spacing.sm,
  paddingTop: spacing.xs,
})
const $nameTextStyle: ThemedStyle<ViewStyle> = () => ({

})

const $nameTextWrapperStyle: ThemedStyle<ViewStyle> = () => ({
  backgroundColor: colors.background,
  height: 46,
  marginBottom: spacing.xs,
})
const $reasonTextStyle: ThemedStyle<ViewStyle> = () => ({
  alignSelf: "flex-start",
  textAlignVertical: "top",
  height: 150,
})

const $reasonTextWrapperStyle: ThemedStyle<ViewStyle> = () => ({
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

const $inputFields: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({

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

