package expo.modules.twiliosdkexpo

import expo.modules.core.interfaces.ReactActivityLifecycleListener 
import com.twiliovoicereactnative.VoiceActivityProxy
import android.os.Bundle
import android.content.Intent
import android.app.Activity

class ExpoActivityLifecycleListener : ReactActivityLifecycleListener {
    private lateinit var voiceActivityProxy: VoiceActivityProxy

    override fun onCreate(activity: Activity, savedInstanceState: Bundle?) {
        voiceActivityProxy = VoiceActivityProxy(activity)
        voiceActivityProxy.onCreate(savedInstanceState)
    }

    override fun onNewIntent(intent: Intent): Boolean {
        return voiceActivityProxy.onNewIntent(intent)
    }

    override fun onDestroy(activity: Activity) {
        voiceActivityProxy.onDestroy()
    }
}