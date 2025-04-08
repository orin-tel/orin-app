import demoEn from "./demo-en"

const en = {
  common: {
    ok: "OK!",
    cancel: "Cancel",
    back: "Back",
    logOut: "Log Out",
  },
  tabs: {
    call_logs: {
      tab: "Call Logs",
      call_list: "Call Logs",
      call: "Call",
    },
    dialer: {
      tab: "Dialer",
    },
    contacts: {
      tab: "Contacts",
    },
    settings: {
      tab: "Settings",
    },
  },
  welcomeScreen: {
    postscript:
      "psst  — This probably isn't what your app looks like. (Unless your designer handed you these screens, and in that case, ship it!)",
    readyForLaunch: "Your app, almost ready for launch!",
    exciting: "(ohh, this is exciting!)",
    letsGo: "Let's go!",
  },
  errorScreen: {
    title: "Something went wrong!",
    friendlySubtitle:
      "This is the screen that your users will see in production when an error is thrown. You'll want to customize this message (located in `app/i18n/en.ts`) and probably the layout as well (`app/screens/ErrorScreen`). If you want to remove this entirely, check `app/app.tsx` for the <ErrorBoundary> component.",
    reset: "RESET APP",
    traceTitle: "Error from %{name} stack",
  },
  emptyStateComponent: {
    generic: {
      heading: "So empty... so sad",
      content: "No data found yet. Try clicking the button to refresh or reload the app.",
      button: "Let's try this again",
    },
  },

  errors: {
    invalidEmail: "Invalid email address.",
  },
  loginScreen: {
    logIn: "Log In",
    enterDetails:
      "Enter your details below to unlock top secret info. You'll never guess what we've got waiting. Or maybe you will; it's not rocket science here.",
    emailFieldLabel: "Email",
    passwordFieldLabel: "Password",
    emailFieldPlaceholder: "Enter your email address",
    passwordFieldPlaceholder: "Super secret password here",
    tapToLogIn: "Tap to log in!",
    hint: "Hint: you can use any email address and your favorite password :)",
  },
  demoNavigator: {
    componentsTab: "Components",
    debugTab: "Debug",
    communityTab: "Community",
    podcastListTab: "Podcast",
  },
  demoCommunityScreen: {
    title: "Connect with the community",
    tagLine:
      "Plug in to Infinite Red's community of React Native engineers and level up your app development with us!",
    joinUsOnSlackTitle: "Join us on Slack",
    joinUsOnSlack:
      "Wish there was a place to connect with React Native engineers around the world? Join the conversation in the Infinite Red Community Slack! Our growing community is a safe space to ask questions, learn from others, and grow your network.",
    joinSlackLink: "Join the Slack Community",
    makeIgniteEvenBetterTitle: "Make Ignite even better",
    makeIgniteEvenBetter:
      "Have an idea to make Ignite even better? We're happy to hear that! We're always looking for others who want to help us build the best React Native tooling out there. Join us over on GitHub to join us in building the future of Ignite.",
    contributeToIgniteLink: "Contribute to Ignite",
    theLatestInReactNativeTitle: "The latest in React Native",
    theLatestInReactNative: "We're here to keep you current on all React Native has to offer.",
    reactNativeRadioLink: "React Native Radio",
    reactNativeNewsletterLink: "React Native Newsletter",
    reactNativeLiveLink: "React Native Live",
    chainReactConferenceLink: "Chain React Conference",
    hireUsTitle: "Hire Infinite Red for your next project",
    hireUs:
      "Whether it's running a full project or getting teams up to speed with our hands-on training, Infinite Red can help with just about any React Native project.",
    hireUsLink: "Send us a message",
  },
  demoShowroomScreen: {
    jumpStart: "Components to jump start your project!",
    lorem2Sentences:
      "Nulla cupidatat deserunt amet quis aliquip nostrud do adipisicing. Adipisicing excepteur elit laborum Lorem adipisicing do duis.",
    demoHeaderTxExample: "Yay",
    demoViaTxProp: "Via `tx` Prop",
    demoViaSpecifiedTxProp: "Via `{{prop}}Tx` Prop",
  },
  demoDebugScreen: {
    howTo: "HOW TO",
    title: "Debug",
    tagLine:
      "Congratulations, you've got a very advanced React Native app template here.  Take advantage of this boilerplate!",
    reactotron: "Send to Reactotron",
    reportBugs: "Report Bugs",
    demoList: "Demo List",
    demoPodcastList: "Demo Podcast List",
    androidReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running, run adb reverse tcp:9090 tcp:9090 from your terminal, and reload the app.",
    iosReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running and reload app.",
    macosReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running and reload app.",
    webReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running and reload app.",
    windowsReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running and reload app.",
  },
  demoPodcastListScreen: {
    title: "React Native Radio episodes",
    onlyFavorites: "Only Show Favorites",
    favoriteButton: "Favorite",
    unfavoriteButton: "Unfavorite",
    accessibility: {
      cardHint:
        "Double tap to listen to the episode. Double tap and hold to {{action}} this episode.",
      switch: "Switch on to only show favorites",
      favoriteAction: "Toggle Favorite",
      favoriteIcon: "Episode not favorited",
      unfavoriteIcon: "Episode favorited",
      publishLabel: "Published {{date}}",
      durationLabel: "Duration: {{hours}} hours {{minutes}} minutes {{seconds}} seconds",
    },
    noFavoritesEmptyState: {
      heading: "This looks a bit empty",
      content:
        "No favorites have been added yet. Tap the heart on an episode to add it to your favorites!",
    },
  },

  /** ORIN APP TRANSLATIONS */
  signUpScreen: {
    welcome: "Welcome To",
    title: "ORiN",
    intro_one: "Enjoy unlimited 24 x 7",
    intro_two: "call assistance",
    google_oauth: "Login with Google",
  },
  onboardingRegisterMobileScreen: {
    register: "REGISTER",
    enter_your_mobile_number: "Enter your mobile number",
    get_otp: "Get OTP",
    invalid_number: "Invalid mobile number",
  },
  onboardingVerifyOtpScreen: {
    otp_verification: "OTP Verification",
    otp_successfully_sent_to: "OTP successfully sent to",
    invalid_number_issue: "An unexpected problem occured, please contact support",
    resend_otp: "Resend OTP",
    confirm_otp: "Confirm OTP",
  },
  onboardingCountryScreen: {
    title: "Choose country",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    select_country: "Select a country",
  },
  onboardingNumberScreen: {
    title: "Choose an option",
    description: "Select how you want to forward your calls",
    select_country: "Select a country",
    forward_to_ours: "Forward calls to our number",
    info: "This is our secure, server-protected number to which all your calls will be initially forwarded.",
    choose_yours: "Choose your own number",
    next: "Next",
  },
  onboardingValidateScreen: {
    title: "Forward and Validate",
    description:
      "You must complete the forwarding process first and then validate it to confirm the successful setup of call forwarding",
    info_one:
      "If you have an Android phone, simply copy and paste this into your dialer and call to complete the process",
    info_two:
      "If you have an iOS phone, go to Settings > Phone > Call Forwarding, enter the number, and enable forwarding.",
    validate: "Validate",
  },
  onboardingCongratulationsScreen: {
    title: "Congratulations!",
    description:
      "Your validation has been done successfully. All your calls will be forwarded to our number.",
    label: "Number",
    next: "Next",
  },
  onboardingAboutScreen: {
    title: "Tell us a bit about you",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    label_one: "Your name",
    example_name: "Eg. Sanando",
    label_two: "Information about you for the AI to know you better",
    example_info:
      "Eg. I am expecting a call from car dealership from BMW. I visited their Paris store last week and they said, they will get in touch with me.",
    next: "Next",
  },
  onboardingAgentScreen: {
    title: "Create your Orin agent",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    label_one: "Agent name",
    example_name: "Eg. Sanando",
    label_two: "Agent language",
    select_language: "Select a language",
    label_three: "Select a voice",
    voice_one: "Voice 1",
    voice_two: "Voice 2",
    voice_three: "Voice 3",
    finish_setup: "Finish setup",
  },
  overviewScreen: {
    agent_config: "ORiN agent config",
    agent_config_desc: "Agent name, Voice, Language",
    connect_calls: "Connect calls",
    connect_calls_desc: "Transfer calls, Block calls",
    whitelist_blacklist: "Whitelist/backlist numbers",
    whitelist_blacklist_desc: "Connect phonebook, Whitelist, Blacklist",
    calendar_settings: "Calendar settings",
    calendar_settings_desc: "Google calendar",
    contact_orin: "Contact ORiN",
    contact_orin_desc: "Contact ORiN team",
  },
  settingsProfileScreen: {
    label_one: "Your name",
    // example_name:"Eg. Sanando",
    label_two: "Your phone number",
    label_three: "Information about you for the AI to know you better",
    example_info:
      "Eg. I am expecting a call from car dealership from BMW. I visited their Paris store last week and they said, they will get in touch with me.",
    save: "Save",
  },
  agentConfigScreen: {
    label_one: "Agent name",
    label_two: "Agent language",
    select_language: "Select a language",
    label_three: "Select a voice",
    voice_one: "Voice 1",
    voice_two: "Voice 2",
    voice_three: "Voice 3",
    save: "Save",
  },
  connectCallsScreen: {
    transfer: "Transfer calls",
    transfer_desc: "Transfer calls to my personal number",
    enter_personal: "Enter personal number to transfer call to:",
    enter_otp: "Enter OTP sent to ",
    verify_number: "Verify number",
    choose: "Choose one option:",
    transfer_all: "Transfer all calls",
    transfer_genuine: "Transfer genuine calls",
    transfer_whitelisted: "Transfer only whitelisted calls",
    blockAI: "Block AI calls",
    blockAI_desc: "Block all AI generated calls completely",
    blockSpam: "Block spam/promotional calls",
    blockSpam_desc: "Block all spam/promotional calls completely",
    expecting: "Expecting calls",
    expecting_desc:
      "If your are expecting a call from a service or person, please provide details.",
    view_all: "View all",
  },
  expectedCallsScreen: {
    search: "Search for an expected call",
    expected: "Expected call ",
    caller_name: "Caller name",
    caller_name_example: "Eg. BMW Call",
    reason: "Reason",
    reason_example:
      "Eg. I am expecting a call from car dealership from BMW. I visited their Paris store last week and they said, they will get in touch with me.",
    add: "Add",
  },
  whitelistBlacklistScreen: {
    connect_google: "Connect Google Phonebook",
    connect_apple: "Connect Apple Phonebook",
    or: "or",
    add_manually: "Add manually",
    add_manually_desc: "Add numbers to Whitelist / Blacklist manually",
    whitelist_numbers: "Whitelist numbers ",
    blacklist_numbers: "Blacklist numbers ",
  },
  whitelistScreen: {
    search: "Search name or number",
    add: "Add",
  },

  /**
   * CORE
   */
  call_list: {
    empty_state_title: "No calls found",
    empty_state_content: "wow so empty",
    unknown: "Unknown",
  },
  /**
   * CORE
   */

  /**
   * Notifications
   */
  activeCall: {
    incoming_call: "Incoming Call",
    rejected: "Rejected",
    cancelled: "Cancelled",
  },

  /** ORIN APP TRANSLATIONS */

  /**
   *  API PROBLEMS
   */
  generalApiProblem: {
    "timeout": "Request timed out. Please try again.",
    "cannot-connect": "Check your internet connection.",
    "server": "Server error. Please try again later.",
    "unauthorized": "You are not authorized. Please log in.",
    "forbidden": "You don't have permission to access this resource.",
    "not-found": "Requested resource not found.",
    "rejected": "Please check and try again.",
    "unknown": "Something went wrong. Please try again.",
    "bad-data": "Invalid request. Please contact support.",
  },

  /**
   *  API PROBLEMS
   */

  ...demoEn,
}

export default en
export type Translations = typeof en
