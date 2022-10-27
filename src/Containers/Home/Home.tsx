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

const Home = () => {
  const animation = useRef(null)
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
    uploadNewSosRequest()
  }, [])

  return (
    <HomeContainer>
      <AccountsText>Accounts</AccountsText>
      <MoneySummaryContainer>
        <AvailableMoney>RM 20,000.23</AvailableMoney>
        <AvailableMoneyLabel>Available to spend</AvailableMoneyLabel>
      </MoneySummaryContainer>
      <LottieView
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
