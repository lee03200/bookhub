<template>
  <div class="container mx-auto p-4">
    <h1>{{ $route.params.cat }} 分类书籍</h1>
    <button @click="$router.back()">返回</button>
  </div>
</template>
