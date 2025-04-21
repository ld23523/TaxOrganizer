<template>
  <div>
    <h2>Upload File</h2>
    <form @submit.prevent="uploadFile">
      <label>
        File:
        <input type="file" accept="video/*,audio/*,image/*,.pdf" @change="handleFile" />

      </label>
      <label>
        Name:
        <input type="text" v-model="name" placeholder="File Name" />
      </label>
      <label>
        Icon URL:
        <input type="text" v-model="icon" placeholder="Icon URL" />
      </label>
      <label>
        Category:
        <select v-model="category">
          <option value="">Select a Category</option>
          <option value="videos">Videos</option>
          <option value="audio">Audio</option>
          <option value="gallery">Gallery</option>
          <option value="documents">Document</option>
        </select>
      </label>
      <label>
        Date:
        <input type="date" v-model="date" />
      </label>
      <button type="submit">Upload</button>
    </form>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      file: null,
      name: '',
      icon: '',
      category: '',
      date: '',
      message: '',
    };
  },
  methods: {
    handleFile(event) {
      this.file = event.target.files[0];
    },
    async uploadFile() {
      if (!this.file) {
        this.message = 'Please select a file to upload.';
        return;
      }

      const formData = new FormData();
      formData.append('file', this.file);
      formData.append('name', this.name);
      formData.append('icon', this.icon);
      formData.append('category', this.category);
      formData.append('date', this.date || new Date().toISOString());

      try {
        const response = await axios.post('http://localhost:3000/api/upload', formData);
        this.message = response.data.message;
        this.$emit('file-uploaded', response.data.file); // Emit the uploaded file data to the parent component
      } catch (err) {
        this.message = 'Error uploading file: ' + err.message;
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
input[type="file"],
input[type="date"],
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