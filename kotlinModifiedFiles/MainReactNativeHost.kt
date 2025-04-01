package com.orinapp

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactPackage
import com.twiliovoicereactnative.VoiceApplicationProxy

class MainReactNativeHost(application: Application) : VoiceApplicationProxy.VoiceReactNativeHost(application) {
    override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

    override fun getPackages(): List<ReactPackage> {
        val packages = PackageList(this).packages
        // Packages that cannot be autolinked yet can be added manually here
        // packages.add(MyReactNativePackage())
        return packages
    }

    override fun getJSMainModuleName(): String = "index"
}