/// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore, initializeFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyD3ML953m3CDJhYg3haAdfeRwGHqBBNCII',
  authDomain: 'nlpbanking.firebaseapp.com',
  projectId: 'nlpbanking',
  storageBucket: 'nlpbanking.appspot.com',
  messagingSenderId: '637307224293',
  appId: '1:637307224293:web:1f3a7d8356be1348ba540c',
  measurementId: 'G-80LGF3HYMJ',
}
const app = initializeApp(firebaseConfig)
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
})
