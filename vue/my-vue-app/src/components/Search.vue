<template>
    <div class>
      <input 
        type="text" 
        class="search-input" 
        v-model="query" 
        placeholder="Search files or folders" 
      />
      <button @click="filterMedia">Search</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    props: {
      mediaItems: Array, // Accept the current media items as a prop
      default: () => [], // Default value for mediaItems prop
    },
    data() {
      return {
        query: '', // Search query
      };
    },
    methods: {
      filterMedia() {
        // Ensure mediaItems is an array before filtering
        if (!Array.isArray(this.mediaItems)) {
          console.error('mediaItems is not an array:', this.mediaItems);
          return;
        }

        // Filter the media items based on the query
        const filtered = this.mediaItems.filter((item) =>
          item.name.toLowerCase().includes(this.query.toLowerCase())
        );

       // Emit the filtered results to the parent component
        this.$emit('update-media', filtered);
      },
    },
  };
</script>

<style scoped>
.search-container {
  display: flex;
  align-items: center;
  width: 100%;
}

.search-input {
  flex: 1;
  width: 80%;
  padding: 10px;
  margin-right: 5px;
  border: 1px solid #ddd;
  border-radius: 5px 0 0 5px;
  font-size: 16px;
}

button {
  background-color: #1abc9c;
  color: white;
  border: none;
  border-radius: 0 5px 5px 0;
  padding: 10px 20px;
  cursor: pointer;
}

.search-button:hover {
  background-color: #16a085;
}

</style>