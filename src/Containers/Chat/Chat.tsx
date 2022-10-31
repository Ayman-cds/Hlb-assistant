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
import AudioRecorder from '../AudioRecorder/AudioRecorder'

const ChatInput = () => {
  const messageRef = collection(db, 'nlpReplies')
  const animation = useRef(null)
  const [userInput, setTextInput] = useState('')

  const onSendMessage = (userNumber: 1 | 2) => {
    sendMessageToFb(userNumber)
    sendToFlask()
  }

  const sendMessageToFb = async (
    userNumber: 1 | 2,
    inputText?: string,
    amount?: number,
  ) => {
    const newMessageTest = {
      text: inputText ? inputText : userInput,
      createdAt: new Date(),
      userId: userNumber,
      amount: amount ? amount : 0,
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
    sendMessageToFb(2, res.text, res.amount)
  }

  useEffect(() => {
    console.log(userInput)
  }, [userInput])

  return (
    <InputRowContainer>
      <AudioRecorder {...{ buttonSize: 50 }} />
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
    console.log('MESSAGE =======>>>>', message)
  }, [])

  const isMe = message.message.currentMessage.user._id === 1
  return (
    <ChatBubbleContainer {...{ isMe }}>
      {message.message.currentMessage.amount ? (
        <>
          <ChatText {...{ style: { fontFamily: 'Poppins-Bold' } }}>
            Transaction details:
          </ChatText>
          <ChatText {...{ isMe }}>
            Transfer amount: RM {message.message.currentMessage.amount}
          </ChatText>
          <ChatText {...{ isMe }}>Recipient name: Kenneth Lim</ChatText>
          <ChatText {...{ isMe }}>Transfer Date: 30/10/2022</ChatText>
          <ChatText {...{ isMe }}>AccountNumber: 3210058285</ChatText>
        </>
      ) : (
        <ChatText {...{ isMe }}>{message.message.currentMessage.text}</ChatText>
      )}
    </ChatBubbleContainer>
  )
}
const Chat = () => {
  const messageRef = collection(db, 'nlpReplies')
  const q = query(messageRef, orderBy('createdAt', 'desc'), limit(20))
  const [fbMessages] = useCollectionData(q)
  const [messages, setMessages] = useState<IMessage[]>([])

  const sendMessageToFb = async (
    userNumber: 1 | 2,
    inputText?: string,
    amount?: number,
  ) => {
    const newMessageTest = {
      text: inputText ? inputText : userInput,
      createdAt: new Date(),
      userId: userNumber,
      amount: amount ? amount : 0,
    }
    await addDoc(messageRef, newMessageTest)
  }
  const [colorReadyToChange, setColorReadyToChange] = useState(false)
  const onPressAvatar = () => {
    sendMessageToFb(
      2,
      'This may sound like a weird question but what is your favorite color?',
    )
    setColorReadyToChange(true)
  }
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
          transfer: message.amount !== 0,
          amount: message.amount,
          user: {
            _id: message.userId,
            name: 'react native',
            // avatar: 'https://placeimg.com/140/140/any',
          },
        }
      })
      console.log('LAST MESSAGE', allMessages[0].text)
      if (
        allMessages[0].text.toLowerCase().includes('blue') &&
        colorReadyToChange
      ) {
        setColorScheme('blue')
      }

      if (
        allMessages[0].text.toLowerCase().includes('white') &&
        colorReadyToChange
      ) {
        setColorScheme('white')
      }
      setMessages(allMessages)
    }
  }, [fbMessages])
  const [colorScheme, setColorScheme] = useState<'white' | 'blue'>('white')
  return (
    <ChatContainer {...{ colorScheme }}>
      <ChatHeader {...{ onPress: onPressAvatar }}>
        <RiveContainer>
          <Rive
            fit={Fit.Contain}
            autoplay
            url="https://firebasestorage.googleapis.com/v0/b/nlpbanking.appspot.com/o/avatarWhiteBlue.riv?alt=media&token=684a95ae-879e-4c2c-a88a-fce1397f560b"
            style={{ width: 80, height: 80 }}
          />
        </RiveContainer>
        <ChatTitle {...{ colorScheme }}>Tony - Personal Assistant</ChatTitle>
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
