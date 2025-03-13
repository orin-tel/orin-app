import { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { OnboardingStackScreenProps } from "@/navigators"
import { Button, Icon, Radio, Screen, Text } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import { ThemedStyle } from "@/theme"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "@/models" 

export const OnboardingNumberScreen: FC<OnboardingStackScreenProps<"OnboardingNumber">> =
  observer(function OnboardingCountryScreen() {
    const [selectedOption, setSelectedOption] = useState<"ours" | "yours">("ours")
    const { themed } = useAppTheme()
    return (
      <Screen style={themed($root)} contentContainerStyle={themed($contentContainer)} preset="scroll">
        <View style={themed($container)}>
          <View style={themed($sectionContainer)}>
            <View style={themed($textContainer)}>
              <Text tx="onboardingNumberScreen:title" style={themed($sectionTitle)} />
              <Text tx="onboardingNumberScreen:description" style={themed($sectionText)} />
            </View>
            <View style={themed($container)}>
              {/* Forward to ours----------------------*/}
              <TouchableOpacity
                onPress={() => setSelectedOption("ours")}
                style={themed([
                  $optionContainer,
                  selectedOption === "ours" && $selectedOptionOne,
                ])}
              >
                <Text style={themed($optionTitle)}>Forward calls to our number</Text>
                <Radio value={selectedOption === "ours"} />
              </TouchableOpacity>
              {/* Choose Your Own Number-------------*/}
              <TouchableOpacity
                onPress={() => setSelectedOption("yours")}
                style={themed([
                  $optionContainer,
                  selectedOption === "yours" && $selectedOptionTwo,
                ])}
              >
                <Text style={themed($optionTitle)}>Choose your own number</Text>
                <Radio value={selectedOption === "yours"} />
              </TouchableOpacity>
            </View>
            {/*
              <Text text="Forward calls to our number" style={themed($btnSelectText)}/>
              <View >
              
                <View style={themed($infoContainer)}>
                  <Text text="+91 8716239872" style={themed($btnSelectText)} />
                  <Text
                    text="This is our secure, server-protected number to which all your calls will be initially forwarded."
                  />
                </View>
              </View>
             */}
          </View>

          <Button text="Next" style={themed($btnNext)} textStyle={themed($btnNextText)} />
        </View>
      </Screen>
    )

  })

const $root: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  // backgroundColor: colors.background,
  backgroundColor: "white",
})

const $contentContainer: ThemedStyle<ViewStyle> = () => ({
  flexGrow: 1,
  justifyContent: "center",
})

const $container: ThemedStyle<ViewStyle> = () => ({
  width: "100%",
  alignItems: "center",
  gap: 60,
})

const $sectionContainer: ThemedStyle<TextStyle> = ({ }) => ({
  gap: 40,
})
const $optionContainer: ThemedStyle<TextStyle> = ({ colors}) => ({
  backgroundColor: colors.transparent
})
const $optionTitle: ThemedStyle<TextStyle> = ({ }) => ({
  
})

const $selectedOptionOne: ThemedStyle<TextStyle> = ({ }) => ({
  width: 321,
  height: 205,
  backgroundColor: "white",
  borderRadius: 20,
  borderWidth: 1,
  borderColor: "#525252",
  alignItems: "flex-start",
  gap: 8,
})
const $selectedOptionTwo: ThemedStyle<TextStyle> = ({ }) => ({
  backgroundColor: "white",
  borderRadius: 20,
  borderWidth: 1,
  borderColor: "#525252",
  alignItems: "flex-start",
  gap: 8,
})

const $textContainer: ThemedStyle<TextStyle> = ({ }) => ({
  gap: 12,
})

const $sectionTitle: ThemedStyle<TextStyle> = ({ spacing }) => ({
  fontSize: spacing.lg,
  fontWeight: "bold",
  textAlign: "center",
})


const $sectionText: ThemedStyle<TextStyle> = ({ spacing }) => ({
  fontSize: spacing.md,
  fontWeight: "400",
  textAlign: "center",
})
const $infoContainer: ThemedStyle<TextStyle> = ({ spacing }) => ({
  fontSize: spacing.md,
  fontWeight: "400",
  textAlign: "center",
  color: "#3572E114",
})

const $btnNext: ThemedStyle<TextStyle> = () => ({
  width: 260,
  backgroundColor: "#27263E",
  borderRadius: 100,
})


const $btnSelectText: ThemedStyle<TextStyle> = ({ spacing }) => ({
  fontSize: spacing.md,
  color: "#242424",
  fontWeight: "bold",
})

const $btnNextText: ThemedStyle<TextStyle> = ({ }) => ({
  color: "white"
})