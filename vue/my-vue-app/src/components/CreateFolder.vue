<template>
  <div>
    <h2>Create Folder</h2>
    <form @submit.prevent="createFolder">
      <label>
        Folder Name:
        <input type="text" v-model="folderName" placeholder="Folder Name" />
      </label>
      <label>
        Icon URL:
        <input type="text" v-model="icon" placeholder="Icon URL (optional)" />
      </label>
      <label>
        Category:
        <select v-model="category">
          <option value="videos">Videos</option>
          <option value="audio">Audio</option>
          <option value="gallery">Gallery</option>
          <option value="documents">Documents</option>
        </select>
      </label>
      <label>
        Date:
        <input type="date" v-model="date" />
      </label>
      <button type="submit">Create</button>
    </form>
    <p v-if="message">{{ message }}</p>
  </div>
</template>
  
  <script>
  import axios from 'axios';

  export default {
    props: ['currentFolder'], // Accept currentFolder as a prop from the parent component
    
    data() {
      return {
        folderName: '',
        parentFolder: '',
        icon: '',
        category: '',
        date: '',
        message: '',
      };
    },
    methods: {
      async createFolder() {
        if (!this.folderName) {
          this.message = 'Please enter a folder name.';
          return;
        }
        try {
          console.log('creating folder in: ', this.currentFolder);
          const response = await axios.post('http://localhost:3000/api/folders', { 
            folderName: this.folderName,
            parentFolder: this.currentFolder || 'root', // Use the currentFolder prop as the parent folder
            icon: this.icon || '/icons/folder-icon.png',
            category: this.category,
            date: this.date || new Date().toISOString(), 
          });

          this.message = response.data.message;
          this.$emit('folder-created', response.data.folder); // Emit the created folder data to the parent component
        } catch (err) {
          this.message = 'Error creating folder: ' + err.message;
        }
      },
    },
  };
  </script>

<style scoped>
/* Container styling */
div {
  max-width: 400px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Form labels */
label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
  color: #333;
}

/* Input fields */
input[type="text"],
input[type="date"] {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  box-sizing: border-box;
}

select {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  box-sizing: border-box;
}

/* Button styling */
button {
  width: 100%;
  padding: 10px;
  background-color: #1abc9c;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #16a085;
}

/* Message styling */
p {
  margin-top: 10px;
  font-size: 14px;
  color: #555;
}
</style>