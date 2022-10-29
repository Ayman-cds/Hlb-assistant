import { View, Text, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Bubble,
  GiftedChat,
  IMessage,
  TMessage,
} from 'react-native-gifted-chat'
import {
  ChatContainer,
  ChatHeader,
  ChatSection,
  ChatTitle,
  InputContainer,
  InputRowContainer,
  SendButton,
  ButtonWrapper,
  StyledTextInput,
  MicIcon,
  MicButton,
  ChatBubbleContainer,
  ChatText,
  RiveContainer,
} from './ChatElements'
import { TextInput } from 'react-native-gesture-handler'
import {
  addDoc,
  collection,
  doc,
  Firestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore'
import { db } from '@/firebase.config'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import Rive, { Fit } from 'rive-react-native'
import LottieView from 'lottie-react-native'
import audioButton from '../../Assets/Home/audioButton.json'

const ChatInput = () => {
  const messageRef = collection(db, 'nlpReplies')
  const animation = useRef(null)
  const [userInput, setTextInput] = useState('')

  const onSendMessage = (userNumber: 1 | 2) => {
    sendMessageToFb(userNumber)
    sendToFlask()
  }

  const sendMessageToFb = async (userNumber: 1 | 2, inputText?: string) => {
    const newMessageTest = {
      text: inputText ? inputText : userInput,
      createdAt: new Date(),
      userId: userNumber,
    }
    await addDoc(messageRef, newMessageTest)
    setTextInput('')
  }
  const sendToFlask = async () => {
    const req = { text: userInput }
    const response = await fetch('http://10.81.176.186:3000/response', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(req),
    })
    const res = await response.json()

    console.log(res)
    sendMessageToFb(2, res.text)
  }

  useEffect(() => {
    console.log(userInput)
  }, [userInput])

  return (
    <InputRowContainer>
      <MicButton>
        <MicIcon />
      </MicButton>
      <InputContainer>
        <StyledTextInput
          {...{
            placeHolder: 'What would you like to do',
            placeholderTextColor: 'black',
            value: userInput,
            onChangeText: text => setTextInput(text),
          }}
        />
        <ButtonWrapper {...{ onPress: () => onSendMessage(1) }}>
          <SendButton />
        </ButtonWrapper>
      </InputContainer>
    </InputRowContainer>
  )
}

const ChatBubble = (message: Bubble<TMessage>['props']) => {
  useEffect(() => {
    console.log('MESSAGE =======>>>>', message.message.currentMessage.user._id)
  }, [])

  const isMe = message.message.currentMessage.user._id === 1
  return (
    <ChatBubbleContainer {...{ isMe }}>
      <ChatText {...{ isMe }}>{message.message.currentMessage.text}</ChatText>
    </ChatBubbleContainer>
  )
}
const Chat = () => {
  const messageRef = collection(db, 'nlpReplies')
  const q = query(messageRef, orderBy('createdAt', 'desc'), limit(20))
  const [fbMessages] = useCollectionData(q)
  const [messages, setMessages] = useState<IMessage[]>([])

  useEffect(() => {
    if (fbMessages) {
      const allMessages: IMessage[] = fbMessages.map((message, index) => {
        console.log(new Date(message.createdAt.seconds))
        console.log(message.createdAt)
        return {
          _id: index,
          text: message.text,
          // TODO: FIX DATE ===========================================
          // createdAt: new Date(message.createdAt.seconds),
          user: {
            _id: message.userId,
            name: 'react native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        }
      })
      setMessages(allMessages)
    }
  }, [fbMessages])

  return (
    <ChatContainer>
      <ChatHeader>
        <RiveContainer>
          <Rive
            fit={Fit.Contain}
            autoplay
            url="https://firebasestorage.googleapis.com/v0/b/nlpbanking.appspot.com/o/avatarWhiteBlue.riv?alt=media&token=684a95ae-879e-4c2c-a88a-fce1397f560b"
            style={{ width: 80, height: 80 }}
          />
        </RiveContainer>
        <ChatTitle>Tony - Personal Assistant</ChatTitle>
      </ChatHeader>
      <ChatSection>
        <GiftedChat
          {...{
            messages,
            // onSend: messages => sendMessageToFb(messages),
            showAvatarForEveryMessage: false,
            renderBubble: (message: Bubble<TMessage>['props']) => (
              <ChatBubble {...{ message: message }} />
            ),
            // renderSend: SendButton,
            user: {
              _id: 1,
            },
            renderInputToolbar: () => <ChatInput />,
          }}
        />
      </ChatSection>
    </ChatContainer>
  )
}

export default Chat
