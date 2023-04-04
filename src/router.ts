import { createRouter, createWebHistory } from 'vue-router'
import Home from './components/Pages/Home.vue'
import MyList from './components/Pages/Bookmark.vue'
import About from './components/Pages/About.vue'
import BusinessDetail from './components/Reusables/BusinessDetail.vue'
import Profile from './components/Pages/Profile.vue'
import Payment from './components/Pages/Payment.vue'
import HomeHawker from './components/Pages/HomeHawker.vue';

const routes = [
  {
    path: '/Home',
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
  },
  {
    path: '/Hawker',
    component: HomeHawker,
  }
]

export default createRouter({
  history: createWebHistory(),routes
})