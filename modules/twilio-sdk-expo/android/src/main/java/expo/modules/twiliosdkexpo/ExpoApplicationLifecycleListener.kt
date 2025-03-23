package expo.modules.twiliosdkexpo
import com.twiliovoicereactnative.VoiceApplicationProxy
import android.app.Application
import expo.modules.core.interfaces.ApplicationLifecycleListener

class ExpoApplicationLifecycleListener : ApplicationLifecycleListener {
    private lateinit var voiceApplicationProxy: VoiceApplicationProxy

    override fun onCreate(application: Application) {
        voiceApplicationProxy = VoiceApplicationProxy(application)
        voiceApplicationProxy.onCreate()
    }
}
