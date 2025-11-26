<template>
  <div class="container mx-auto p-4">
    <h1>书籍详情</h1>
    <p>当前书籍 ID: {{ $route.params.id }}</p>
    <button @click="$router.back()">返回</button>
  </div>
</template>
