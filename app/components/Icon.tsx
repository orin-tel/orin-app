import { ComponentType } from "react"
import {
  Image,
  ImageStyle,
  StyleProp,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps,
  ViewStyle,
} from "react-native"
import { useAppTheme } from "@/utils/useAppTheme"

export type IconTypes = keyof typeof iconRegistry

interface IconProps extends TouchableOpacityProps {
  /**
   * The name of the icon
   */
  icon: IconTypes

  /**
   * An optional tint color for the icon
   */
  color?: string

  /**
   * An optional size for the icon. If not provided, the icon will be sized to the icon's resolution.
   */
  size?: number

  /**
   * Style overrides for the icon image
   */
  style?: StyleProp<ImageStyle>

  /**
   * Style overrides for the icon container
   */
  containerStyle?: StyleProp<ViewStyle>

  /**
   * An optional function to be called when the icon is pressed
   */
  onPress?: TouchableOpacityProps["onPress"]
}

/**
 * A component to render a registered icon.
 * It is wrapped in a <TouchableOpacity /> if `onPress` is provided, otherwise a <View />.
 * @see [Documentation and Examples]{@link https://docs.infinite.red/ignite-cli/boilerplate/app/components/Icon/}
 * @param {IconProps} props - The props for the `Icon` component.
 * @returns {JSX.Element} The rendered `Icon` component.
 */
export function Icon(props: IconProps): JSX.Element {
  const {
    icon,
    color,
    size,
    style: $imageStyleOverride,
    containerStyle: $containerStyleOverride,
    ...WrapperProps
  } = props

  const isPressable = !!WrapperProps.onPress
  const Wrapper = (WrapperProps?.onPress ? TouchableOpacity : View) as ComponentType<
    TouchableOpacityProps | ViewProps
  >

  const { theme } = useAppTheme()

  const $imageStyle: StyleProp<ImageStyle> = [
    $imageStyleBase,
    icon !== "google" && { tintColor: color ?? theme.colors.text },
    size !== undefined && { width: size, height: size },
    $imageStyleOverride,
  ]

  return (
    <Wrapper
      accessibilityRole={isPressable ? "imagebutton" : undefined}
      {...WrapperProps}
      style={$containerStyleOverride}
    >
      <Image style={$imageStyle} source={iconRegistry[icon]} />
    </Wrapper>
  )
}

export const iconRegistry = {
  back: require("../../assets/icons/back.png"),
  bell: require("../../assets/icons/bell.png"),
  caretLeft: require("../../assets/icons/caretLeft.png"),
  caretRight: require("../../assets/icons/caretRight.png"),
  check: require("../../assets/icons/check.png"),
  clap: require("../../assets/icons/demo/clap.png"),
  community: require("../../assets/icons/demo/community.png"),
  components: require("../../assets/icons/demo/components.png"),
  debug: require("../../assets/icons/demo/debug.png"),
  github: require("../../assets/icons/demo/github.png"),
  heart: require("../../assets/icons/demo/heart.png"),
  hidden: require("../../assets/icons/hidden.png"),
  ladybug: require("../../assets/icons/ladybug.png"),
  lock: require("../../assets/icons/lock.png"),
  menu: require("../../assets/icons/menu.png"),
  more: require("../../assets/icons/more.png"),
  pin: require("../../assets/icons/demo/pin.png"),
  podcast: require("../../assets/icons/demo/podcast.png"),
  settings: require("../../assets/icons/settings.png"),
  slack: require("../../assets/icons/demo/slack.png"),
  view: require("../../assets/icons/view.png"),
  x: require("../../assets/icons/x.png"),
  world: require("../../assets/icons/world.png"),
  dropdown: require("../../assets/icons/dropdown.png"),
  phone: require("../../assets/icons/phone.png"),
  refresh: require("../../assets/icons/refresh.png"),
  call: require("../../assets/icons/call.png"),
  dialer: require("../../assets/icons/dialer.png"),
  contacts: require("../../assets/icons/contacts.png"),
  infoCircle: require("../../assets/icons/infoCircle.png"),
  copy: require("../../assets/icons/copy.png"),
  checkInverse: require("../../assets/icons/checkInverse.png"),
  arrowLeftCircle: require("../../assets/icons/arrowLeftCircle.png"),
  person: require("../../assets/icons/person.png"),
  received_call: require("../../assets/icons/received_call.png"),
  incoming_call: require("../../assets/icons/incoming_call.png"),
  outgoing_call: require("../../assets/icons/outgoing_call.png"),
  missed_call: require("../../assets/icons/missed_call.png"),
  phoneOutgoing: require("../../assets/icons/phoneOutgoing.png"),
  block: require("../../assets/icons/block.png"),
  calendar: require("../../assets/icons/calendar.png"),
  saveInverted: require("../../assets/icons/saveInverted.png"),
  delete: require("../../assets/icons/delete.png"),
  plusCircle: require("../../assets/icons/plusCircle.png"),
  google: require("../../assets/icons/google.png"),
  apple: require("../../assets/icons/apple.png"),
  search: require("../../assets/icons/search.png"),
  checkOutCircle: require("../../assets/icons/checkOutCircle.png"),
  micOff: require("../../assets/icons/mic-off.png"),
  speaker: require("../../assets/icons/speaker.png"),
  message: require("../../assets/icons/message.png"),
  email: require("../../assets/icons/email.png"),
}

const $imageStyleBase: ImageStyle = {
  resizeMode: "contain",
}
