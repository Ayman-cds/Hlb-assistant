import { View, Text, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import {
  ChatContainer,
  ChatTitle,
  InputContainer,
  StyledTextInput,
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

const SendButton = () => (
  <TouchableOpacity {...{}}>
    <Text {...{ color: 'black' }}>Send</Text>
  </TouchableOpacity>
)

const ChatInput = () => {
  return (
    <InputContainer>
      <StyledTextInput />
    </InputContainer>
  )
}

const Chat = () => {
  const messageRef = collection(db, 'nlpReplies')
  const q = query(messageRef, orderBy('createdAt', 'desc'), limit(20))
  const [fbMessages] = useCollectionData(q)
  useEffect(() => {
    if (fbMessages) {
      const allMessages = fbMessages.map((message, index) => {
        return {
          _id: index,
          text: message.text,
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

  const [messages, setMessages] = useState([])
  const onSend = async userMessage => {
    console.log(userMessage)
    const newMessageTest = {
      text: userMessage[0].text,
      createdAt: new Date(),
      userId: 1,
    }

    await addDoc(messageRef, newMessageTest)
  }

  return (
    <ChatContainer>
      <ChatTitle>HLB Assistant</ChatTitle>
      <View
        {...{ style: { borderWidth: 1, borderColor: 'white', height: '80%' } }}
      >
        <GiftedChat
          {...{
            messages,
            onSend: messages => onSend(messages),
            // renderSend: SendButton,
            user: {
              _id: 1,
            },
            // renderInputToolbar: ChatInput,
          }}
        />
      </View>
    </ChatContainer>
  )
}

export default Chat
