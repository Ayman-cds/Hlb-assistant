import { View, Text, Platform, PermissionsAndroid, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import AudioRecorderPlayer, {
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AVModeIOSOption,
  RecordBackType,
} from 'react-native-audio-recorder-player'
import { ref, uploadBytes } from 'firebase/storage'
import { storage } from '@/firebase.config'

const AudioRecorder = () => {
  const audioRecorderPlayer = new AudioRecorderPlayer()
  const [recording, setRecording] = useState()
  const [started, setStarted] = useState(false)
  const [currentRecordingUri, setCurrentRecordingUri] = useState<null | string>(
    null,
  )
  const [recordingState, setRecordingState] = useState<RecordBackType>()

  useEffect(() => {
    recordAudioRequest()
  }, [])
  const recordAudioRequest = async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ])

        console.log('write external stroage', grants)

        if (
          grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.READ_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.RECORD_AUDIO'] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('Permissions granted')
        } else {
          console.log('All required permissions not granted')
          return
        }
      } catch (err) {
        console.warn(err)
        return
      }
    }
  }
  const startRecording = async () => {
    const audioSet: AudioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVModeIOS: AVModeIOSOption.measurement,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
    }
    const meteringEnabled = false

    const path = 'hello.wav'
    const uri = await audioRecorderPlayer.startRecorder(
      undefined,
      audioSet,
      meteringEnabled,
    )
    console.log('START recording uri ======>>>', uri)
    setStarted(true)
    setCurrentRecordingUri(uri)
    // uploadAudio(uri)

    audioRecorderPlayer.addRecordBackListener(e => {
      setRecordingState({
        recordSecs: e.current_position,
        recordTime: audioRecorderPlayer.mmssss(Math.floor(e.current_position)),
      })
    })
  }

  const stopRecording = async () => {
    const result = await audioRecorderPlayer.stopPlayer()
    setStarted(false)
    if (currentRecordingUri) {
      uploadAudio(currentRecordingUri)
    }
    audioRecorderPlayer.removeRecordBackListener()
    setRecordingState({
      recordSecs: 0,
    })
    console.log(result)
  }

  const onStartPlay = async e => {
    console.log('onStartPlay')
    // const path = 'hello.wav'
    const msg = await audioRecorderPlayer.startPlayer()
    audioRecorderPlayer.setVolume(1.0)
    console.log(msg)
    audioRecorderPlayer.addPlayBackListener(e => {
      if (e.current_position === e.duration) {
        console.log('finished')
        audioRecorderPlayer.stopPlayer()
      }
      setRecordingState({
        currentPositionSec: e.current_position,
        currentDurationSec: e.duration,
        playTime: audioRecorderPlayer.mmssss(Math.floor(e.current_position)),
        duration: audioRecorderPlayer.mmssss(Math.floor(e.duration)),
      })
    })
  }

  const onStopPlay = async e => {
    console.log('onStopPlay')
    audioRecorderPlayer.stopPlayer()
    audioRecorderPlayer.removePlayBackListener()
  }

  const getAudioBlob = async (imageUrl: string) => {
    const response = await fetch(imageUrl)
    const blob = await response.blob()
    return blob
  }
  const uploadAudio = async (audioUri: string) => {
    let audioFileName = '4' + audioUri.substring(audioUri.lastIndexOf('/') + 1)
    console.log(audioFileName)
    const reference = ref(storage, audioFileName)
    const imageBlob = await getAudioBlob(audioUri)
    try {
      const response = await uploadBytes(reference, imageBlob)
      console.log(response)
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <View>
      {started ? (
        <Button {...{ title: 'stop', onPress: stopRecording }} />
      ) : (
        <Button {...{ title: 'start', onPress: startRecording }} />
      )}
      <Button {...{ title: 'start playing', onPress: onStartPlay }} />
      <Button {...{ title: 'stop playing', onPress: onStopPlay }} />
      <Text>AudioRecorder</Text>
    </View>
  )
}

export default AudioRecorder
