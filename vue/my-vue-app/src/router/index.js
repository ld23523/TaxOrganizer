import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    component: () => import('../components/loginPage.vue')
  },
  {
    path: '/mainPage',
    component: () => import('../components/mainPage.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
