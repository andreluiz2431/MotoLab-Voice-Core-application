package com.motolab.app

import android.Manifest
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

    @PluginMethod
    fun startCapture(call: PluginCall) {
        if (hasPermission("bluetoothConnect") && hasPermission("recordAudio")) {
            // Permissions already granted, proceed with capture
            call.resolve()
        } else {
            // Request permissions
            requestAllPermissions(call, "permissionCallback")
        }
    }

    @PluginMethod
    fun stopCapture(call: PluginCall) {
        // Implement stop capture logic
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
