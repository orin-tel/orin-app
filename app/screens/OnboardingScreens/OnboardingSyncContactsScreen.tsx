/* eslint-disable react-native/no-color-literals */
import { FC, useCallback, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import {
  ViewStyle,
  View,
  TextStyle,
  Animated,
  Easing,
  StyleSheet,
  LayoutChangeEvent,
} from "react-native"
import { AppStackScreenProps, OnboardingStackScreenProps } from "@/navigators"
import { Button, RadioOption, Screen, Text } from "@/components"
import { useFocusEffect } from "@react-navigation/native"
import { useProgress } from "@/context/ProgressProvider"
import { useAppTheme } from "@/utils/useAppTheme"
import { $styles, ThemedStyle } from "@/theme"
import { Pressable } from "react-native-gesture-handler"
import * as Contacts from "expo-contacts"

import {} from "react-native"
import { useStores } from "@/models"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "@/models"

export const OnboardingSyncContactsScreen: FC<
  OnboardingStackScreenProps<"OnboardingSyncContacts">
> = observer(function OnboardingSyncContactsScreen(_props) {
  // Pull in one of our MST stores
  const { listContactStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  // progress bar
  const { navigation } = _props
  const [shouldSyncContacts, setShouldSyncContacts] = useState<boolean>(true)
  const [syncing, setSyncing] = useState(false)

  const { setProgress } = useProgress()
  useFocusEffect(
    useCallback(() => {
      setProgress(0.7)
    }, []),
  )
  const handleNext = async () => {
    // Check if user wants to sync contacts
    if (shouldSyncContacts) {
      setSyncing(true)
      await listContactStore.fetchContacts()
      setSyncing(false)
    }
    // navigation.navigate("OnboardingValidate")
    navigation.navigate("OnboardingAbout")
  }

  // handle toggling stat
  const handleToggle = (state: boolean) => {
    setShouldSyncContacts(state)
  }
  const { themed } = useAppTheme()
  return (
    <Screen
      style={themed($root)}
      contentContainerStyle={[$styles.container, themed($contentContainer)]}
      // safeAreaEdges={["top"]}
      preset="fixed"
    >
      <View style={themed($textContainer)}>
        <Text
          tx="onboardingSyncContactsScreen:title"
          preset="bold"
          size="xl"
          style={themed($text)}
        />
        <Text
          tx="onboardingSyncContactsScreen:description"
          weight="normal"
          size="sm"
          style={themed($text)}
        />
      </View>
      <View style={themed($options)}>
        <Pressable onPress={() => handleToggle(true)}>
          <View
            style={[
              $styles.row,
              themed($optionContainer),
              shouldSyncContacts && themed($selectedOptionContainer),
            ]}
          >
            <RadioOption value={shouldSyncContacts} />
            <View style={[$styles.row, themed($nestedOptionStyle)]}>
              <Text tx="common:yes" />
              <View style={themed($tagStyle)}>
                <Text tx="common:recommended" size="xxs" weight="light" />
              </View>
            </View>
          </View>
        </Pressable>
        <Pressable onPress={() => handleToggle(false)}>
          <View
            style={[
              $styles.row,
              themed($optionContainer),
              !shouldSyncContacts && themed($selectedOptionContainer),
            ]}
          >
            <RadioOption value={!shouldSyncContacts} />
            <Text tx="common:no" />
          </View>
        </Pressable>
      </View>
      <View style={$styles.container}>
        <Button
          onPress={handleNext}
          tx="common:next"
          style={themed($btnValidate)}
          loading={syncing}
        />
      </View>
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}

const $contentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexGrow: 1,
  justifyContent: "center",
  padding: spacing.lg,
  gap: spacing.xxl,
})

const $options: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.sm,
})
const $textContainer: ThemedStyle<TextStyle> = ({ spacing }) => ({
  gap: spacing.sm,
  textAlign: "center",
  alignItems: "center",
})

const $optionContainer: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  gap: spacing.sm,
  // justifyContent: "center",
  alignItems: "center",
  padding: spacing.md,
  paddingTop: spacing.md,
  backgroundColor: colors.background,
  // borderRadius: spacing.xxl,
  borderWidth: 1,
})

const $selectedOptionContainer: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  borderColor: colors.textDim,
  shadowColor: colors.shadowPrimary,
  shadowOpacity: 0.1,
  borderRadius: spacing.xxxl,

  shadowRadius: 12,
  elevation: 4,
})

const $nestedOptionStyle: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.lg,
})

const $text: ThemedStyle<TextStyle> = ({ spacing }) => ({
  textAlign: "center",
})

const $tagStyle: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  padding: spacing.xxs,
  backgroundColor: colors.palette.neutral300,
  borderRadius: spacing.xxxl,
  paddingRight: spacing.xs,
  paddingLeft: spacing.xs,
})

const $btnValidate: ThemedStyle<TextStyle> = () => ({
  width: "80%",
  alignSelf: "center",
})
