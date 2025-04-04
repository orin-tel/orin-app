import React from "react"
import { SectionList, StyleSheet, TextStyle, View, ViewStyle } from "react-native"
import { Icon, Text } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import { colors, spacing, ThemedStyle } from "@/theme"

interface Contact {
  name: string
  number: string
}

export interface ContactListProps {
  list: string
}

interface Section {
  title: string
  data: Contact[]
}

const contacts: Section[] = [
  { title: "A", data: [{ name: "Aaron Johnson", number: "+917622365663" }] },
  {
    title: "D",
    data: [
      { name: "David Attenborough", number: "+917622365663" },
      { name: "Daisy Richards", number: "+917622365663" },
    ],
  },
  {
    title: "S",
    data: [{ name: "Sanando", number: "+917622365663" }],
  },
  {
    title: "U",
    data: [
      { name: "Unknown", number: "+917622365663" },
      { name: "Unknown", number: "+917622365663" },
      { name: "Unknown", number: "+917622365663" },
      { name: "Unknown", number: "+917622365663" },
      { name: "Unknown", number: "+917622365663" },
      { name: "Unknown", number: "+917622365663" },
      { name: "Unknown", number: "+917622365663" },
    ],
  },
]

export const ContactsSectionList = () => {
  const { themed } = useAppTheme()
  return (
    <SectionList
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
                <Icon icon="person" color={colors.error} />
                <Icon icon="delete" color={colors.error} />
              </View>
            </View>
          </>
        )
      }}
      renderSectionHeader={({ section: { title } }) => (
        <>
          <View style={themed($header)}>
            <Text style={styles.header}>{title}</Text>
            <View>
              <View style={themed($horizontalLine)} />
            </View>
          </View>
        </>
      )}
    />
  )
}

const styles = StyleSheet.create({
  header: {
    fontSize: spacing.md,
    backgroundColor: colors.background,
    color: colors.textDim,
  },
})

const $header: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  // marginTop: spacing.sm,
  // flexDirection: "row",
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

const $nameNumber: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  // marginTop: spacing.sm,
})
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
