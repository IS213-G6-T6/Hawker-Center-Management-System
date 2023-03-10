import { createStore } from 'vuex';
import firebase from 'firebase/compat/app';
import createPersistedState from 'vuex-persistedstate';
import { useToast } from 'vue-toastification';
const toast = useToast();
export default createStore({
    plugins: [
        createPersistedState({
            storage: window.sessionStorage,
        }),
    ],
    state: {
        cat: '',
        dark: false,
        user: null,
        userBookmarks: [],
    },
    mutations: {
        updateCat(state, user_cat) {
            state.cat = user_cat;
        },
        updateDarkMode(state, user_mode) {
            state.dark = user_mode;
        },
        updateUser(state) {
            state.user = firebase.auth().currentUser;
        },
        updateUserBookmarks(state, user_bookmarks) {
            state.userBookmarks = user_bookmarks;
        },
    },
    actions: {
        commitCat({ commit }, input) {
            commit('updateCat', input);
        },
        commitDarkMode({ commit }, input) {
            commit('updateDarkMode', input);
        },
        commitUser({ commit }) {
            commit('updateUser');
        },
        commitUserBookmarks({ commit }, input) {
            commit('updateUserBookmarks', input);
        },
    },
    getters: {
        getCat: function (state) {
            return state.cat;
        },
        getDarkMode: function (state) {
            return state.dark;
        },
        getUser: function (state) {
            return state.user;
        },
        getUserBookmarks(state) {
            return state.userBookmarks;
        },
    },
});
