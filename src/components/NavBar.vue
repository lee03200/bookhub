<template>
  <nav class="navbar">
    <div class="nav-links">
      <router-link to="/" class="nav-link">首页</router-link>
      <router-link to="/ranking" class="nav-link">排行榜</router-link>
      <router-link to="/profile" class="nav-link">我的</router-link>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background-color: #42b883;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.nav-links {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
}
.nav-link {
  color: white;
  text-decoration: none;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background 0.3s;
}
.nav-link:hover,
.nav-link.router-link-active {
  background-color: #359a6d;
}
</style>
