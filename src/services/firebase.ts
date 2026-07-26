import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyAYIUpN4qfqmYRp3RHS5l-C8g0lm7pyrbA',
  authDomain: 'choco-gre.firebaseapp.com',
  projectId: 'choco-gre',
  storageBucket: 'choco-gre.firebasestorage.app',
  messagingSenderId: '247302743613',
  appId: '1:247302743613:web:94dfa19eb2b8690ed7ec54',
}

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig)
export const firebaseAuth = getAuth(firebaseApp)
export const googleAuthProvider = new GoogleAuthProvider()

googleAuthProvider.setCustomParameters({ prompt: 'select_account' })
