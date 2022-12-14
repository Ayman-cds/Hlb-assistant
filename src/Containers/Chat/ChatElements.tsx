import { Image, Text, TouchableOpacity, View, Pressable } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import styled from 'styled-components'
import SendIcon from '../../Assets/Chat/send.png'
import Mic from '../../Assets/Chat/microphone.png'
interface ColorScheme {
  colorScheme: 'blue' | 'white'
}
export const ChatContainer = styled(View)<ColorScheme>`
  display: flex;
  background-color: ${props =>
    props.colorScheme === 'blue' ? '#1b2445' : 'white'};
  height: 100%;
  justify-content: space-around;
`
export const ChatHeader = styled(Pressable)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  height: 16%;
  /* border: 1px solid black; */
  margin-right: 10px;
`
export const RiveContainer = styled(View)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50%;
`
export const ChatSection = styled(View)`
  margin: 5px;
  display: flex;
  height: 82%;
  margin-bottom: 30px;
`
export const ChatTitle = styled(Text)<ColorScheme>`
  font-family: Poppins-Light;
  font-size: 20px;
  text-align: center;
  color: ${props => (props.colorScheme === 'blue' ? 'white' : 'black')};
`
export const InputRowContainer = styled(View)`
  display: flex;
  width: 95%;
  flex-direction: row;
  align-items: space-around;
  /* border: 1px solid black; */
  justify-content: space-around;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
`
export const InputContainer = styled(View)`
  border: 1px solid #c3c3c3;
  border-radius: 60px;
  width: 80%;
  align-self: center;
  justify-content: center;
  flex-direction: row;
`
export const ButtonWrapper = styled(TouchableOpacity)`
  display: flex;
  justify-content: center;
  align-items: center;
`
export const SendButton = styled(Image).attrs({
  source: SendIcon,
})`
  width: 30px;
  height: 30px;
`
export const StyledTextInput = styled(TextInput)`
  padding-left: 30px;
  color: black;
  /* border: 1px solid black; */
  width: 80%;
`

export const MicButton = styled(View)`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 60px;
  padding: 10px;
`
export const MicIcon = styled(Image).attrs({
  source: Mic,
})`
  width: 30px;
  height: 30px;
`
interface IsMe {
  isMe: boolean
  colorScheme: 'blue' | 'white'
}
export const ChatBubbleContainer = styled(View)<IsMe>`
  background-color: ${props => (props.isMe ? '#0077b6' : '#9e9e9eaa')};
  padding: 10px;
  max-width: 300px;
  border-radius: 20px;
`
export const ChatText = styled(Text)<IsMe>`
  font-family: Poppins-Light;
  color: ${props => (props.isMe ? '#caf0f8;' : '#000')};
` 