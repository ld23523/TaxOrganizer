<script setup>
import loginPage from './components/loginPage.vue'
</script>

<template>
  <div class = "logo">
    <a href="https://cdn0.iconfinder.com/data/icons/taxes-19/512/tax_collector-building-tax-finance-business-money-accounting-512.png" target="_blank">
      <img src="https://cdn0.iconfinder.com/data/icons/taxes-19/512/tax_collector-building-tax-finance-business-money-accounting-512.png" class="logo" alt="Vite logo" />
    </a>
   
  </div>
  
  <router-view />
</template>

<style scoped>
.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
  
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
