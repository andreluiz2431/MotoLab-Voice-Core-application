package com.motolab.app

import android.Manifest
import android.media.AudioManager
import android.content.Context
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import com.getcapacitor.annotation.Permission
import com.getcapacitor.annotation.PermissionCallback

@CapacitorPlugin(
    name = "MotoLabPlugin",
    permissions = [
        Permission(strings = [Manifest.permission.BLUETOOTH_CONNECT], alias = "bluetoothConnect"),
        Permission(strings = [Manifest.permission.RECORD_AUDIO], alias = "recordAudio")
    ]
)
class MotoLabPlugin : Plugin() {

    private var audioManager: AudioManager? = null

    override fun load() {
        super.load()
        audioManager = context.getSystemService(Context.AUDIO_SERVICE) as AudioManager
    }

    @PluginMethod
    fun startCapture(call: PluginCall) {
        if (hasPermission("bluetoothConnect") && hasPermission("recordAudio")) {
            // Permissions already granted, proceed with capture
            audioManager?.startBluetoothSco()
            audioManager?.setBluetoothScoOn(true)
            call.resolve()
        } else {
            // Request permissions
            requestAllPermissions(call, "permissionCallback")
        }
    }

    @PluginMethod
    fun stopCapture(call: PluginCall) {
        // Implement stop capture logic
        audioManager?.stopBluetoothSco()
        audioManager?.setBluetoothScoOn(false)
        call.resolve()
    }

    @PermissionCallback
    private fun permissionCallback(call: PluginCall) {
        if (hasPermission("bluetoothConnect") && hasPermission("recordAudio")) {
            // Permissions granted after request, proceed with capture
            startCapture(call)
        } else {
            call.reject("Permissions denied")
        }
    }

    // TODO: Add onTranscription listener
    // TODO: Add getCachedFiles method
    // TODO: Add encryptForStorage/decryptFromStorage helpers
    // TODO: Add getAudioChunk for upload
}
