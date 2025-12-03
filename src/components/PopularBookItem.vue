<template>
  <div class="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition" @click="openDetail">
    <div class="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
      {{ index + 1 }}
    </div>
    <div class="flex-shrink-0 w-16 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded overflow-hidden relative">
      <img :src="book.cover" :alt="book.title" class="w-full h-full object-cover">
    </div>
    <div class="flex-1 min-w-0">
      <h4 class="font-semibold text-gray-800 truncate">{{ book.title }}</h4>
      <p class="text-gray-600 text-sm">{{ book.author }}</p>
      <div class="flex items-center space-x-4 mt-2">
        <div class="flex items-center space-x-1">
          <StarRating :rating="book.rating" :readonly="true"></StarRating>
          <span class="text-sm text-gray-600">{{ book.rating }}</span>
        </div>
        <span class="text-sm text-gray-500">{{ book.genre }}</span>
        <span class="text-sm text-indigo-600 font-semibold">{{ book.heat }}° 热度</span>
      </div>
    </div>
    <div class="text-right">
      <p class="text-sm text-gray-500">{{ book.reviews }} 人评价</p>
      <p class="text-xs text-gray-400 mt-1">{{ book.reading }} 人在读</p>
    </div>
  </div>
</template>

<script>
import StarRating from './StarRating.vue';
export default {
  name: 'PopularBookItem',
  components: { StarRating },
  props: ['book', 'index', 'userInfo'],
  emits: ['open-detail'],
  methods: {
    openDetail() {
      this.$emit('open-detail', this.book);
    }
  }
}
</script>