import 'react-native-gesture-handler'
import React, { useEffect } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { store, persistor } from '@/Store'
import ApplicationNavigator from '@/Navigators/Application'
import './Translations'
import { PermissionsAndroid, Platform } from 'react-native'

const App = () => {
  const recordAudioRequest = async () => {
    if (Platform.OS == 'android') {
      // Android requires an explicit call to ask for permission
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message: '[Permission explanation]',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      )
      console.log('permission =>>>>', granted)
      return granted === PermissionsAndroid.RESULTS.GRANTED
    } else {
      // iOS will automatically ask for permission
      return true
    }
  }
  const checkPermission = async () => {
    const hasPermission = await recordAudioRequest()
    console.log('PERMISSION ===>>>> ', hasPermission)
  }
  useEffect(() => {
    recordAudioRequest()
    checkPermission()
  }, [])

  return (
    <Provider store={store}>
      {/**
       * PersistGate delays the rendering of the app's UI until the persisted state has been retrieved
       * and saved to redux.
       * The `loading` prop can be `null` or any react instance to show during loading (e.g. a splash screen),
       * for example `loading={<SplashScreen />}`.
       * @see https://github.com/rt2zz/redux-persist/blob/master/docs/PersistGate.md
       */}
      <PersistGate loading={null} persistor={persistor}>
        <ApplicationNavigator />
      </PersistGate>
    </Provider>
  )
}

export default App
