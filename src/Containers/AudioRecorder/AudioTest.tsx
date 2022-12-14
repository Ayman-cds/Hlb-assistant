import React, { Component } from 'react'
import { StyleSheet, View, Button } from 'react-native'
import { Buffer } from 'buffer'
import Permissions from 'react-native-permissions'
import Sound from 'react-native-sound'
import AudioRecord from 'react-native-audio-record'
import { ref, uploadBytes } from 'firebase/storage'
import { storage } from '@/firebase.config'

export default class AudioTest extends Component {
  sound = null
  state = {
    audioFile: '',
    recording: false,
    loaded: false,
    paused: true,
  }

  async componentDidMount() {
    await this.checkPermission()

    const options = {
      sampleRate: 16000,
      channels: 1,
      bitsPerSample: 16,
      wavFile: 'test.wav',
    }

    AudioRecord.init(options)

    AudioRecord.on('data', data => {
      const chunk = Buffer.from(data, 'base64')
      console.log('chunk size', chunk.byteLength)
      // do something with audio chunk
    })
  }

  checkPermission = async () => {
    const p = await Permissions.check('microphone')
    console.log('permission check', p)
    if (p === 'authorized') return
    return this.requestPermission()
  }

  requestPermission = async () => {
    const p = await Permissions.request('microphone')
    console.log('permission request', p)
  }

  start = () => {
    console.log('start record')
    this.setState({ audioFile: '', recording: true, loaded: false })
    AudioRecord.start()
  }

  text = async () => {
    const req = { text: 'how safe is it to use e-statement lahhhhhh' }
    const response = await fetch('http://10.81.176.186:3000/response', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(req),
    })
    const res = await response.json()

    console.log('RES ---->>>>>', res)
  }
  stop = async () => {
    if (!this.state.recording) return
    console.log('stop record')
    let audioFile = await AudioRecord.stop()
    this.uploadAudio(`file:///${audioFile}`)
    console.log('audioFile', audioFile)
    this.setState({ audioFile, recording: false })
  }

  load = () => {
    return new Promise((resolve, reject) => {
      if (!this.state.audioFile) {
        return reject('file path is empty')
      }

      this.sound = new Sound(this.state.audioFile, '', error => {
        if (error) {
          console.log('failed to load the file', error)
          return reject(error)
        }
        this.setState({ loaded: true })
        return resolve()
      })
    })
  }

  play = async () => {
    if (!this.state.loaded) {
      try {
        await this.load()
      } catch (error) {
        console.log(error)
      }
    }

    this.setState({ paused: false })
    Sound.setCategory('Playback')

    this.sound.play(success => {
      if (success) {
        console.log('successfully finished playing')
      } else {
        console.log('playback failed due to audio decoding errors')
      }
      this.setState({ paused: true })
      // this.sound.release();
    })
  }

  pause = () => {
    this.sound.pause()
    this.setState({ paused: true })
  }
  getAudioBlob = async (imageUrl: string) => {
    const response = await fetch(imageUrl)
    const blob = await response.blob()
    return blob
  }
  uploadAudio = async (audioUri: string) => {
    let audioFileName = '4' + audioUri.substring(audioUri.lastIndexOf('/') + 1)
    console.log(audioFileName)
    const reference = ref(storage, audioFileName)
    const imageBlob = await this.getAudioBlob(audioUri)
    try {
      const response = await uploadBytes(reference, imageBlob)
      console.log(response)
    } catch (error) {
      console.error(error)
    }
  }
  render() {
    const { recording, paused, audioFile } = this.state
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Button onPress={this.start} title="Record" disabled={recording} />
          <Button onPress={this.stop} title="Stop" disabled={!recording} />
          {paused ? (
            <Button onPress={this.play} title="Play" disabled={!audioFile} />
          ) : (
            <Button onPress={this.pause} title="Pause" disabled={!audioFile} />
          )}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
})
