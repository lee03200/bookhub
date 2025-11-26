<template>
  <div class="book-card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer" @click="openDetail">
    <div class="aspect-[3/4] bg-gradient-to-br from-gray-200 to-gray-300 relative">
      <img :src="book.cover" :alt="book.title" class="w-full h-full object-cover">
      <div v-if="book.isPremium && !userInfo.isVip" class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
        会员专享
      </div>
    </div>
    <div class="p-4">
      <h4 class="font-bold text-gray-800 mb-2 truncate">{{ book.title }}</h4>
      <p class="text-gray-600 text-sm mb-3">{{ book.author }}</p>
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-1">
          <StarRating :rating="book.rating" :readonly="true"></StarRating>
          <span class="text-sm text-gray-600">{{ book.rating }}</span>
        </div>
        <span class="text-sm text-gray-500">{{ book.reviews }} 评价</span>
      </div>
      <div v-if="isInShelf" class="mt-3 flex justify-center">
        <button class="text-red-500 hover:text-red-700 text-sm" @click.stop="removeFromShelf">
          移除
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import StarRating from './StarRating.vue';
export default {
  name: 'BookCard',
  components: { StarRating },
  props: ['book', 'userInfo', 'isInShelf'],
  emits: ['open-detail', 'remove-from-shelf'],
  methods: {
    openDetail() {
      this.$emit('open-detail', this.book);
    },
    removeFromShelf() {
      this.$emit('remove-from-shelf', this.book.id);
    }
  }
}
</script>

<style scoped>
.book-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
</style>