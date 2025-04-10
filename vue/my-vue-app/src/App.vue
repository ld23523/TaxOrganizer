<script setup>
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div>
    <a href="https://cdn0.iconfinder.com/data/icons/taxes-19/512/tax_collector-building-tax-finance-business-money-accounting-512.png" target="_blank">
      <img src="https://cdn0.iconfinder.com/data/icons/taxes-19/512/tax_collector-building-tax-finance-business-money-accounting-512.png" class="logo" alt="Vite logo" />
    </a>
   
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
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
