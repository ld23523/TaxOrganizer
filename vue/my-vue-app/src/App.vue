<script setup>
import loginPage from './components/loginPage.vue'
</script>

<template>
  <div>
    <div class="background">
    <div class="music-note note1">🎵</div>
    <div class="music-note note2">🎶</div>
    <div class="music-note note3">🎵</div>
    <div class="music-note note4">🎶</div>

    <router-view />
  </div>
</div>
</template>

<style scoped>
.background {
  position: relative;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: linear-gradient(to right, #dbeafe, #e0e7ff);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.logo {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 20px;
}
/* Logo Style */
.logo img {
  width: 120px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  transition: transform 0.3s ease;
}
.logo img:hover {
  transform: scale(1.05);
}

/* Music Note Styles */
.music-note {
  position: absolute;
  font-size: 24px;
  animation: floatNotes 10s linear infinite;
  opacity: 0.8;
}

/* Randomized Starting Positions */
.note1 { top: 80%; left: 10%; animation-delay: 0s; }
.note2 { top: 90%; left: 30%; animation-delay: 2s; }
.note3 { top: 85%; left: 60%; animation-delay: 4s; }
.note4 { top: 95%; left: 80%; animation-delay: 1s; }

/* Floating Animation */
@keyframes floatNotes {
  0% {
    transform: translateY(0) scale(1);
    opacity: 0.8;
  }
  50% {
    opacity: 1;
    transform: translateY(-300px) scale(1.2);
  }
  100% {
    transform: translateY(-600px) scale(0.8);
    opacity: 0;
  }
}
</style>
