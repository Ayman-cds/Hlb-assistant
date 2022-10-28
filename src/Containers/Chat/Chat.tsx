import { View, Text } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import {
  ChatContainer,
  ChatTitle,
  InputContainer,
  StyledTextInput,
} from './ChatElements'
import { TextInput } from 'react-native-gesture-handler'

const ChatInput = () => {
  return (
    <InputContainer>
      <StyledTextInput />
    </InputContainer>
  )
}

const Chat = () => {
  const [messages, setMessages] = useState([])

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    )
  }, [])
  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ])
  }, [])
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
            user: {
              _id: 1,
            },
            renderInputToolbar: ChatInput,
          }}
        />
      </View>
    </ChatContainer>
  )
}

export default Chat
