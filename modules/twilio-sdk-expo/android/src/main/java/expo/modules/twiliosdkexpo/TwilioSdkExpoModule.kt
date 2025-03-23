package expo.modules.twiliosdkexpo

import com.google.firebase.messaging.FirebaseMessaging;
import com.twilio.audioswitch.AudioDevice;
import com.twilio.voice.Call;
import com.twilio.voice.CallMessage;
import com.twilio.voice.ConnectOptions;
import com.twilio.voice.LogLevel;
import com.twilio.voice.RegistrationException;
import com.twilio.voice.RegistrationListener;
import com.twilio.voice.UnregistrationListener;
import com.twilio.voice.Voice;

import com.twiliovoicereactnative.CommonConstants.ReactNativeVoiceSDK
import com.twiliovoicereactnative.CommonConstants.ReactNativeVoiceSDKVer
import com.twiliovoicereactnative.CommonConstants.VoiceEventType
import com.twiliovoicereactnative.CommonConstants.VoiceErrorKeyError
import com.twiliovoicereactnative.CommonConstants.ScopeVoice
import com.twiliovoicereactnative.CommonConstants.VoiceEventAudioDevicesUpdated
import com.twiliovoicereactnative.CommonConstants.VoiceEventError
import com.twiliovoicereactnative.CommonConstants.VoiceEventRegistered
import com.twiliovoicereactnative.CommonConstants.VoiceEventUnregistered
import com.twiliovoicereactnative.JSEventEmitter.constructJSMap
import com.twiliovoicereactnative.ReactNativeArgumentsSerializer.serializeCall
import com.twiliovoicereactnative.ReactNativeArgumentsSerializer.serializeCallInvite
import com.twiliovoicereactnative.VoiceApplicationProxy.getCallRecordDatabase
import com.twiliovoicereactnative.VoiceApplicationProxy.getJSEventEmitter
import com.twiliovoicereactnative.VoiceApplicationProxy.getVoiceServiceApi
import com.twiliovoicereactnative.ReactNativeArgumentsSerializer.*
import com.twiliovoicereactnative.AudioSwitchManager
import com.twiliovoicereactnative.SDKLog

import android.content.Context


import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.Promise
import java.net.URL


class TwilioSdkExpoModule : Module() {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  override fun definition() = ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('TwilioSdkExpo')` in JavaScript.
    Name("TwilioSdkExpo")

    OnCreate() {
      audioSwitchManager = VoiceApplicationProxy.getAudioSwitchManager()
        .setListener { audioDevices, selectedDeviceUuid, selectedDevice ->
            val audioDeviceInfo = serializeAudioDeviceInfo(
                audioDevices,
                selectedDeviceUuid,
                selectedDevice
            )
            audioDeviceInfo.putString(VoiceEventType, VoiceEventAudioDevicesUpdated)
            getJSEventEmitter().sendEvent(ScopeVoice, audioDeviceInfo)
        }
    }

  /**
    * Invoked by React Native, necessary when passing this NativeModule to the constructor of a
    * NativeEventEmitter on the JS layer.
    * <p>
    * Invoked when a listener is added to the NativeEventEmitter.
    *
    * @param eventName The string representation of the event.
    */
    Function("addListener") { eventName: String ->
      logger.debug("VoiceModule", "Calling addListener: $eventName")
    }


  /**
    * Invoked by React Native, necessary when passing this NativeModule to the constructor of a
    * NativeEventEmitter on the JS layer.
    * <p>
    * Invoked when listeners are removed from the NativeEventEmitter.
    *
    * @param count The number of event listeners removed.
   */
    Function("removeListeners") { count: Int ->
      logger.debug("VoiceModule", "Calling removeListeners: $count")
    }


    AsyncFunction("voice_connect_android") { 
      accessToken: String, 
      twimlParams: ReadableMap, 
      notificationDisplayName: String ->

      logger.debug(".voice_connect_android()")

      val parsedTwimlParams = mutableMapOf<String, String>()
      val iterator = twimlParams.keySetIterator()
      while (iterator.hasNextKey()) {
          val key = iterator.nextKey()
          when (twimlParams.getType(key)) {
              ReadableType.Boolean -> parsedTwimlParams[key] = twimlParams.getBoolean(key).toString()
              ReadableType.Number -> parsedTwimlParams[key] = twimlParams.getDouble(key).toString()
              ReadableType.String -> parsedTwimlParams[key] = twimlParams.getString(key) ?: ""
              else -> logger.warning("Could not convert key: $key")
          }
      }

      val uuid = UUID.randomUUID()
      val callRecipient = parsedTwimlParams["to"]?.takeIf { it.isNotBlank() } ?: "Unknown"

      val connectOptions = ConnectOptions.Builder(accessToken)
          .enableDscp(true)
          .params(parsedTwimlParams)
          .callMessageListener(CallMessageListenerProxy())
          .build()

      try {
          val callRecord = CallRecord(
              uuid,
              getVoiceServiceApi().connect(
                  connectOptions,
                  CallListenerProxy(uuid, getVoiceServiceApi().serviceContext)
              ),
              callRecipient,
              parsedTwimlParams,
              CallRecord.Direction.OUTGOING,
              notificationDisplayName
          )
          getCallRecordDatabase().add(callRecord)

          // ✅ Return the serialized call record
          return@AsyncFunction serializeCall(callRecord)
      } catch (e: SecurityException) {
          throw Exception("VOICE_CONNECT_ERROR: ${e.message}")
      }
    }

    // Sets constant properties on the module. Can take a dictionary or a closure that returns a dictionary.
    Constants(
      "PI" to Math.PI
    )

    // Defines event names that the module can send to JavaScript.
    Events("onChange")

    // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
    Function("hello") {
      "Hello world! 👋"
    }

    // Defines a JavaScript function that always returns a Promise and whose native code
    // is by default dispatched on the different thread than the JavaScript runtime runs on.
    AsyncFunction("setValueAsync") { value: String ->
      // Send an event to JavaScript.
      sendEvent("onChange", mapOf(
        "value" to value
      ))
    }

    // Enables the module to be used as a native view. Definition components that are accepted as part of
    // the view definition: Prop, Events.
    View(TwilioSdkExpoView::class) {
      // Defines a setter for the `url` prop.
      Prop("url") { view: TwilioSdkExpoView, url: URL ->
        view.webView.loadUrl(url.toString())
      }
      // Defines an event that the view can send to JavaScript.
      Events("onLoad")
    }
  }
    // class constatns used throughout the module
  private const val GLOBAL_ENV = "com.twilio.voice.env"
  private const val SDK_VERSION = "com.twilio.voice.env.sdk.version"
  
  private val logger = SDKLog("TwilioSdkExpoModule")
  /*
   * audio switch manager
   */
  private lateinit var audioSwitchManager: AudioSwitchManager
  /*
   * app context
   */
  private lateinit var context: Context
  /**
   * Map of common constant score strings to the Call.Score enum.
   */
  val scoreMap: Map<String, Call.Score> = mapOf(
    CommonConstants.CallFeedbackScoreNotReported to Call.Score.NOT_REPORTED,
    CommonConstants.CallFeedbackScoreOne to Call.Score.ONE,
    CommonConstants.CallFeedbackScoreTwo to Call.Score.TWO,
    CommonConstants.CallFeedbackScoreThree to Call.Score.THREE,
    CommonConstants.CallFeedbackScoreFour to Call.Score.FOUR,
    CommonConstants.CallFeedbackScoreFive to Call.Score.FIVE
  )

  /**
   * Map of common constant issue strings to the Call.Issue enum.
   */
  private val issueMap: Map<String, Call.Issue> = mapOf(
      CommonConstants.CallFeedbackIssueAudioLatency to Call.Issue.AUDIO_LATENCY,
      CommonConstants.CallFeedbackIssueChoppyAudio to Call.Issue.CHOPPY_AUDIO,
      CommonConstants.CallFeedbackIssueEcho to Call.Issue.ECHO,
      CommonConstants.CallFeedbackIssueDroppedCall to Call.Issue.DROPPED_CALL,
      CommonConstants.CallFeedbackIssueNoisyCall to Call.Issue.NOISY_CALL,
      CommonConstants.CallFeedbackIssueNotReported to Call.Issue.NOT_REPORTED,
      CommonConstants.CallFeedbackIssueOneWayAudio to Call.Issue.ONE_WAY_AUDIO
  )




  private fun createRegistrationListener(promise: Promise): RegistrationListener {
    
    return object : RegistrationListener {
        override fun onRegistered(accessToken: String, fcmToken: String) {
            logger.log("Successfully registered FCM")
            sendJSEvent(constructJSMap(Pair(VoiceEventType, VoiceEventRegistered)))
            promise.resolve(null)
        }

        override fun onError(registrationException: RegistrationException, accessToken: String, fcmToken: String) {
            val errorMessage = reactContext.getString(
                R.string.registration_error,
                registrationException.errorCode,
                registrationException.message
            )
            logger.error(errorMessage)

            sendJSEvent(
                constructJSMap(
                    Pair(VoiceEventType, VoiceEventError),
                    Pair(VoiceErrorKeyError, serializeVoiceException(registrationException))
                )
            )

            promise.reject(errorMessage)
        }
    }
  }

  private fun createUnregistrationListener(promise: Promise): UnregistrationListener {
    return object : UnregistrationListener {
        override fun onUnregistered(accessToken: String, fcmToken: String) {
            logger.log("Successfully unregistered FCM")
            sendJSEvent(constructJSMap(Pair(VoiceEventType, VoiceEventUnregistered)))
            promise.resolve(null)
        }

        override fun onError(registrationException: RegistrationException, accessToken: String, fcmToken: String) {
            val errorMessage = reactContext.getString(
                R.string.unregistration_error,
                registrationException.errorCode,
                registrationException.message
            )
            logger.error(errorMessage)

            sendJSEvent(
                constructJSMap(
                    Pair(VoiceEventType, VoiceEventError),
                    Pair(VoiceErrorKeyError, serializeVoiceException(registrationException))
                )
            )

            promise.reject(errorMessage)
        }
    }
  }

  /**
   * Outgoing Call handling
  */


  override fun getName(): String = TAG
}
