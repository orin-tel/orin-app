package com.orinapp

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import android.Manifest
import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.widget.Toast
import com.twiliovoicereactnative.VoiceActivityProxy

import expo.modules.ReactActivityDelegateWrapper
// Import the NotifeeApiModule
import io.invertase.notifee.NotifeeApiModule;

class MainActivity : ReactActivity() {

  private val activityProxy = VoiceActivityProxy(this) { permission ->
    when (permission) {
        Manifest.permission.RECORD_AUDIO -> Toast.makeText(
            this@MainActivity,
            "Microphone permissions needed. Please allow in your application settings.",
            Toast.LENGTH_LONG
        ).show()
        Manifest.permission.BLUETOOTH_CONNECT ->
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                Toast.makeText(
                    this@MainActivity,
                    "Bluetooth permissions needed. Please allow in your application settings.",
                    Toast.LENGTH_LONG
                ).show()
            }
        Manifest.permission.POST_NOTIFICATIONS ->
            if (Build.VERSION.SDK_INT > Build.VERSION_CODES.S_V2) {
                Toast.makeText(
                    this@MainActivity,
                    "Notification permissions needed. Please allow in your application settings.",
                    Toast.LENGTH_LONG
                ).show()
            }
    }
}

override fun onCreate(savedInstanceState: Bundle?) {
  super.onCreate(null)
  activityProxy.onCreate(savedInstanceState)
}

/**
  * Returns the name of the main component registered from JavaScript. This is used to schedule
  * rendering of the component.
  */
  override fun getMainComponentName(): String {
      return NotifeeApiModule.getMainComponent("main")
  }

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate {
    return ReactActivityDelegateWrapper(
      this,
      BuildConfig.IS_NEW_ARCHITECTURE_ENABLED,
      object : DefaultReactActivityDelegate(
        this,
        mainComponentName,
        fabricEnabled
    ){})
  }

    /**
    * Align the back button behavior with Android S
    * where moving root activities to background instead of finishing activities.
    * @see <a href="https://developer.android.com/reference/android/app/Activity#onBackPressed()">onBackPressed</a>
    */
  override fun invokeDefaultOnBackPressed() {
      if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.R) {
          if (!moveTaskToBack(false)) {
              // For non-root activities, use the default implementation to finish them.
              super.invokeDefaultOnBackPressed()
          }
          return
      }

      // Use the default back button implementation on Android S
      // because it's doing more than [Activity.moveTaskToBack] in fact.
      super.invokeDefaultOnBackPressed()
  }

  override fun onDestroy() {
    activityProxy.onDestroy()
    super.onDestroy()
  }

  override fun onNewIntent(intent: Intent?) {
    super.onNewIntent(intent)
    activityProxy.onNewIntent(intent)
  }
}