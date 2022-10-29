import React, { useEffect } from 'react'
import {
  AccountsText,
  AvailableMoney,
  AvailableMoneyLabel,
  ButtonsWrapper,
  HomeContainer,
  MoneySummaryContainer,
  WelcomeContainer,
  WelcomeSubtext,
  WelcomeText,
} from './HomeElements'
import Rive, { RiveRef } from 'rive-react-native'
import AudioRecorder from '../AudioRecorder/AudioRecorder'

const Home = () => {
  // ANIMATION HANDLERS ======================================================
  const riveRef = React.useRef<RiveRef>(null)
  useEffect(() => {
    setTimeout(() => {
      riveRef.current?.setInputState('State Machine 1', 'isLimited', false)
    }, 100)
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
        url="https://firebasestorage.googleapis.com/v0/b/nlpbanking.appspot.com/o/robot.riv?alt=media&token=8eb5488a-cceb-4f45-b56e-3b02a937e222"
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
