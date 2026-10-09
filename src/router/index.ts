import { createRouter, createWebHistory } from 'vue-router'
import Catalog from '../views/Catalog.vue'
import Cart from '../views/Cart.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
    path: '/',
    name: 'Catalog',
    component: Catalog
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart
  }
  ],
})

export default router
