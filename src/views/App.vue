<script setup lang="ts">
import { ref } from 'vue';
import { useShopStore } from '../stores/shop'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const router = useRouter()
const store = useShopStore()

// При загрузке приложения загружаем корзину из localStorage
onMounted(() => {
  store.loadCartFromStorage()
})

// Функция для перехода на главную
const goToCatalog = () => {
  router.push('/')
}

// Функция для перехода в корзину
const goToCart = () => {
  router.push('/cart')
}
</script>

<template>
  <div class="app">
    <!-- Заголовок с навигацией -->
    <header class="header">
      <div class="header-content">
        <h1 class="logo" @click="goToCatalog">
          🛍️ МагазинPlus
        </h1>

        <!-- Навигация -->
        <nav class="nav">
          <button
            @click="goToCatalog"
            :class="{ active: $route.path === '/' }"
            class="nav-link"
          >
            Каталог
          </button>
          <button
            @click="goToCart"
            :class="{ active: $route.path === '/cart' }"
            class="nav-link"
          >
            🛒 Корзина ({{ store.totalItems }})
          </button>
        </nav>

        <!-- Информация о корзине -->
        <div class="cart-badge">
          <span class="badge-item">{{ store.totalItems }}</span>
          <span class="badge-price">{{ store.totalPrice }} ₽</span>
        </div>
      </div>
    </header>

    <!-- Основной контент -->
    <main class="main">
      <router-view />
    </main>

    <!-- Подвал -->
    <footer class="footer">
      <p>&copy; 2024 МагазинPlus. Все права защищены.</p>
    </footer>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  background: #0F172A;
  color: #F8FAFC;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  display: flex;
  flex-direction: column;
}

.header {
  background: #1E293B;
  border-bottom: 2px solid #334155;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  cursor: pointer;
  transition: color 0.2s;
  white-space: nowrap;
}

.logo:hover {
  color: #38BDF8;
}

.nav {
  display: flex;
  gap: 1rem;
  flex: 1;
  justify-content: center;
}

.nav-link {
  padding: 0.75rem 1.5rem;
  background: transparent;
  color: #94A3B8;
  border: 2px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  font-size: 1rem;
}

.nav-link:hover {
  color: #38BDF8;
  border-color: #38BDF8;
}

.nav-link.active {
  color: #F8FAFC;
  border-color: #F97316;
  background: rgba(249, 115, 22, 0.1);
}

.cart-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  background: rgba(56, 189, 248, 0.1);
  padding: 0.75rem 1rem;
  border: 1px solid #38BDF8;
  border-radius: 6px;
  min-width: 120px;
}

.badge-item {
  font-size: 0.9rem;
  color: #94A3B8;
}

.badge-price {
  font-size: 1.3rem;
  font-weight: 700;
  color: #38BDF8;
}

.main {
  flex: 1;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding-bottom: 2rem;
}

.footer {
  background: #1E293B;
  border-top: 1px solid #334155;
  padding: 2rem;
  text-align: center;
  color: #64748B;
}

/* Адаптивный дизайн для мобильных */
@media (max-width: 768px) {
  .header-content {
    flex-wrap: wrap;
    padding: 1rem;
  }

  .logo {
    font-size: 1.25rem;
  }

  .nav {
    flex: 1 1 100%;
    order: 3;
  }

  .cart-badge {
    min-width: auto;
  }
}
</style>