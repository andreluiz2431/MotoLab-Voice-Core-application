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
import org.vosk.Model
import org.vosk.Recognizer
import org.vosk.android.SpeechService
import org.vosk.android.SpeechStreamService
import org.vosk.android.RecognitionListener
import org.vosk.android.StorageService
import java.io.IOException

@CapacitorPlugin(
    name = "MotoLabPlugin",
    permissions = [
        Permission(strings = [Manifest.permission.BLUETOOTH_CONNECT], alias = "bluetoothConnect"),
        Permission(strings = [Manifest.permission.RECORD_AUDIO], alias = "recordAudio")
    ]
)
class MotoLabPlugin : Plugin(), RecognitionListener {

    private var audioManager: AudioManager? = null
    private var model: Model? = null
    private var speechService: SpeechService? = null

    override fun load() {
        super.load()
        audioManager = context.getSystemService(Context.AUDIO_SERVICE) as AudioManager
        initModel()
    }

    private fun initModel() {
        StorageService.unpack(context, "model-en-us", "model",
            { unpackedModel: Model ->
                model = unpackedModel
            }
        ) { exception: IOException ->
            bridge.sendError("Failed to unpack the model: " + exception.message)
        }
    }

    @PluginMethod
    fun startCapture(call: PluginCall) {
        if (hasPermission("bluetoothConnect") && hasPermission("recordAudio")) {
            if (model == null) {
                call.reject("Vosk model not loaded")
                return
            }
            // Permissions already granted, proceed with capture
            audioManager?.startBluetoothSco()
            audioManager?.setBluetoothScoOn(true)

            try {
                val rec = Recognizer(model, 16000.0f) // Assuming 16kHz sample rate
                speechService = SpeechService(rec, 16000.0f)
                speechService?.startListening(this)
                call.resolve()
            } catch (e: IOException) {
                call.reject("Failed to start Vosk recognizer: " + e.message)
            }

        } else {
            // Request permissions
            requestAllPermissions(call, "permissionCallback")
        }
    }

    @PluginMethod
    fun stopCapture(call: PluginCall) {
        // Implement stop capture logic
        speechService?.stop()
        speechService?.cancel()
        speechService = null
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

    override fun onResult(hypothesis: String?) {
        val data = JSObject()
        data.put("transcript", hypothesis)
        notifyListeners("onTranscription", data)
    }

    override fun onPartialResult(hypothesis: String?) {
        // Handle partial results if needed
    }

    override fun onFinalResult(hypothesis: String?) {
        // Handle final results if needed
    }

    override fun onTaskStarted() {
        // Called when recognition starts
    }

    override fun onEndOfSpeech() {
        // Called when end of speech is detected
    }

    override fun onError(exception: Exception?) {
        // Handle errors
        bridge.sendError("Vosk recognition error: " + exception?.message)
    }

    override fun onTimeout() {
        // Handle timeout
    }

    // TODO: Add getCachedFiles method
    // TODO: Add encryptForStorage/decryptFromStorage helpers
    // TODO: Add getAudioChunk for upload
}
