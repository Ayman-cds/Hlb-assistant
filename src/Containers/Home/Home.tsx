import { View, Text } from 'react-native'
import React, { useEffect, useRef } from 'react'
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

const Home = () => {
  const animation = useRef(null)
  const riveRef = React.useRef<RiveRef>(null)
  const uploadNewSosRequest = async () => {
    try {
      console.log('uploading request')
      const response = await addDoc(collection(db, 'hello'), {
        name: 'ayman',
        something: 'else',
      })
      console.log('request uploaded, response ==>>', response.id)
      // storeData(response.id);
    } catch (error) {
      console.error('Error while uploading Request', error)
    }
  }

  useEffect(() => {
    // uploadNewSosRequest()
    riveRef.current?.setInputState('State Machine 1', 'isLimited', false)
  }, [])

  return (
    <HomeContainer>
      <AccountsText>Accounts</AccountsText>
      <MoneySummaryContainer>
        <AvailableMoney>RM 20,000.23</AvailableMoney>
        <AvailableMoneyLabel>Available to spend</AvailableMoneyLabel>
      </MoneySummaryContainer>
      {/* <LottieView
        {...{
          ref: animation,
          speed: 0.5,
          autoPlay: true,
          style: {
            width: 400,
            height: 400,
          },
          source: RobotAnimation,
        }}
      /> */}
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
        <ButtonAnimationWrapper {...{ shadowColor: '#000' }}>
          <LottieView
            {...{
              ref: animation,
              speed: 0.5,
              autoPlay: true,
              style: {
                width: 70,
                height: 70,
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
