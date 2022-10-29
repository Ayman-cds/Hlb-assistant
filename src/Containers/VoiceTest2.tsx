import { View, Text, Button, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import Voice, {
  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechErrorEvent,
} from '@react-native-community/voice'

const VoiceTest2 = () => {
  let [started, setStarted] = useState(false)
  let [results, setResults] = useState([])

  useEffect(() => {
    Voice.onSpeechError = onSpeechError
    Voice.onSpeechResults = onSpeechResults

    return () => {
      Voice.destroy().then(Voice.removeAllListeners)
    }
  }, [])

  const startSpeechToText = async () => {
    const result = await Voice.start('en-NZ')
    console.log(result)
    setStarted(true)
  }

  const stopSpeechToText = async () => {
    const result = await Voice.stop()
    console.log(result)
    setStarted(false)
  }

  const onSpeechResults = result => {
    console.log(result)
    setResults(result.value)
  }

  const onSpeechError = error => {
    console.log(error)
  }

  return (
    <View style={styles.container}>
      {!started ? (
        <Button title="Start Speech to Text" onPress={startSpeechToText} />
      ) : undefined}
      {started ? (
        <Button title="Stop Speech to Text" onPress={stopSpeechToText} />
      ) : undefined}
      {results.map((result, index) => (
        <Text key={index} style={{ color: 'black' }}>
          {result}
        </Text>
      ))}
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
export default VoiceTest2
