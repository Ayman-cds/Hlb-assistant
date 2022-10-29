import { Pressable, Text, TouchableOpacity, View } from 'react-native'
import styled from 'styled-components'

export const HomeContainer = styled(View)`
  display: flex;
  height: 100%;
  justify-content: space-around;
  align-items: center;
`
export const MoneySummaryContainer = styled(View)`
  display: flex;
  height: 10%;
  margin-top: 20px;
`
export const AvailableMoney = styled(Text)`
  font-size: 32px;
  text-align: center;
  color: black;
  font-family: Poppins-Light;
`
export const AvailableMoneyLabel = styled(Text)`
  font-size: 12px;
  color: #b3b3b3;
  text-align: center;
  font-family: Poppins-Light;
`
export const AccountsText = styled(Text)`
  font-family: Poppins-Light;
  font-size: 20px;
  color: black;
  text-align: center;
`
export const RobotAnimation = styled(View)``

export const WelcomeContainer = styled(View)`
  display: flex;
  width: 70%;
`
export const WelcomeText = styled(Text)`
  display: flex;
  font-family: Poppins-Light;
  color: #a6a6a6;
  text-align: center;
  font-size: 22px;
`
export const WelcomeSubtext = styled(Text)`
  font-size: 32px;
  color: black;
  font-family: Poppins-Regular;
  text-align: center;
`
export const ButtonAnimationWrapper = styled(TouchableOpacity)`
  border-radius: 60px;
`

export const ButtonsWrapper = styled(View)`
  transition: 0.5s all;
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-around;
  align-items: center;
`
