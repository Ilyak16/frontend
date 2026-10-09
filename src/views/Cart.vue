<script setup lang="ts">
import { onMounted } from 'vue'
import { useShopStore } from '../stores/shop'

const store = useShopStore()

// При загрузке страницы загружаем корзину из localStorage
onMounted(() => {
  store.loadCartFromStorage()
})

// Функция для увеличения количества
const handleIncrease = (productId: number) => {
  store.increaseQuantity(productId)
  store.saveCartToStorage()
}

// Функция для уменьшения количества
const handleDecrease = (productId: number) => {
  store.decreaseQuantity(productId)
  store.saveCartToStorage()
}

// Функция для удаления товара
const handleRemove = (productId: number) => {
  store.removeFromCart(productId)
  store.saveCartToStorage()
}

// Функция для очистки корзины
const handleClearCart = () => {
  store.clearCart()
  store.saveCartToStorage()
}

// Функция для применения промокода
const handleApplyPromo = () => {
  const promoInput = prompt('Введите промокод:')
  if (promoInput) {
    if (promoInput.toUpperCase() === 'WEB') {
      store.applyPromoCode()
      store.saveCartToStorage()
      alert('✅ Промокод WEB применен! Скидка 10%')
    } else {
      alert('❌ Неверный промокод')
    }
  }
}

// Вычисляем сумму товара с учетом промокода
const getItemTotal = (price: number, quantity: number) => {
  const discountedPrice = store.getDiscountedPrice(price)
  return discountedPrice * quantity
}
</script>

<template>
  <div class="cart-page">
    <h1>Корзина</h1>

    <!-- Если корзина пуста -->
    <div v-if="store.cart.length === 0" class="empty-cart">
      <p>🛒 Ваша корзина пуста</p>
      <p class="hint">Добавьте товары из каталога</p>
    </div>

    <!-- Если в корзине есть товары -->
    <div v-else>
      <!-- Таблица с товарами -->
      <div class="cart-items">
        <div
          v-for="item in store.cart"
          :key="item.id"
          class="cart-item"
        >
          <!-- Изображение товара -->
          <img :src="item.image" :alt="item.name" class="item-image" />

          <!-- Информация о товаре -->
          <div class="item-info">
            <h3>{{ item.name }}</h3>
            <p class="description">{{ item.description }}</p>
            <div class="price-section">
              <span class="price" :class="{ discounted: store.promoApplied }">
                {{ store.getDiscountedPrice(item.price) }} ₽
              </span>
              <span v-if="store.promoApplied" class="old-price">
                {{ item.price }} ₽
              </span>
            </div>
          </div>

          <!-- Управление количеством -->
          <div class="quantity-controls">
            <button @click="handleDecrease(item.id)" class="btn-qty">-</button>
            <span class="quantity">{{ item.quantity }}</span>
            <button @click="handleIncrease(item.id)" class="btn-qty">+</button>
          </div>

          <!-- Итого за товар -->
          <div class="item-total">
            {{ getItemTotal(item.price, item.quantity) }} ₽
          </div>

          <!-- Кнопка удаления -->
          <button @click="handleRemove(item.id)" class="btn-remove">
            ×
          </button>
        </div>
      </div>

      <!-- Секция с промокодом и итогом -->
      <div class="cart-footer">
        <!-- Применение промокода -->
        <div class="promo-section">
          <button
            @click="handleApplyPromo"
            :class="{ applied: store.promoApplied }"
            class="btn-promo"
          >
            {{ store.promoApplied ? '✓ Промокод применен' : 'Применить промокод' }}
          </button>
          <span v-if="store.promoApplied" class="promo-hint">
            (WEB - скидка 10%)
          </span>
        </div>

        <!-- Итоговая сумма -->
        <div class="total-section">
          <span>Итого к оплате:</span>
          <span class="total-price">{{ store.totalPrice }} ₽</span>
        </div>

        <!-- Кнопки действий -->
        <div class="action-buttons">
          <button @click="handleClearCart" class="btn-clear">
            Очистить корзину
          </button>
          <button class="btn-checkout">
            Оформить заказ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-page {
  padding: 2rem;
}

h1 {
  font-size: 1.75rem;
  margin-bottom: 2rem;
  font-weight: 600;
}

.empty-cart {
  text-align: center;
  padding: 4rem 2rem;
  background: #1E293B;
  border: 1px solid #334155;
  border-radius: 8px;
}

.empty-cart p {
  font-size: 1.25rem;
  color: #94A3B8;
  margin-bottom: 0.5rem;
}

.empty-cart .hint {
  font-size: 0.95rem;
  color: #64748B;
}

.cart-items {
  margin-bottom: 2rem;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: #1E293B;
  border: 1px solid #334155;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.item-image {
  width: 100px;
  height: 75px;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
}

.item-info h3 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.description {
  color: #94A3B8;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.price {
  font-size: 1.1rem;
  font-weight: 700;
  color: #38BDF8;
}

.price.discounted {
  color: #22D3EE;
}

.old-price {
  font-size: 0.9rem;
  color: #64748B;
  text-decoration: line-through;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn-qty {
  width: 36px;
  height: 36px;
  background: #334155;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  transition: background 0.2s;
}

.btn-qty:hover {
  background: #38BDF8;
  color: #0F172A;
}

.quantity {
  min-width: 2.5rem;
  text-align: center;
  font-weight: 600;
}

.item-total {
  min-width: 120px;
  text-align: right;
  font-size: 1.2rem;
  font-weight: 700;
  color: #38BDF8;
}

.btn-remove {
  width: 36px;
  height: 36px;
  background: #EF4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.5rem;
  line-height: 1;
  transition: background 0.2s;
}

.btn-remove:hover {
  background: #DC2626;
}

.cart-footer {
  background: #1E293B;
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 2rem;
}

.promo-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.btn-promo {
  padding: 0.75rem 1.5rem;
  background: #22D3EE;
  color: #0F172A;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  min-width: 200px;
}

.btn-promo:hover:not(.applied) {
  background: #06B6D4;
}

.btn-promo.applied {
  background: #10B981;
  cursor: default;
}

.promo-hint {
  color: #64748B;
  font-size: 0.9rem;
}

.total-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 0;
  border-top: 1px solid #334155;
  border-bottom: 1px solid #334155;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
  font-weight: 600;
}

.total-price {
  color: #38BDF8;
  font-size: 1.5rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
}

.btn-clear {
  flex: 1;
  padding: 0.75rem 1.5rem;
  background: #EF4444;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-clear:hover {
  background: #DC2626;
}

.btn-checkout {
  flex: 1;
  padding: 0.75rem 1.5rem;
  background: #10B981;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-checkout:hover {
  background: #059669;
}
</style>