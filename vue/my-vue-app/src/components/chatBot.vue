<!-- components/ChatBot.vue -->
<template>
  <div class="chatbot-container">
    <div class="chat-header" @click="toggleChat">💬 Chat</div>
    <div class="chat-body" v-if="visible">
      <div class="messages">
        <div v-for="(msg, i) in messages" :key="i" :class="msg.role">{{ msg.text }}</div>
      </div>
      <input
        v-model="userInput"
        @keyup.enter="sendMessage"
        placeholder="Ask something..."
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const visible = ref(false);
const userInput = ref('');
const messages = ref([
  { role: 'bot', text: 'Hi! Ask me anything about this site 😊' }
]);

function toggleChat() {
  visible.value = !visible.value;
}

async function sendMessage() {
  if (!userInput.value) return;
  messages.value.push({ role: 'user', text: userInput.value });

  // Dummy AI response — replace this with API call
  const reply = await fetchReply(userInput.value);
  messages.value.push({ role: 'bot', text: reply });

  userInput.value = '';
}

// Call OpenAI or use local logic
async function fetchReply(text) {
  const lower = text.toLowerCase();

  // Media and navigation
  if (lower.includes('video')) return 'You can find videos in the Videos tab!';
  if (lower.includes('audio')) return 'You can find audios in the Audio tab!';
  if (lower.includes('gallery') || lower.includes('images')) return 'The Gallery tab shows your images in a nice layout.';
  if (lower.includes('sort')) return 'You can sort files by date or name using the dropdown menu.';

  // Upload & file operations
  if (lower.includes('upload')) return 'Click the ➕ button in the sidebar to upload a file.';
  if (lower.includes('delete')) return 'Click on a file and select delete to remove it.';
  if (lower.includes('change file name') || lower.includes('rename')) return 'Click on the file name, type the new name, and click save.';
  if (lower.includes('folder')) return 'Use the "Create Folder" button to organize your files.';
  if (lower.includes('move file')) return 'Drag and drop the file into the desired folder.';
  if (lower.includes('multiple files')) return 'Yes, you can upload multiple files at once by selecting them during upload.';

  // General settings
  if (lower.includes('log out') || lower.includes('logout')) return 'Click the user icon and choose "Log out".';
  if (lower.includes('share')) return 'Sharing options will be available in the next update!';
  if (lower.includes('profile picture')) return 'Profile editing will be supported soon.';

  // Help
  if (lower.includes('error')) return 'Try refreshing the page or checking your internet connection.';
  if (lower.includes('support') || lower.includes('help')) return 'You can contact support through the Contact tab.';
  if (lower.includes('can’t see') || lower.includes("can't see")) return 'Make sure the upload finished and try refreshing the page.';

  return "Sorry, I didn’t understand. Try asking about uploads, folders, or how to play videos!";
}
</script>

<style scoped>
.chatbot-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 280px;
  font-family: sans-serif;
  z-index: 9999;
}
.chat-header {
  background-color: #2c3e50;
  color: white;
  padding: 10px;
  border-radius: 10px 10px 0 0;
  cursor: pointer;
}
.chat-body {
  background-color: white;
  border: 1px solid #ccc;
  max-height: 300px;
  overflow-y: auto;
  border-radius: 0 0 10px 10px;
  padding: 10px;
}
.messages {
  font-size: 14px;
  margin-bottom: 10px;
}
.user {
  text-align: right;
  color: #2980b9;
  margin: 4px 0;
}
.bot {
  text-align: left;
  color: #2c3e50;
  margin: 4px 0;
}
input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>
