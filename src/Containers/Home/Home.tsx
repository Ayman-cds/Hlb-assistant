import { View, Text } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import {
  AccountsText,
  AvailableMoney,
  AvailableMoneyLabel,
  ButtonAnimationWrapper,
  ButtonsWrapper,
  HomeContainer,
  MoneySummaryContainer,
  WelcomeContainer,
  WelcomeSubtext,
  WelcomeText,
} from './HomeElements'
import RobotAnimation from '../../Assets/Home/robot.json'
import audioButton from '../../Assets/Home/audioButton.json'
import LottieView from 'lottie-react-native'
import KeyboardSVG from '../../Assets/Home/keyboard.svg'
import MicSVG from '../../Assets/Home/microphone.svg'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '@/firebase.config'
import Rive, { RiveRef } from 'rive-react-native'
import { Buffer } from 'buffer'
import Permissions from 'react-native-permissions'
import Sound from 'react-native-sound'
import AudioRecord from 'react-native-audio-record'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from '@/firebase.config'
import { useNavigation } from '@react-navigation/native'
// import axios from 'axios'

const Home = () => {
  const navigation = useNavigation()
  // ANIMATION HANDLERS ======================================================
  const animation = useRef(null)
  const riveRef = React.useRef<RiveRef>(null)
  const [buttonState, setButtonState] = useState({
    size: 70,
    speed: 0.5,
  })
  useEffect(() => {
    riveRef.current?.setInputState('State Machine 1', 'isLimited', false)
    audioSetUp()
  }, [])

  // VOICE CAPTURE ========================================================

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
    navigation.navigate('Chat')
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

    console.log('RES ---->>>>>', res)
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

  const onPressInHandler = () => {
    startAudioCapture()
    setButtonState({ size: 100, speed: 3 })
  }

  const onPressOutHandler = () => {
    stopAudioCapture()
    setButtonState({ size: 70, speed: 0.5 })
  }

  return (
    <HomeContainer>
      <AccountsText>Accounts</AccountsText>
      <MoneySummaryContainer>
        <AvailableMoney>RM 20,000.23</AvailableMoney>
        <AvailableMoneyLabel>Available to spend</AvailableMoneyLabel>
      </MoneySummaryContainer>
      <Rive
        autoplay
        ref={riveRef}
        url="https://firebasestorage.googleapis.com/v0/b/nlpbanking.appspot.com/o/hero_bot%20(2).riv?alt=media&token=908c2263-2e16-4fc3-9f25-db2ce1486c95"
        style={{ width: 400, height: 400 }}
      />
      <WelcomeContainer>
        <WelcomeText>Welcome back Ayman</WelcomeText>
        <WelcomeSubtext>How can I help you today</WelcomeSubtext>
      </WelcomeContainer>
      <ButtonsWrapper>
        {/* <KeyboardSVG width={30} height={30} /> */}
        <ButtonAnimationWrapper
          {...{
            shadowColor: '#000',
            onPressIn: onPressInHandler,
            onPressOut: onPressOutHandler,
          }}
        >
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
        </ButtonAnimationWrapper>
        {/* <MicSVG width={30} height={30} /> */}
      </ButtonsWrapper>
    </HomeContainer>
  )
}

export default Home

