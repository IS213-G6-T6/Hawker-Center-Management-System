import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import store from './store'
import firebase from 'firebase/compat/app'
import { getAuth } from 'firebase/auth'

import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const firebaseConfig = {
    apiKey: 'AIzaSyAipvvlbfDtRMXnN_UDeHl67l-XbgWc_CU',
    authDomain: 'is216-bigreddot.firebaseapp.com',
    databaseURL:
        'https://is216-bigreddot-default-rtdb.asia-southeast1.firebasedatabase.app',
    projectId: 'is216-bigreddot',
    storageBucket: 'is216-bigreddot.appspot.com',
    messagingSenderId: '627775349080',
    appId: '1:627775349080:web:b4e38d720ec5ded855c52d',
    measurementId: 'G-ZJ0T3NYPCM',
}
const app = firebase.initializeApp(firebaseConfig)
export const auth = getAuth(app)

createApp(App).use(router).use(store).use(Toast).mount('#app')
