<script setup>
import { ref } from 'vue'

const showSidebar = ref(true)

function toggleSidebar() {
  showSidebar.value = !showSidebar.value
}
</script>

<template>
  <div class="app-container">
    <!-- Toggle Button -->
    <button @click="toggleSidebar" class="toggle-button">☰</button>

    <!-- Sidebar Overlay -->
    <div :class="['sidebar', { open: showSidebar }]">
      <h2>Menu</h2>
      <ul>
        <li><a href="#home">🏠 Home</a></li>
        <li><a href="#videos">📼 Videos</a></li>
        <li><a href="#audio">🎧 Audio</a></li>
        <li><a href="#gallery">🖼️ Gallery</a></li>
        <li><a href="#contact">📬 Contact</a></li>
      </ul>
    </div>

    <!-- Main Content Always Full Width -->
    <div class="main-content">
      <h1>Homepage</h1>
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.app-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #e6f0ff;
  overflow-x: hidden;
}

/* Toggle Button */
.toggle-button {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1100;
  font-size: 24px;
  background-color: #2c3e50;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
}

/* Sidebar Overlay */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 220px;
  height: 100%;
  background-color: #2c3e50;
  color: white;
  padding: 80px 20px 20px;
  box-shadow: 2px 0 10px rgba(0,0,0,0.2);
  transform: translateX(-100%);
  transition: transform 0.3s ease-in-out;
  z-index: 1050;
}

.sidebar.open {
  transform: translateX(0);
}

.sidebar h2 {
  margin-bottom: 20px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  margin: 15px 0;
}

.sidebar a {
  color: white;
  text-decoration: none;
  font-size: 16px;
  transition: color 0.2s;
}

.sidebar a:hover {
  color: #1abc9c;
}

/* Full Width Content */
.main-content {
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
