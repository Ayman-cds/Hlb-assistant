import React, { useEffect, useRef, useState } from 'react'
import { Buffer } from 'buffer'
import Permissions from 'react-native-permissions'
import AudioRecord from 'react-native-audio-record'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { db, storage } from '@/firebase.config'
import { addDoc, collection } from 'firebase/firestore'
import { View, Text } from 'react-native'
import { ButtonAnimationWrapper } from '../Home/HomeElements'
import audioButton from '../../Assets/Home/audioButton.json'

import LottieView from 'lottie-react-native'
import { useNavigation } from '@react-navigation/native'
import { MicButton, MicIcon } from '../Chat/ChatElements'
const AudioRecorder = ({
  buttonSize,
  home,
}: {
  buttonSize: number
  home?: boolean
}) => {
  // VOICE CAPTURE ========================================================
  const navigation = useNavigation()
  const messageRef = collection(db, 'nlpReplies')
  const animation = useRef(null)
  const sound = null
  const [audioState, setAudioState] = useState({
    audioFile: '',
    recording: false,
    loaded: false,
    paused: true,
  })
  const audioSetUp = async () => {
    await checkPermission()
    const audioOptions = {
      sampleRate: 16000,
      channels: 1,
      bitsPerSample: 16,
      wavFile: 'test.wav',
    }

    AudioRecord.init(audioOptions)

    AudioRecord.on('data', data => {
      const chunk = Buffer.from(data, 'base64')
      console.log('chunk size', chunk.byteLength)
      // do something with audio chunk
    })
  }
  useEffect(() => {
    audioSetUp()
  }, [])

  const startAudioCapture = () => {
    console.log('start record')
    setAudioState(state => ({
      ...state,
      audioFile: '',
      recording: true,
      loaded: false,
    }))
    AudioRecord.start()
  }

  const stopAudioCapture = async () => {
    if (!audioState.recording) return
    console.log('stop record')
    let audioFile = await AudioRecord.stop()
    uploadAudio(`file:///${audioFile}`)
    console.log('audioFile', audioFile)
    setAudioState(state => ({ ...state, audioFile, recording: false }))
    if (home) {
      navigation.navigate('Chat')
    }
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
    const audioBlob = await getAudioBlob(audioUri)

    const data = new FormData()
    data.append('file', audioBlob)

    try {
      const response = await uploadBytes(reference, audioBlob)
      const downloadURL = await getDownloadURL(ref(storage, audioFileName))
      uploadUrlToFlask(downloadURL)
      console.log('RESPONSE =====>>>', downloadURL)
    } catch (error) {
      console.error(error)
    }
  }
  const uploadUrlToFlask = async (downloadURL: string) => {
    const req = { downloadURL }
    const response = await fetch('http://10.81.176.186:3000/response', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(req),
    })
    const res = await response.json()
    sendMessageToFb(1, res.translation)
    sendMessageToFb(2, res.text)
    console.log('RES ---->>>>>', res)
  }

  const sendMessageToFb = async (userNumber: 1 | 2, inputText: string) => {
    const newMessageTest = {
      text: inputText,
      createdAt: new Date(),
      userId: userNumber,
    }
    await addDoc(messageRef, newMessageTest)
  }

  // mic permission =============================================================
  const checkPermission = async () => {
    const p = await Permissions.check('microphone')
    console.log('permission check', p)
    if (p === 'authorized') return
    return requestPermission()
  }

  const requestPermission = async () => {
    const p = await Permissions.request('microphone')
    console.log('permission request', p)
  }

  // HANDLERS ===================================================================
  const [buttonState, setButtonState] = useState({
    pressed: false,
    size: buttonSize,
    speed: 0.5,
  })
  const onPressInHandler = () => {
    startAudioCapture()
    setButtonState({ pressed: true, size: buttonSize * 1.6, speed: 3 })
  }

  const onPressOutHandler = () => {
    stopAudioCapture()
    setButtonState({ pressed: false, size: 70, speed: 0.5 })
  }
  return (
    <ButtonAnimationWrapper
      {...{
        shadowColor: '#000',
        onPressIn: onPressInHandler,
        onPressOut: onPressOutHandler,
      }}
    >
      {home ? (
        <LottieView
          {...{
            ref: animation,
            speed: buttonState.speed,
            autoPlay: true,
            style: {
              width: buttonState.size,
              height: buttonState.size,
            },
            source: audioButton,
          }}
        />
      ) : (
        <MicButton
          {...{
            style: {
              backgroundColor: buttonState.pressed ? 'red' : '#d9d9d97e',
            },
          }}
        >
          <MicIcon />
        </MicButton>
      )}
    </ButtonAnimationWrapper>
  )
}

export default AudioRecorder
