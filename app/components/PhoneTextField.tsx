import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"
import { TextField, TextFieldProps } from "./TextField"
import { Icon } from "./Icon"
import { Button } from "./Button"
import { forwardRef, Ref, useImperativeHandle, useRef } from "react"
import { BottomSheetBackdrop, BottomSheetFlatList, BottomSheetModal } from "@gorhom/bottom-sheet"
import { TouchableOpacity } from "react-native-gesture-handler"
import { COUNTRY_MAP } from "@/constants"
import { ListItem } from "./ListItem"
import CountryFlag from "react-native-country-flag"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { CountryPhoneCode } from "@/types"

export interface PhoneTextFieldProps extends TextFieldProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  value: string
  setValue: (value: string) => void

  countryPhoneCode: CountryPhoneCode
  setCountryPhoneCode: (value: CountryPhoneCode) => void
}

export interface CountryCodeFieldRef {
  presentOptions: () => void
  dismissOptions: () => void
}

/**
 * Describe your component here
 */
export const PhoneTextField = observer(
  forwardRef(function PhoneTextField(props: PhoneTextFieldProps, ref: Ref<CountryCodeFieldRef>) {
    const {
      style,
      placeholder,
      placeholderTx,
      value,
      setValue,
      countryPhoneCode,
      setCountryPhoneCode,
    } = props
    const $styles = [$container, style]
    const { themed } = useAppTheme()
    const { bottom } = useSafeAreaInsets()
    const sheet = useRef<BottomSheetModal>(null)
    useImperativeHandle(ref, () => ({ presentOptions, dismissOptions }))
    function presentOptions() {
      sheet.current?.present()
    }

    function dismissOptions() {
      sheet.current?.dismiss()
    }

    function updateValue(optionValue: CountryPhoneCode) {
      setCountryPhoneCode(optionValue)
    }

    return (
      <>
        <View style={$styles}>
          <TextField
            style={themed($text)}
            value={value}
            onChangeText={setValue}
            maxLength={10}
            keyboardType="decimal-pad"
            placeholderTx={placeholderTx}
            placeholder={placeholder}
            LeftAccessory={(props) => (
              <View style={[props.style, themed($leftAccessoryStyle)]}>
                <Icon icon="phone" />
                <TouchableOpacity activeOpacity={1} onPress={presentOptions}>
                  <Button
                    preset="default"
                    text={countryPhoneCode}
                    style={themed($countryCodeButton)}
                    textStyle={themed($countryCodeButtonText)}
                  />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
        <BottomSheetModal
          ref={sheet}
          snapPoints={["35%"]}
          stackBehavior="replace"
          enableDismissOnClose
          handleComponent={null}
          backdropComponent={(props) => (
            <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
          )}
          backgroundStyle={themed($bottomSheetStyle)}
        >
          <BottomSheetFlatList
            style={{ marginBottom: bottom }}
            data={COUNTRY_MAP}
            keyExtractor={(extracted_key) => extracted_key.value}
            contentContainerStyle={themed($bottomSheetFlatlist)}
            renderItem={({ item }) => {
              const isSelected = countryPhoneCode === item.code

              return (
                <ListItem
                  text={`${item.code} - ${item.label}`}
                  style={[themed($listItem), isSelected && themed($selectedItem)]}
                  textStyle={themed($listItemText)}
                  onPress={() => updateValue(item.code)}
                  height={48}
                  LeftComponent={
                    <View style={themed($countryIcon)}>
                      <CountryFlag isoCode={item.value} size={16} />
                    </View>
                  }
                  RightComponent={
                    isSelected ? (
                      <View style={themed($checkIcon)}>
                        <Icon icon="check" size={16} />
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
  }),
)

const $container: ViewStyle = {
  justifyContent: "center",
}

const $leftAccessoryStyle: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  display: "flex",
  flexDirection: "row",
  marginTop: spacing.xxxs,
})

const $countryCodeButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.transparent,
  borderColor: colors.transparent,
  marginTop: spacing.xxs,
})

const $countryCodeButtonText: ThemedStyle<TextStyle> = ({ spacing, typography, colors }) => ({
  fontFamily: typography.primary.normal,
  fontSize: spacing.lg - spacing.xxs,
  color: colors.text,
})

const $text: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  // fontFamily: typography.primary.normal,
  fontSize: spacing.lg - spacing.xxs,
  color: colors.text,
})

const $bottomSheetStyle: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  borderTopLeftRadius: spacing.lg, // Adjust this for more/less rounding
  borderTopRightRadius: spacing.lg,
  backgroundColor: colors.inputBackground, // Maintain theme color
})

const $bottomSheetFlatlist: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingTop: spacing.sm,
})

const $listItem: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.sm,
  marginHorizontal: spacing.sm,
  minHeight: 0,
  height: spacing.xxl,
})

const $listItemText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
})

const $countryIcon: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  justifyContent: "center",
  height: "105%",
  paddingRight: spacing.sm,
})
const $checkIcon: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  justifyContent: "center",
  alignSelf: "center",
  height: spacing.md + spacing.xxs,
  width: spacing.md + spacing.xxs,
  borderColor: colors.defaultPrimary,
  borderWidth: 1.5,
  borderRadius: 100,
})

const $selectedItem: ThemedStyle<ViewStyle> = ({ colors, spacing, typography }) => ({
  backgroundColor: colors.palette.primary100,
  borderRadius: spacing.sm,
  paddingHorizontal: spacing.sm,
  marginHorizontal: spacing.sm,
  fontFamily: typography.primary.bold,
})
