import { Text, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import styled from 'styled-components'

export const ChatContainer = styled(View)`
  display: flex;
  height: 100%;
`
export const ChatHeader = styled(View)`
  display: flex;
`

export const ChatTitle = styled(Text)`
  font-family: Poppins-Light;
  font-size: 20px;
  text-align: center;
  color: black;
`
export const InputContainer = styled(View)`
  border: 1px solid #c3c3c3;
  border-radius: 60px;
  width: 90%;
  align-self: center;
`
export const StyledTextInput = styled(TextInput)`
  padding-left: 30px;
  color: black;
`
