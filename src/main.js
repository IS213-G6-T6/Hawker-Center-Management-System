import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
import store from './store';
import firebase from 'firebase/compat/app';
import { getAuth } from 'firebase/auth';

import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

const firebaseConfig = {
    apiKey: 'AIzaSyCHGmYKenFigHv9UhK_zxq_yc4tK7y5DsE',
    authDomain: "is213-hawker.firebaseapp.com",    
    databaseURL:
        'https://is213-hawker-default-rtdb.asia-southeast1.firebasedatabase.app',
        projectId: "is213-hawker",
        storageBucket: "is213-hawker.appspot.com",
        messagingSenderId: "992772700587",
        appId: "1:992772700587:web:c6b965b962bc0f288afaee",
        measurementId: "G-FZDR6RG56S"
};

const app = firebase.initializeApp(firebaseConfig);
export const auth = getAuth(app);

createApp(App).use(router).use(store).use(Toast).mount('#app');
