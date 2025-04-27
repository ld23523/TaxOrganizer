<template>
    <div class="search-container">
      <input 
      type="text" 
      class="search-input" 
      v-model="query" 
      placeholder="Search files or folders" 
    />
    <button class="search-button" @click="filterMedia">Search</button>
    <button class="clear-button" @click="clearSearch">Clear</button>
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
      clearSearch() {
        this.query = ''; // Clear the search input
        this.$emit('clear-search'); // Emit an event to clear the search in the parent component
      },
    },
  };
</script>

<style scoped>


.search-container {
  display: flex;
  align-items: center;
  gap: 10px;

}

.search-button,
.clear-button {
  padding: 10px 16px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.search-button {
  background-color: #1abc9c;
  color: white;
}

.search-button:hover {
  background-color: #16a085;
  transform: translateY(-1px);
}

.clear-button {
  background-color: #e74c3c;
  color: white;
}

.clear-button:hover {
  background-color: #c0392b;
  transform: translateY(-1px);
}

</style>