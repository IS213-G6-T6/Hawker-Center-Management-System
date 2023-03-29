import { createRouter, createWebHistory } from 'vue-router';
import Home from './components/Pages/Home.vue';
import MyList from './components/Pages/Bookmark.vue';
import About from './components/Pages/About.vue';
import BusinessDetail from './components/Reusables/BusinessDetail.vue';
import Profile from './components/Pages/Profile.vue';
import Payment from './components/Pages/Payment.vue'
const routes = [
    {
        path: '/',
        component: Home,
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
    },
    {
        path: '/Payment/:business_id',
        name: 'Payment',
        component: Payment,
        props: true
    }
];
export default createRouter({
    history: createWebHistory(), routes
});
