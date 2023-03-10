import { createRouter, createWebHistory } from 'vue-router';
import Home from './components/Pages/Home.vue';
import LandingPage from './components/Pages/LandingPage.vue';
import MyList from './components/Pages/Bookmark.vue';
import About from './components/Pages/About.vue';
import BusinessDetail from './components/Reusables/BusinessDetail.vue';
import Profile from './components/Pages/Profile.vue';
const routes = [
    {
        path: '/Home',
        component: Home,
    },
    {
        path: '/',
        component: LandingPage,
    },
    {
        path: '/MyList',
        component: MyList
    },
    {
        path: '/About',
        component: About
    },
    {
        path: '/Profile',
        component: Profile
    },
    {
        path: '/BusinessDetail/:business_id',
        name: 'BusinessDetail',
        component: BusinessDetail,
        props: true
    }
];
export default createRouter({
    history: createWebHistory(), routes
});
