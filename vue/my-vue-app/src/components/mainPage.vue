<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import FileUpload from './FileUpload.vue';
import CreateFolder from './CreateFolder.vue';
import Search from './Search.vue';
import MediaItem from './MediaItem.vue';
import Contact from "./contact.vue";
import ChatBot from './chatBot.vue';

const showSidebar = ref(true);
const showDropdown = ref(false);
const popupType = ref('');
const selectedSection = ref('home'); // Default selected section
const thumbnailIcon = {
  videos: '/videoIcon.jpg',   
  documents: '/documentIcon.jpg',
  audio: '/audioIcon.jpg',
  gallery: "`http://localhost:3000${selectedMedia.path}`",
  folder: '/folderIcon.jpg'
  
};

const handleClick = (section) => {
  
  selectedSection.value = section;
};
function toggleSidebar() {
  showSidebar.value = !showSidebar.value
}

function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}
function openPopup(type) {
  popupType.value = type;
  showDropdown.value = false; // Close dropdown when opening popup
}

function closePopup() {
  popupType.value = '';
}

// Media items fetched from the backend
const allMediaItems = ref([]); // Store all media items
const mediaItems = ref([]);
const selectedMedia = ref(null);
const formattedDate = ref(''); // Store the formatted date for the input field
const sortOption = ref('date'); // Default sort option

// Fetch media items from the backend
async function fetchMediaItems() {
  try {
    console.log('Fetching media items for folder:', currentFolder.value); // Debugging
    const response = await axios.get(`http://localhost:3000/api/media?folder=${currentFolder.value}`);
    console.log('Media items fetched:', response.data); // Debugging
    allMediaItems.value = response.data; // Assign the fetched data to the mediaItems array
    mediaItems.value = response.data; // Initialize mediaItems with all items
    sortMediaItems(); // Sort the items after fetching
  } catch (error) {
    console.error('Error fetching media items:', error);
  }
}

function sortMediaItems() {
  if (sortOption.value === 'date') {
    mediaItems.value.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date (newest first)
  } else if (sortOption.value === 'clicks') {
    mediaItems.value.sort((a, b) => b.clicks - a.clicks); // Sort by clicks (highest first)
  }
}

function updateMediaItems(filteredItems) {
  mediaItems.value = filteredItems; // Update the media items based on the search query
}

async function updateMediaDetails() {
  try {
    // Convert the formatted date back to a valid ISO string
    if (formattedDate.value) {
      const parsedDate = new Date(formattedDate.value);
      if (isNaN(parsedDate.getTime())) {
        throw new Error('Invalid date format');
      }
      selectedMedia.value.date = parsedDate.toISOString();
    } else {
      selectedMedia.value.date = null; // Set to null if no date is provided
    }

    const response = await axios.patch(`http://localhost:3000/api/media/${selectedMedia.value._id}`, selectedMedia.value);
    if (response.data.success) {
      alert('Media item updated successfully.');

      // Update the corresponding item in the mediaItems array
      const index = mediaItems.value.findIndex((item) => item._id === selectedMedia.value._id);
      if (index !== -1) {
        mediaItems.value[index] = response.data.mediaItem;
      }

      closeDisplay();
    } else {
      alert('Failed to update media item.');
    }
  } catch (error) {
    console.error('Error updating media item:', error);
    alert('An error occurred while updating the media item.');
  }
}

async function openMediaDetails(media) {
  try {
    // Increment clicks in the backend
    const response = await axios.patch(`http://localhost:3000/api/media/${media._id}/click`);
    if (response.data.success) {
      // Update the selected media item with the updated data from the backend
      selectedMedia.value = response.data.mediaItem;
      formattedDate.value = new Date(selectedMedia.value.date).toISOString().split('T')[0]; // Format the date for the input field

      // Update the corresponding item in the mediaItems array
      const index = mediaItems.value.findIndex((item) => item._id === media._id);
      if (index !== -1) {
        mediaItems.value[index] = response.data.mediaItem;
      }
    } else {
      console.error('Failed to update clicks:', response.data.message);
    }
  } catch (error) {
    console.error('Error updating clicks:', error);
  }
}

function closeDisplay() {
  selectedMedia.value = null; // Clear the selected media item
}

async function deleteMedia(id) {
  try {
    const response = await axios.delete(`http://localhost:3000/api/media/${id}`);
    if (response.data.success) {
      alert(response.data.message);
      closeDisplay();
      fetchMediaItems(); // Refresh the media grid
    } else {
      alert('Failed to delete media item.');
    }
  } catch (error) {
    console.error('Error deleting media item:', error);
    alert('An error occurred while deleting the media item.');
  }
}

// folder functionality
const currentFolder = ref('root'); // Track the current folder

async function openFolder(folderName) {
  console.log('Attempting to open folder:', folderName); // Debugging
  currentFolder.value = folderName; // Update the current folder
  console.log('Updated Current folder:', currentFolder.value); // Debugging
  await fetchMediaItems(); // Fetch the contents of the folder
}

function navigateToFolder(index) {
  const folderPath = currentFolder.value
    .split('/')
    .slice(0, index + 1)
    .join('/');
  currentFolder.value = folderPath || 'root'; // Default to 'root' if empty
  fetchMediaItems(); // Fetch media items for the selected folder
}


// Fetch media items when the component is mounted
onMounted(() => {
  fetchMediaItems();

});

</script>

<template>

  <div class="app-container">
    <!-- Toggle Button -->
    <button @click="toggleSidebar" class="toggle-button">☰</button>

    <!-- Sidebar Overlay -->
    <div :class="['sidebar', { open: showSidebar }]">
      <h2>Menu</h2>

      <!--Dropdown-->
      <div class="dropdown">
        <button class="dropdown-button" @click="toggleDropdown">➕</button>
        <div v-if="showDropdown" class="dropdown-menu">
          <p @click="openPopup('upload')">Upload File</p>
          <p @click="openPopup('createFolder')">Create Folder</p>
        </div>
      </div>

      <ul>
        
          <li><a @click.prevent="handleClick('home')">🏠 Home</a></li>
          <li><a @click.prevent="handleClick('videos')">📼 Video</a></li>
          <li><a @click.prevent="handleClick('audio')">🎧 Audio</a></li>
          <li><a @click.prevent="handleClick('documents')">📝 Document</a></li>
          <li><a @click.prevent="handleClick('gallery')">🖼️ Gallery</a></li>
          <li><a @click.prevent="handleClick('contact')">📬 Contact</a></li>

    </ul>

    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!--Header -->
      <header class="header">
        <div class="pad"></div>
        <div class="search-bar-container">
          <Search 
            :mediaItems="allMediaItems" 
            @update-media="updateMediaItems"  
            @clear-search="fetchMediaItems"
          />
        </div>
        <div class="sort-container">
          <label for="sort">Sort By:</label>
          <select id="sort" v-model="sortOption" @change="sortMediaItems">
            <option value="date">Date</option>
            <option value="clicks">Clicks/Views</option>
          </select>
        </div>
       
      </header>

    <!-- Upload Popup -->
    <div v-if="popupType === 'upload'" class="popup">
      <div class ="popup-content">
        <FileUpload :currentFolder="currentFolder" @file-uploaded="fetchMediaItems"/>
        <button class="close-button" @click="closePopup">Close</button>
      </div>
    </div>

    <!-- Create Folder Popup -->
    <div v-if="popupType === 'createFolder'" class="popup">
      <div class ="popup-content">
        <CreateFolder :currentFolder="currentFolder" @folder-created="fetchMediaItems"/>
        <button class="close-button" @click="closePopup">Close</button>
      </div>
    </div>

        <h1>{{ selectedSection.charAt(0).toUpperCase() + selectedSection.slice(1) }}</h1>
        <div class="breadcrumb" v-if="selectedSection !== 'contact'">
          <span v-for="(folder, index) in currentFolder.split('/')" :key="index">
            <a @click.prevent="navigateToFolder(index)">
              {{ folder || 'Root' }}
            </a>
            <span v-if="index < currentFolder.split('/').length - 1"> / </span>
          </span>
        </div>
        <!-- Display base on selectionSection, it has default as home-->
        <div v-if="['home','videos', 'audio', 'documents', 'gallery'].includes(selectedSection)" class="media-grid">
        
        <MediaItem
            v-for="(item, index) in mediaItems.filter(media => selectedSection === 'home' ? true : media.category === selectedSection)"
            :key="index"
            :visible="true"
            :name="item.name"
            :icon="item.type.startsWith('image') && item.path
                ? `http://localhost:3000${item.path}`
                : thumbnailIcon[item.category] || thumbnailIcon.folder"

            :date="new Date(item.date)"
            :category="item.category"
            @click="item.type === 'folder' ? (console.log('Opening folder from grid:', item.folder), openFolder(item.folder))  : openMediaDetails(item)"
        />
      </div>

      <!--Contact Section-->
      <div v-if="selectedSection === 'contact'">
          <Contact :visible="true" />
      </div>
      <ChatBot 
          :visible="true" />

      

      <!-- Media Details Pop-Up -->
      <div v-if="selectedMedia" class="media-display">
        <div class="media-container">
          <!-- Media Preview -->
          <div class="media-preview">
            <template v-if="selectedMedia.type.includes('image')">
              <img :src="`http://localhost:3000${selectedMedia.path}`" alt="Uploaded image" style="width: 100%; max-width: 500px;" />
            </template>
            <template v-else-if="selectedMedia.type.includes('pdf')">
              <iframe :src="`http://localhost:3000${selectedMedia.path}`" frameborder="0"></iframe>
            </template>
            <template v-else-if="selectedMedia.type.includes('video')">
              <video controls>
                <source :src="`http://localhost:3000${selectedMedia.path}`" :type="selectedMedia.type" />
                Your browser does not support the video tag.
              </video>
            </template>
            <template v-else-if="selectedMedia.type.includes('audio')">
              <audio controls>
                <source :src="`http://localhost:3000${selectedMedia.path}`" :type="selectedMedia.type" />
                Your browser does not support the audio tag.
              </audio>
            </template>
            <template v-else>
              <p>Preview not available for this file type.</p>
            </template>
          </div>

          <!-- Editable Fields -->
          <div class="media-details">
            <h2>Edit Media Details</h2>
            <form @submit.prevent="updateMediaDetails">
              <label>
                Name:
                <input type="text" v-model="selectedMedia.name" />
              </label>
              <label>
                Icon URL:
                <input type="text" v-model="selectedMedia.icon" />
              </label>
              <label>
                Category:
                <select v-model="selectedMedia.category">
                  <option value="video">Video</option>
                  <option value="audio">Audio</option>
                  <option value="gallery">Gallery</option>
                  <option value="documents">Document</option>
                </select>
              </label>
              <label>
                Date:
                <input type="date" v-model="formattedDate" />
              </label>
              <label>
                Clicks: {{ selectedMedia.clicks }}
              </label>
              <label>
                <button @click.prevent="deleteMedia(selectedMedia._id)">Delete</button>
              </label>
              <button type="submit">Save</button>
            </form>
            <button @click="closeDisplay" class="close-button">Close</button>
          </div>
        </div>
      </div>

    </div>
  </div>



 </template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  background-color: #2c3e50;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  z-index: 1000;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.breadcrumb {
  margin-top: 10px;
  font-size: 14px;
  color: #1abc9c;
}

.breadcrumb a {
  color: #1abc9c;
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb a:hover {
  color: #16a085;
  text-decoration: underline;
}

.search-bar-container {
  flex: 4;
  margin-right: 0px;
  align-items: center;
}

.pad {
  flex: 1;
}

.sort-container {
  flex: 1;
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: flex-start;
  gap: 10px;

}

.sort-container label {
  font-size: 14px;
  font-weight: bold;
  color: white;
}

.sort-container select {
  padding: 5px 10px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: white;
  cursor: pointer;
}

.dropdown {
  position: relative
}

.dropdown-button {
  background-color: #1abc9c;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 20px;
  cursor: pointer;
}

.dropdown-menu {
  position: absolute;
  top: -50px;
  left: 0;
  transform: translateY(100%); /* Position the menu directly below the button */
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 200px; /* Set a fixed width for the dropdown menu */
}

.dropdown-menu p {
  margin: 0;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 8px;
  color: #333; /* Set text color to dark gray for visibility */
  font-size: 14px; /* Adjust font size for better readability */
}

.dropdown-menu p:hover {
  background-color: #f0f0f0;
  border-radius: 8px;
}

.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  z-index: 2000;
}

.media-display {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  z-index: 2000;
  width: 80%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.media-container {
  display: flex;
  gap: 20px;
}

.media-preview {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  background-color: #f9f9f9;
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); /* Adjusts to fit the screen */
  gap: 50px; /* Space between items */
  justify-content: center;
  padding: 20px;
  width: 95%;
}

.media-preview img,
.media-preview video,
.media-preview iframe {
  max-width: 100%;
  max-height: 400px;
  border-radius: 8px;
}

.media-preview p {
  font-size: 14px;
  color: #555;
}

/* Media Info Section */
.media-details {
  max-width: 400px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.media-details label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
  color: #333;
}

.media-details input[type="text"],
.media-details input[type="date"],
.media-details select {
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  box-sizing: border-box;
}

.media-details button {
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

.close-button {
  margin-top: 10px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.close-button:hover {
  background-color: #c0392b;
}

.app-container {
  position: flex;
  width: 100vw;
  height: 100vh;
  background-color: #e6f0ff;
  overflow-x: hidden;
}

/* Toggle Button */
.toggle-button {
  position: fixed;
  top: 90px;
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
  top: 70px;
  left: 0;
  width: 0px;
  height: 100%;
  background-color: #2c3e50;
  color: white;
  padding: 80px 20px 20px;
  box-shadow: 2px 0 10px rgba(0,0,0,0.2);
  transform: translateX(-100%);
  transition: transform 0.3s ease-in-out;
  z-index: 1050;
  overflow: hidden
}

.sidebar.open {
  width: 220px;
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

.sidebar ul li {
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
  flex: 1; /* Take up remaining space */
  padding: 40px;
  margin-top: 70px; /* Space for header */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  transition: margin-left 0.3s ease-in-out; /* Smooth transition */
}

.sidebar.open + .main-content {
  margin-left: 220px; /* Push content when sidebar is open */
}

.upload-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.popup-content {
  max-height: 80vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

</style>
