import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Интерфейсы для типизации
export interface Product {
  id: number
  name: string
  price: number
  image: string
  description: string
}

export interface CartItem extends Product {
  quantity: number
}

export const useShopStore = defineStore('shop', () => {
  // ===== СОСТОЯНИЕ =====
  // Массив всех товаров в магазине
  const products = ref<Product[]>([
    { id: 1, name: 'Ноутбук ASUS', price: 75000, image: 'https://via.placeholder.com/200x150?text=Laptop', description: 'Мощный игровой ноутбук' },
    { id: 2, name: 'Клавиатура Logitech', price: 3500, image: 'https://via.placeholder.com/200x150?text=Keyboard', description: 'Механическая клавиатура' },
    { id: 3, name: 'Мышь Razer', price: 4200, image: 'https://via.placeholder.com/200x150?text=Mouse', description: 'Игровая мышь с подсветкой' },
    { id: 4, name: 'Монитор Samsung', price: 25000, image: 'https://via.placeholder.com/200x150?text=Monitor', description: '27" 144Hz монитор' },
    { id: 5, name: 'Наушники Sony', price: 8500, image: 'https://via.placeholder.com/200x150?text=Headphones', description: 'Беспроводные наушники' },
    { id: 6, name: 'Веб-камера Logitech', price: 6000, image: 'https://via.placeholder.com/200x150?text=Webcam', description: '1080p веб-камера' },
    { id: 7, name: 'SSD диск 1TB', price: 9000, image: 'https://via.placeholder.com/200x150?text=SSD', description: 'Быстрый SSD накопитель' },
    { id: 8, name: 'Роутер TP-Link', price: 4500, image: 'https://via.placeholder.com/200x150?text=Router', description: 'Wi-Fi 6 роутер' },
  ])

  // Корзина с товарами
  const cart = ref<CartItem[]>([])

  // Применен ли промокод
  const promoApplied = ref<boolean>(false)

  // ===== ВЫЧИСЛЯЕМЫЕ ЗНАЧЕНИЯ (COMPUTED) =====
  // Подсчет общей суммы корзины с учетом промокода
  const totalPrice = computed(() => {
    const sum = cart.value.reduce((total, item) => {
      const itemPrice = promoApplied.value ? item.price * 0.9 : item.price
      return total + itemPrice * item.quantity
    }, 0)
    return Math.round(sum)
  })

  // Количество товаров в корзине
  const totalItems = computed(() => {
    return cart.value.reduce((total, item) => total + item.quantity, 0)
  })

  // ===== ФУНКЦИИ =====
  // Добавление товара в корзину
  const addToCart = (product: Product) => {
    const existingItem = cart.value.find(item => item.id === product.id)

    if (existingItem) {
      // Если товар уже в корзине, увеличиваем количество
      existingItem.quantity++
    } else {
      // Если товара нет, добавляем новый элемент
      cart.value.push({ ...product, quantity: 1 })
    }
  }

  // Удаление товара из корзины полностью
  const removeFromCart = (productId: number) => {
    const index = cart.value.findIndex(item => item.id === productId)
    if (index > -1) {
      cart.value.splice(index, 1)
    }
  }

  // Уменьшение количества товара
  const decreaseQuantity = (productId: number) => {
    const item = cart.value.find(item => item.id === productId)
    if (item) {
      if (item.quantity > 1) {
        item.quantity--
      } else {
        removeFromCart(productId)
      }
    }
  }

  // Увеличение количества товара
  const increaseQuantity = (productId: number) => {
    const item = cart.value.find(item => item.id === productId)
    if (item) {
      item.quantity++
    }
  }

  // Очистка корзины и отмена промокода
  const clearCart = () => {
    cart.value = []
    promoApplied.value = false
  }

  // Применение промокода
  const applyPromoCode = () => {
    promoApplied.value = true
  }

  // Возвращаем цену с учетом промокода
  const getDiscountedPrice = (price: number) => {
    return promoApplied.value ? Math.round(price * 0.9) : price
  }

  // Загрузка корзины из localStorage
  const loadCartFromStorage = () => {
    const savedCart = localStorage.getItem('cart')
    const savedPromo = localStorage.getItem('promoApplied')

    if (savedCart) {
      cart.value = JSON.parse(savedCart)
    }

    if (savedPromo === 'true') {
      promoApplied.value = true
    }
  }

  // Сохранение корзины в localStorage
  const saveCartToStorage = () => {
    localStorage.setItem('cart', JSON.stringify(cart.value))
    localStorage.setItem('promoApplied', String(promoApplied.value))
  }

  return {
    // Состояние
    products,
    cart,
    promoApplied,

    // Вычисляемые значения
    totalPrice,
    totalItems,

    // Функции
    addToCart,
    removeFromCart,
    decreaseQuantity,
    increaseQuantity,
    clearCart,
    applyPromoCode,
    getDiscountedPrice,
    loadCartFromStorage,
    saveCartToStorage,
  }
})