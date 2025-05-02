import demoFr from "./demo-fr"
import { Translations } from "./en"

const fr: Translations = {
  common: {
    ok: "OK !",
    cancel: "Annuler",
    back: "Retour",
    logOut: "Déconnexion",
  },
  welcomeScreen: {
    postscript:
      "psst  — Ce n'est probablement pas à quoi ressemble votre application. (À moins que votre designer ne vous ait donné ces écrans, dans ce cas, mettez la en prod !)",
    readyForLaunch: "Votre application, presque prête pour le lancement !",
    exciting: "(ohh, c'est excitant !)",
    letsGo: "Allons-y !",
  },
  errorScreen: {
    title: "Quelque chose s'est mal passé !",
    friendlySubtitle:
      "C'est l'écran que vos utilisateurs verront en production lorsqu'une erreur sera lancée. Vous voudrez personnaliser ce message (situé dans `app/i18n/fr.ts`) et probablement aussi la mise en page (`app/screens/ErrorScreen`). Si vous voulez le supprimer complètement, vérifiez `app/app.tsx` pour le composant <ErrorBoundary>.",
    reset: "RÉINITIALISER L'APPLICATION",
    traceTitle: "Erreur depuis %{name}",
  },
  emptyStateComponent: {
    generic: {
      heading: "Si vide... si triste",
      content:
        "Aucune donnée trouvée pour le moment. Essayez de cliquer sur le bouton pour rafraîchir ou recharger l'application.",
      button: "Essayons à nouveau",
    },
  },

  errors: {
    invalidEmail: "Adresse e-mail invalide.",
  },
  loginScreen: {
    logIn: "Se connecter",
    enterDetails:
      "Entrez vos informations ci-dessous pour débloquer des informations top secrètes. Vous ne devinerez jamais ce que nous avons en attente. Ou peut-être que vous le ferez ; ce n'est pas de la science spatiale ici.",
    emailFieldLabel: "E-mail",
    passwordFieldLabel: "Mot de passe",
    emailFieldPlaceholder: "Entrez votre adresse e-mail",
    passwordFieldPlaceholder: "Mot de passe super secret ici",
    tapToLogIn: "Appuyez pour vous connecter!",
    hint: "Astuce : vous pouvez utiliser n'importe quelle adresse e-mail et votre mot de passe préféré :)",
  },
  demoNavigator: {
    componentsTab: "Composants",
    debugTab: "Débogage",
    communityTab: "Communauté",
    podcastListTab: "Podcasts",
  },
  demoCommunityScreen: {
    title: "Connectez-vous avec la communauté",
    tagLine:
      "Rejoignez la communauté d'ingénieurs React Native d'Infinite Red et améliorez votre développement d'applications avec nous !",
    joinUsOnSlackTitle: "Rejoignez-nous sur Slack",
    joinUsOnSlack:
      "Vous souhaitez vous connecter avec des ingénieurs React Native du monde entier ? Rejoignez la conversation dans la communauté Slack d'Infinite Red ! Notre communauté en pleine croissance est un espace sûr pour poser des questions, apprendre des autres et développer votre réseau.",
    joinSlackLink: "Rejoindre la communauté Slack",
    makeIgniteEvenBetterTitle: "Rendre Ignite encore meilleur",
    makeIgniteEvenBetter:
      "Vous avez une idée pour rendre Ignite encore meilleur ? Nous sommes heureux de l'entendre ! Nous cherchons toujours des personnes qui veulent nous aider à construire les meilleurs outils React Native. Rejoignez-nous sur GitHub pour nous aider à construire l'avenir d'Ignite.",
    contributeToIgniteLink: "Contribuer à Ignite",
    theLatestInReactNativeTitle: "Les dernières nouvelles de React Native",
    theLatestInReactNative:
      "Nous sommes là pour vous tenir au courant de tout ce que React Native a à offrir.",
    reactNativeRadioLink: "React Native Radio",
    reactNativeNewsletterLink: "React Native Newsletter",
    reactNativeLiveLink: "React Native Live",
    chainReactConferenceLink: "Conférence Chain React",
    hireUsTitle: "Engagez Infinite Red pour votre prochain projet",
    hireUs:
      "Que ce soit pour gérer un projet complet ou pour former des équipes à notre formation pratique, Infinite Red peut vous aider pour presque tous les projets React Native.",
    hireUsLink: "Envoyez-nous un message",
  },
  demoShowroomScreen: {
    jumpStart: "Composants pour démarrer votre projet !",
    lorem2Sentences:
      "Nulla cupidatat deserunt amet quis aliquip nostrud do adipisicing. Adipisicing excepteur elit laborum Lorem adipisicing do duis.",
    demoHeaderTxExample: "Yay",
    demoViaTxProp: "Via la propriété `tx`",
    demoViaSpecifiedTxProp: "Via la propriété `{{prop}}Tx` spécifiée",
  },
  demoDebugScreen: {
    howTo: "COMMENT FAIRE",
    title: "Débugage",
    tagLine:
      "Félicitations, vous avez un modèle d'application React Native très avancé ici. Profitez de cette base de code !",
    reactotron: "Envoyer à Reactotron",
    reportBugs: "Signaler des bugs",
    demoList: "Liste de démonstration",
    demoPodcastList: "Liste de podcasts de démonstration",
    androidReactotronHint:
      "Si cela ne fonctionne pas, assurez-vous que l'application de bureau Reactotron est en cours d'exécution, exécutez adb reverse tcp:9090 tcp:9090 à partir de votre terminal, puis rechargez l'application.",
    iosReactotronHint:
      "Si cela ne fonctionne pas, assurez-vous que l'application de bureau Reactotron est en cours d'exécution, puis rechargez l'application.",
    macosReactotronHint:
      "Si cela ne fonctionne pas, assurez-vous que l'application de bureau Reactotron est en cours d'exécution, puis rechargez l'application.",
    webReactotronHint:
      "Si cela ne fonctionne pas, assurez-vous que l'application de bureau Reactotron est en cours d'exécution, puis rechargez l'application.",
    windowsReactotronHint:
      "Si cela ne fonctionne pas, assurez-vous que l'application de bureau Reactotron est en cours d'exécution, puis rechargez l'application.",
  },
  demoPodcastListScreen: {
    title: "Épisodes de Radio React Native",
    onlyFavorites: "Afficher uniquement les favoris",
    favoriteButton: "Favori",
    unfavoriteButton: "Non favori",
    accessibility: {
      cardHint:
        "Double-cliquez pour écouter l'épisode. Double-cliquez et maintenez pour {{action}} cet épisode.",
      switch: "Activez pour afficher uniquement les favoris",
      favoriteAction: "Basculer en favori",
      favoriteIcon: "Épisode non favori",
      unfavoriteIcon: "Épisode favori",
      publishLabel: "Publié le {{date}}",
      durationLabel: "Durée : {{hours}} heures {{minutes}} minutes {{seconds}} secondes",
    },
    noFavoritesEmptyState: {
      heading: "C'est un peu vide ici",
      content:
        "Aucun favori n'a été ajouté pour le moment. Appuyez sur le cœur d'un épisode pour l'ajouter à vos favoris !",
    },
  },

  tabs: {
    call_logs: {
      tab: "Journaux d'appels",
      call_list: "Journaux d'appels",
      call: "Appel",
    },
    dialer: {
      tab: "Composeur",
    },
    contacts: {
      tab: "Contacts",
    },
    settings: {
      tab: "Paramètres",
    },
  },
  onboardingRegisterMobileScreen: {
    register: "S'INSCRIRE",
    enter_your_mobile_number: "Entrez votre numéro de mobile",
    get_otp: "Obtenir un OTP",
  },
  onboardingVerifyOtpScreen: {
    otp_verification: "Vérification OTP",
    otp_successfully_sent_to: "OTP envoyé avec succès à",
    resend_otp: "Renvoyer OTP",
    confirm_otp: "Confirmer OTP",
  },
  onboardingValidateScreen: {
    title: "Transférer et valider",
    description:
      "Vous devez d'abord terminer le processus de transfert, puis le valider pour confirmer la configuration réussie du transfert d'appel.",
    number: "*#21# +91 8716239872",
    info_one:
      "Si vous avez un téléphone Android, copiez et collez simplement ceci dans votre composeur et appelez pour terminer le processus.",
    info_two:
      "Si vous avez un iPhone, allez dans Réglages > Téléphone > Renvoi d'appel, entrez le numéro et activez le renvoi.",
    validate: "Valider",
  },
  onboardingAboutScreen: {
    title: "Parlez-nous un peu de vous",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    label_one: "Votre nom",
    example_name: "Ex. Sanando",
    label_two: "Informations sur vous pour que l'IA puisse mieux vous connaître",
    example_info:
      "Ex. J'attends un appel de la concession automobile BMW. J'ai visité leur magasin à Paris la semaine dernière et ils ont dit qu'ils me contacteraient.",
    next: "Suivant",
  },
  onboardingAgentScreen: {
    title: "Créez votre agent Orin",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    label_one: "Nom de l'agent",
    example_name: "Ex. Sanando",
    label_two: "Langue de l'agent",
    select_language: "Sélectionnez une langue",
    label_three: "Sélectionnez une voix",
    voice_one: "Voix 1",
    voice_two: "Voix 2",
    voice_three: "Voix 3",
    finish_setup: "Terminer la configuration",
  },
  overviewScreen: {
    agent_config: "Configuration de l'agent ORiN",
    agent_config_desc: "Nom de l'agent, Voix, Langue",
    connect_calls: "Connecter les appels",
    connect_calls_desc: "Transférer les appels, Bloquer les appels",
    whitelist_blacklist: "Liste blanche/noire des numéros",
    whitelist_blacklist_desc: "Connecter le répertoire, Liste blanche, Liste noire",
    calendar_settings: "Paramètres du calendrier",
    calendar_settings_desc: "Calendrier Google",
    contact_orin: "Contacter ORiN",
    contact_orin_desc: "Contacter l'équipe ORiN",
  },
  settingsProfileScreen: {
    label_one: "Votre nom",
    label_two: "Votre numéro de téléphone",
    label_three: "Informations sur vous pour que l'IA puisse mieux vous connaître",
    example_info:
      "Ex. J'attends un appel de la concession automobile BMW. J'ai visité leur magasin à Paris la semaine dernière et ils ont dit qu'ils me contacteraient.",
    save: "Sauvegarder",
  },
  agentConfigScreen: {
    label_one: "Nom de l'agent",
    label_two: "Langue de l'agent",
    select_language: "Sélectionnez une langue",
    label_three: "Sélectionnez une voix",
    voice_one: "Voix 1",
    voice_two: "Voix 2",
    voice_three: "Voix 3",
    save: "Sauvegarder",
  },
  connectCallsScreen: {
    transfer: "Transférer les appels",
    transfer_desc: "Transférer les appels vers mon numéro personnel",
    enter_personal: "Entrez le numéro personnel pour transférer l'appel :",
    enter_otp: "Entrez l'OTP envoyé à ",
    verify_number: "Vérifier le numéro",
    choose: "Choisissez une option :",
    transfer_all: "Transférer tous les appels",
    transfer_genuine: "Transférer les appels authentiques",
    transfer_whitelisted: "Transférer uniquement les appels de la liste blanche",
    blockAI: "Bloquer les appels IA",
    blockAI_desc: "Bloquer complètement tous les appels générés par l'IA",
    blockSpam: "Bloquer les appels spam/promotionnels",
    blockSpam_desc: "Bloquer complètement tous les appels spam/promotionnels",
    expecting: "Appels attendus",
    expecting_desc:
      "Si vous attendez un appel d'un service ou d'une personne, veuillez fournir des détails.",
    view_all: "Voir tout",
  },
  expectedCallsScreen: {
    search: "Rechercher un appel attendu",
    expected: "Appel attendu ",
    caller_name: "Nom de l'appelant",
    caller_name_example: "Ex. Appel BMW",
    reason: "Raison",
    reason_example:
      "Ex. J'attends un appel de la concession automobile BMW. J'ai visité leur magasin à Paris la semaine dernière et ils ont dit qu'ils me contacteraient.",
    add: "Ajouter",
  },
  whitelistBlacklistScreen: {
    connect_google: "Connecter le répertoire Google",
    connect_apple: "Connecter le répertoire Apple",
    or: "ou",
    add_manually: "Ajouter manuellement",
    add_manually_desc: "Ajouter des numéros à la liste blanche/noire manuellement",
    whitelist_numbers: "Numéros de la liste blanche ",
    blacklist_numbers: "Numéros de la liste noire ",
  },
  whitelistScreen: {
    search: "Rechercher un nom ou un numéro",
    add: "Ajouter",
  },
  call_list: {
    empty_state_title: "Aucun appel trouvé",
    empty_state_content: "wow si vide",
  },
  signUpScreen: {
    welcome: "Bienvenue à",
    title: "ORiN",
    intro_one: "Profitez d'une assistance téléphonique",
    intro_two: "illimitée 24 x 7",
    google_oauth: "Connexion avec Google",
  },

  ...demoFr,
}

export default fr
