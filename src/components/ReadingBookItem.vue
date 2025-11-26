<template>
  <div class="flex-shrink-0 w-24 text-center cursor-pointer" @click="openDetail">
    <div class="aspect-[3/4] bg-gradient-to-br from-gray-200 to-gray-300 rounded mb-2 overflow-hidden relative">
      <img :src="book.cover" class="w-full h-full object-cover">
      <div v-if="book.isPremium && !userInfo.isVip" class="absolute top-1 right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded">
        会员
      </div>
    </div>
    <p class="text-xs text-gray-700 truncate">{{ book.title }}</p>
    <div class="w-full bg-gray-200 rounded-full h-1 mt-1">
      <div class="bg-indigo-600 h-1 rounded-full" :style="{width: book.progress + '%'}">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReadingBookItem',
  props: ['book', 'userInfo'],
  emits: ['open-detail'],
  methods: {
    openDetail() {
      this.$emit('open-detail', this.book);
    }
  }
}
</script>