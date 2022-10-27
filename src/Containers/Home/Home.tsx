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
import { PicovoiceManager } from '@picovoice/picovoice-react-native'
const Home = () => {
  const animation = useRef(null)
  let wakeWordCallback = () => {
    // wake word detected
    console.log('I AM AWAKEEEEEE')
  }

  let inferenceCallback = inference => {
    if (inference.isUnderstood) {
      let intent = inference.intent
      let slots = inference.slots
      // take action based on inferred intent and slot values
    } else {
      // handle unsupported commands
    }
  }
  const initVoiceManager = async () => {
    let picovoiceManager = await PicovoiceManager.create(
      '6NTd3CjGFOc4pnmkXqgxLS41JxjGFyRAjxYHeOQbRDmeBQ5L6oOR2g==',
      '../../../assets/picoVoice/jarvis_android.rhn',
      wakeWordCallback,
      '../../../assets/picoVoice/alarm_android.ppn',
      inferenceCallback,
    )
    console.log(picovoiceManager)
  }
  useEffect(() => {
    initVoiceManager()
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
        <KeyboardSVG width={30} height={30} />
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
        <MicSVG width={30} height={30} />
      </ButtonsWrapper>
    </HomeContainer>
  )
}

export default Home
