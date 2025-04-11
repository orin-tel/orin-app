import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetFooter,
  BottomSheetModal,
} from "@gorhom/bottom-sheet"
import { forwardRef, Ref, useImperativeHandle, useRef } from "react"
import { TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { spacing, typography, type ThemedStyle } from "app/theme"
import { useAppTheme } from "app/utils/useAppTheme"
import { Button } from "./Button"
import { Icon } from "./Icon"
import { ListItem } from "./ListItem"
import { TextField, TextFieldProps } from "./TextField"
import CountryFlag from "react-native-country-flag"

export interface LanguageSelectProps
  extends Omit<TextFieldProps, "ref" | "onValueChange" | "onChange" | "value"> {
  value?: string[]
  renderValue?: (value: string[]) => string
  onSelect?: (newValue: string[]) => void
  multiple?: boolean
  options: { label: string; value: string; country: string }[]
}
export interface LanguageSelectRef {
  presentOptions: () => void
  dismissOptions: () => void
}

function without<T>(array: T[], value: T) {
  return array.filter((v) => v !== value)
}

export const LanguageSelect = forwardRef(function LanguageSelect(
  props: LanguageSelectProps,
  ref: Ref<LanguageSelectRef>,
) {
  const {
    value = [],
    onSelect,
    renderValue,
    options = [],
    multiple = true,
    ...TextFieldProps
  } = props
  const sheet = useRef<BottomSheetModal>(null)
  const { bottom } = useSafeAreaInsets()
  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  const disabled = TextFieldProps.editable === false || TextFieldProps.status === "disabled"

  useImperativeHandle(ref, () => ({ presentOptions, dismissOptions }))

  const valueString =
    renderValue?.(value) ??
    value
      .map((v) => options.find((o) => o.value === v)?.label)
      .filter(Boolean)
      .join(", ")

  function presentOptions() {
    if (disabled) return

    sheet.current?.present()
  }

  function dismissOptions() {
    sheet.current?.dismiss()
  }

  function updateValue(optionValue: string) {
    if (value.includes(optionValue)) {
      onSelect?.(multiple ? without(value, optionValue) : [])
    } else {
      onSelect?.(multiple ? [...value, optionValue] : [optionValue])
      if (!multiple) dismissOptions()
    }
  }

  return (
    <>
      <TouchableOpacity activeOpacity={1} onPress={presentOptions}>
        <View pointerEvents="none">
          <TextField
            {...TextFieldProps}
            value={valueString}
            // style={}
          />
        </View>
      </TouchableOpacity>

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
        footerComponent={
          !multiple
            ? undefined
            : (props) => (
                <BottomSheetFooter
                  {...props}
                  style={themed($bottomSheetFooter)}
                  bottomInset={bottom}
                >
                  <Button text="Dismiss" preset="reversed" onPress={dismissOptions} />
                </BottomSheetFooter>
              )
        }
      >
        <BottomSheetFlatList
          style={{ marginBottom: bottom + (multiple ? spacing.xl * 2 : 0) }}
          data={options}
          keyExtractor={(o) => o.value}
          contentContainerStyle={themed($bottomSheetContentContainerStyle)}
          renderItem={({ item, index }) => {
            const isSelected = value.includes(item.value)

            return (
              <ListItem
                text={`${item.label}`}
                style={[themed($listItem), isSelected && themed($selectedItem)]}
                textStyle={[
                  themed($listItemTextStyle),
                  isSelected && themed($listItemTextSelectedStyle),
                ]}
                onPress={() => updateValue(item.value)}
                height={48}
                LeftComponent={
                  <View style={themed($countryIcon)}>
                    <CountryFlag isoCode={item.country} size={16} />
                  </View>
                }
                RightComponent={
                  isSelected ? (
                    <View style={themed($checkIcon)}>
                      <Icon icon="check" size={16} color={colors.text} />
                    </View>
                  ) : undefined
                }
              />
            )
          }}
        />
      </BottomSheetModal>
    </>
  )
})

const $bottomSheetFooter: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingBottom: spacing.xs,
})

const $bottomSheetContentContainerStyle: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingTop: spacing.sm,
})

const $listItemTextStyle: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
})

const $listItemTextSelectedStyle: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontFamily: typography.primary.bold,
})

const $modalBgStyle: ThemedStyle<ViewStyle> = ({ colors }) => ({
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  backgroundColor: colors.background,
})
const $listItem: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.sm,
  marginHorizontal: 12,
  minHeight: 0,
  height: 45,
})
const $countryIcon: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  justifyContent: "center",
  height: "105%",
  paddingRight: spacing.sm,
})
const $checkIcon: ThemedStyle<ViewStyle> = ({ colors }) => ({
  justifyContent: "center",
  alignSelf: "center",
  height: 20,
  width: 20,
  borderColor: colors.defaultPrimary,
  borderWidth: 1.5,
  borderRadius: 100,
})

const $selectedItem: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.primary100,
  borderRadius: 12,
  paddingHorizontal: spacing.sm,
  marginHorizontal: 12,
})
