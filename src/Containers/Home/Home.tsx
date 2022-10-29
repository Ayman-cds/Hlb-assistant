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
import audioButton from '../../Assets/Home/audioButton.json'
import LottieView from 'lottie-react-native'
import Rive, { RiveRef } from 'rive-react-native'
import { Buffer } from 'buffer'
import Permissions from 'react-native-permissions'
import AudioRecord from 'react-native-audio-record'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { db, storage } from '@/firebase.config'
import { useNavigation } from '@react-navigation/native'
import { addDoc, collection } from 'firebase/firestore'
import AudioRecorder from '../AudioRecorder/AudioRecorder'
// import axios from 'axios'

const Home = () => {
  const navigation = useNavigation()
  // ANIMATION HANDLERS ======================================================
  const animation = useRef(null)

  const messageRef = collection(db, 'nlpReplies')
  const riveRef = React.useRef<RiveRef>(null)
  const [buttonState, setButtonState] = useState({
    size: 70,
    speed: 0.5,
  })
  useEffect(() => {
    riveRef.current?.setInputState('State Machine 1', 'isLimited', false)
  }, [])

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
        <AudioRecorder {...{ buttonSize: 80, home: true }} />
      </ButtonsWrapper>
    </HomeContainer>
  )
}

export default Home
