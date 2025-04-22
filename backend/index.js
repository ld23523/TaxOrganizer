// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set up storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// MongoDB connection (replace with your connection string)
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error(err));

// MongoDB schema for media files
const mediaSchema = new mongoose.Schema({
  name: String,
  type: String, // File type (e.g., image/jpeg, video/mp4) or folder
  path: String, // File path
  folder: String, // parent folder (root or name of the folder)
  parentFolder: String, // parent folder (root or name of the folder)
  icon: String, // path to the icon for the media or folder
  date: { type: Date, default: Date.now }, // Automatically assign the current date
  clicks: { type: Number, default: 0 }, // Default number of clicks is 0
  category: { type: String, default: '' }, // Category (e.g., 'videos', 'audio', 'gallery', 'documents')
  createdAt: { type: Date, default: Date.now },
});
const Media = mongoose.model('Media', mediaSchema);

// Route to upload files
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const { name, icon, category, date, folder, parentFolder } = req.body;

    // Determine the category based on the file type
    let fileCategory = category || '';
    if (req.file.mimetype.includes('video')) {
      fileCategory = 'videos';
    } else if (req.file.mimetype.includes('audio')) {
      fileCategory = 'audio';
    } else if (req.file.mimetype.includes('image')) {
      fileCategory = 'gallery';
    } else if (req.file.mimetype.includes('pdf') || req.file.mimetype.includes('document')) {
      fileCategory = 'documents';
    }

//date: date ? new Date(date) : new Date(), // Set date to current date if not provided
//       name: name || req.file.originalname,

    console.log('Parent folder:', parentFolder);
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const file = new Media({
      name: name || req.file.originalname,
      type: req.file.mimetype,
      path: `/uploads/${req.file.filename}`, // Store the file path
      parentFolder: parentFolder || 'root',
      category: fileCategory, // Set the category based on the file type
      date: date ? new Date(date) : new Date(), // Set date to current date if not provided
      clicks: 0, // Default number of clicks is 0
      icon: req.file.mimetype.includes('image') ? '/icons/image-icon.png' : '/icons/file-icon.png', // Default icon based on file type
    });
    await file.save();
    res.json({ success: true, message: 'File uploaded successfully', file });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error uploading file', error: err.message });
  }
});

// Route to update media item properties
app.patch('/api/media/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body; // Expect updated fields in the request body

  try {
    // Validate the date
    if (updates.date) {
      const parsedDate = new Date(updates.date);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ success: false, message: 'Invalid date format.' });
      }
      updates.date = parsedDate; // Set date to current date if not provided
    } else {
      updates.date = null;
    }

    const mediaItem = await Media.findByIdAndUpdate(id, updates, { new: true });

    if (!mediaItem) {
      return res.status(404).json({ success: false, message: 'Media item not found.' });
    }

    res.json({ success: true, message: 'Media item updated successfully.', mediaItem });
  } catch (err) {
    console.error('Error updating media item:', err);
    res.status(500).json({ success: false, message: 'Error updating media item.', error: err.message });
  }
});


// Route to create folders
app.post('/api/folders', async (req, res) => {
  const { folderName, parentFolder, icon, category, date } = req.body; // Accept an optional icon for the folder
  if (!folderName) {
    return res.status(400).json({ success: false, message: 'Folder name is required' });
  }

  try {
    //check if folder already exists
    const folderPath = parentFolder ? `${parentFolder}/${folderName}` : folderName;
    console.log('Creating folder with path:', folderPath); // Debugging
    console.log('Parent folder:', parentFolder); // Debugging

    const existingFolder = await Media.findOne({ name: folderName, type: 'folder' });
    if (existingFolder) {
      return res.status(400).json({ success: false, message: 'Folder already exists.' });
    }

    // Create a new folder entry
    const folder = new Media({
      name: folderName,
      type: 'folder',
      folder: folderPath, // Default parent folder
      parentFolder: parentFolder || 'root', // Set parent folder to root if not provided
      icon: icon || '/icons/folder-icon.png', // Default folder icon if not provided
      category: 'folders', // Set category to folders
      date: date ? new Date(date) : new Date(), // Set date to current date if not provided
      clicks: 0, // Default number of clicks is 0
    });

  await folder.save();
  res.json({ success: true, message: 'Folder created successfully', folder });
}catch (err) {
    res.status(500).json({ success: false, message: 'Error creating folder', error: err.message });
  }
});

// get all folders
app.get('/api/folders', async (req, res) => {
  try {
    const folders = await Media.find({ type: 'folder' }).select('name folder -_id'); // Fetch all folders
    res.json({ success: true, folders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching folders', error: err.message });
  }
});

// Route to increment clicks for a media item
app.patch('/api/media/:id/click', async (req, res) => {
  const { id } = req.params;

  try {
    const mediaItem = await Media.findById(id);

    if (!mediaItem) {
      return res.status(404).json({ success: false, message: 'Media item not found.' });
    }

    // Increment the clicks field
    mediaItem.clicks += 1;
    await mediaItem.save();

    res.json({ success: true, message: 'Clicks updated successfully.', mediaItem });
  } catch (err) {
    console.error('Error updating clicks:', err);
    res.status(500).json({ success: false, message: 'Error updating clicks.', error: err.message });
  }
});

// Route to search files and folders
app.get('/api/search', async (req, res) => {
  const { query } = req.query;
  const results = await Media.find({ name: { $regex: query, $options: 'i' } });
  res.json({ success: true, results });
});

// Route to fetch media items
app.get('/api/media', async (req, res) => {
  const { folder } = req.query; // Get the folder from the query parameters
  console.log('Fetching media for parent folder:', folder); // Debugging

  try {
    // Check if the folder exists
    const existingFolder = await Media.findOne({ folder: folder, type: 'folder' });
    if (!existingFolder && folder !== 'root') {
      return res.status(404).json({ success: false, message: 'Folder not found.' });
    }

    // Fetch media items based on the folder
    const mediaItems = await Media.find({ parentFolder: folder || 'root' }); // Fetch all media items from the database
    console.log('Media items found:', mediaItems); // Debugging
    res.json(mediaItems);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching media items', error: err.message });
  }
});



// Route to delete a media item (file or folder)
app.delete('/api/media/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const mediaItem = await Media.findById(id);

    if (!mediaItem) {
      return res.status(404).json({ success: false, message: 'Media item not found.' });
    }

    // If it's a file, delete the file from the filesystem
    if (mediaItem.type !== 'folder' && mediaItem.path) {
      fs.unlink(mediaItem.path, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        }
      });
    }

    // Delete the media item from the database
    await Media.findByIdAndDelete(id);

    res.json({ success: true, message: 'Media item deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting media item.', error: err.message });
  }
});

// User Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

// Register Route
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({ success: false, message: 'Please provide username and password.' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.json({ success: false, message: 'Username already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.json({ success: true, message: 'User successfully registered.' });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({ success: false, message: 'Please provide username and password.' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({ success: false, message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: 'Incorrect password.' });
    }

    // Generate JWT token (optional but recommended for authentication)
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '1h'
    });

    res.json({ success: true, message: 'Logged in successfully.', token });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

// Root Route
app.get('/', (req, res) => {
  res.send('Backend running 🚀');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
