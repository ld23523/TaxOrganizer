<template>
    <div class="media-item" @click="$emit('click', { name, icon, category, date, clicks })">
      <div class="icon">
        <img :src="icon" alt="Media Icon" />
      </div>
      <p class="name">{{ name }}</p>
      <p class="category">{{ category }}</p>
        <p class="date">{{ date ? new Date(date).toLocaleDateString() : 'No Date Available' }}</p>
    </div>
  </template>
  
  <script setup>
  defineProps({
    name: String, // Name of the folder or media
    icon: String, // Path to the icon
    category: String, // Category of the media
    date: Date, // Date of creation or upload
    clicks: Number, // Number of clicks or views
  });
  </script>
  
  <style scoped>
  .media-item {
    width: 150px;
    height: 150px;
    border-radius: 12px;
    background-color: #f9f9f9;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin: 10px;
    padding: 10px;
    transition: transform 0.2s, box-shadow 0.2s;
    cursor: pointer;
  }
  
  .media-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
  }
  
  .media-item .icon img {
    width: 60px;
    height: 60px;
    object-fit: contain;
  }
  
  .media-item .name {
    margin-top: 10px;
    font-size: 14px;
    text-align: center;
    color: #333;
    word-wrap: break-word;
  }

  .media-item .category {
    font-size: 12px;
    color: #666;
  }

  .media-item .date {
    font-size: 12px;
    color: #999;
  }
  </style>