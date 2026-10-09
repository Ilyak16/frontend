<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useShopStore } from '../stores/shop'

const store = useShopStore()

// Переменные для поиска и сортировки
const searchQuery = ref<string>('')
const sortOrder = ref<string>('default') // default, asc, desc

// При загрузке страницы загружаем корзину из localStorage
onMounted(() => {
  store.loadCartFromStorage()
})

// Фильтрация товаров по поиску
const filteredProducts = computed(() => {
  let filtered = store.products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )

  // Сортировка по цене
  if (sortOrder.value === 'asc') {
    filtered = filtered.sort((a, b) => a.price - b.price)
  } else if (sortOrder.value === 'desc') {
    filtered = filtered.sort((a, b) => b.price - a.price)
  }

  return filtered
})

// Функция для добавления товара в корзину
const handleAddToCart = (productId: number) => {
  const product = store.products.find(p => p.id === productId)
  if (product) {
    store.addToCart(product)
    store.saveCartToStorage()
  }
}
</script>

<template>
  <div class="catalog">
    <!-- Панель управления (поиск и сортировка) -->
    <div class="controls">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Поиск товаров..."
        class="search-input"
      />

      <select v-model="sortOrder" class="sort-select">
        <option value="default">Сортировка</option>
        <option value="asc">Цена: по возрастанию</option>
        <option value="desc">Цена: по убыванию</option>
      </select>
    </div>

    <!-- Заголовок каталога -->
    <h1>Каталог товаров</h1>

    <!-- Сетка с товарами -->
    <div class="product-grid">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="product-card"
      >
        <!-- Изображение товара -->
        <img :src="product.image" :alt="product.name" />

        <!-- Название и описание -->
        <h3>{{ product.name }}</h3>
        <p class="description">{{ product.description }}</p>

        <!-- Цена с учетом промокода -->
        <div class="price-section">
          <span class="price" :class="{ discounted: store.promoApplied }">
            {{ store.getDiscountedPrice(product.price) }} ₽
          </span>
          <span v-if="store.promoApplied" class="old-price">
            {{ product.price }} ₽
          </span>
        </div>

        <!-- Кнопка добавления в корзину -->
        <button @click="handleAddToCart(product.id)" class="btn-add">
          Добавить в корзину
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.catalog {
  padding: 2rem;
}

.controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.search-input,
.sort-select {
  padding: 0.75rem 1rem;
  background: #1E293B;
  border: 1px solid #334155;
  border-radius: 6px;
  color: #F8FAFC;
  font-size: 0.95rem;
}

.search-input {
  flex: 1;
}

.sort-select {
  min-width: 200px;
}

.search-input:focus,
.sort-select:focus {
  outline: none;
  border-color: #38BDF8;
}

h1 {
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.product-card {
  background: #1E293B;
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 1.25rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(56, 189, 248, 0.15);
}

.product-card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 1rem;
  background: #0F172A;
}

.product-card h3 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.description {
  color: #94A3B8;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #38BDF8;
}

.price.discounted {
  color: #22D3EE;
}

.old-price {
  font-size: 0.95rem;
  color: #64748B;
  text-decoration: line-through;
}

.btn-add {
  width: 100%;
  padding: 0.75rem;
  background: #F97316;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-add:hover {
  background: #EA580C;
}
</style>