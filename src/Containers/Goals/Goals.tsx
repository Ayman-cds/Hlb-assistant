import { View, Text, Dimensions } from 'react-native'
import React from 'react'

export const { width: SIZE } = Dimensions.get('window')

const Goal = () => {
  return (
    <View>
      <Text>Goal</Text>
    </View>
  )
}

export default Goal
