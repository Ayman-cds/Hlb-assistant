import React from 'react'
import { SafeAreaView, StatusBar } from 'react-native'
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import { StartupContainer } from '@/Containers'
import { useTheme } from '@/Hooks'
import { navigationRef } from './utils'
import Home from '@/Containers/Home/Home'
import Goals from '@/Containers/Goals/Goals'
import VoiceTest2 from '@/Containers/VoiceTest2'
import AudioRecorder from '@/Containers/AudioRecorder/AudioRecorder'
import AudioTest from '@/Containers/AudioRecorder/AudioTest'

export type RootStackParamList = {
  StartUp: undefined
  Home: undefined
  Goals: undefined
  Chat: undefined
  Test: undefined
}

const Stack = createStackNavigator<RootStackParamList>()
export type NavType = StackNavigationProp<RootStackParamList>

// @refresh reset
const ApplicationNavigator = () => {
  const { Layout, darkMode, NavigationTheme } = useTheme()
  const { colors } = NavigationTheme

  return (
    <SafeAreaView style={[Layout.fill, { backgroundColor: colors.card }]}>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="StartUp" component={StartupContainer} />
          <Stack.Screen name="Test" component={Home} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Goals" component={Goals} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  )
}

export default ApplicationNavigator
