import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import User from "./models/User.js"
import File from "./models/File.js"
import Folder from "./models/folder.js"
import fileRoutes from "./routes/files.js";
import datasetRoutes from "./routes/datasetRoutes.js";
import elementRoutes from './routes/elementRoutes.js';
import fs from 'fs';
import bodyParser from 'body-parser';

dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use(cors({ origin: 'https://deploy-data-share.vercel.app/' },
            methods:{"POST", "GET"},
            credentials: true
            ));

app.get("/", (req,res)=>{
    res.json({ message: "Hello World!"});
});
app.use('/api/files', fileRoutes);
app.use('/api', datasetRoutes);
app.use('/api', elementRoutes);



app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ username, password: hashedPassword });
    res.status(201).json(user);
  } catch (error) {
    console.error(error);  
    res.status(400).json({ error: 'Error creating user' });
  }
});


app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token, username: user.username });
});


const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];
  
  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to authenticate token' });
    }

    req.user = { _id: decoded.id }; // Attach user ID to the request
    next(); // Proceed to the next middleware/route
  });
}

// app.post('/api/folders', verifyToken, async (req, res) => {
//   const { name} = req.body;
//   try {
//     const newFolder = new Folder({
//       name,
//       createdBy: req.user._id,
//     });
//     await newFolder.save();
//     res.status(201).json(newFolder);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Error creating folder' });
//   }
// });


app.post('/api/folders', verifyToken, async (req, res) => {
  const { name } = req.body;
  
  try {
    const user = await User.findById(req.user._id); // Fetch the user to get the username
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newFolder = new Folder({
      name,
      createdBy: user._id,        // Store the user ID
      createdByUsername: user.username, // Store the username
    });
    
    await newFolder.save();
    res.status(201).json(newFolder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating folder' });
  }
});


app.get('/api/folderlist', verifyToken, async (req, res) => {
  try {
    const folders = await Folder.find({}).select('name createdBy createdByUsername createdAt');
    res.json(folders);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching folders' });
  }
});


app.get('/api/folders/:folderId/contents', async (req, res) => {
  const { folderId } = req.params;

  try {
    const files = await File.find({ folder: folderId }).populate('uploader', 'username');; // Get files in the folder
    res.json({ Folder, files });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching folder contents' });
  }
});

// Route to fetch distinct folder creators
app.get('/api/creators', async (req, res) => {
  try {
    const creators = await Folder.distinct('createdByUsername');
    res.status(200).json(creators);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to filter folders
app.get('/api/filter', async (req, res) => {
  try {
    const { name, createdBy, createdAt } = req.query;
    let filter = {};

    if (name) {
      filter.name = { $regex: name, $options: 'i' }; // Case-insensitive search for folder name
    }
    if (createdBy) {
      filter.createdByUsername = createdBy; // Exact match for createdBy
    }
    if (createdAt) {
      filter.createdAt = { $gte: new Date(createdAt) }; // Filter by date
    }

    const folders = await Folder.find(filter);
    res.status(200).json(folders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// app.get('/api/folders/:folderId/contents', async (req, res) => {
//   try {
//     const folder = await Folder.findById(req.params.folderId);
//     if (!folder) {
//       return res.status(404).json({ message: 'Folder not found' });
//     }
//     const files = await File.find({ folderId: req.params.folderId });
//     res.status(200).json({ files });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching folder contents' });
//   }
// });


// Delete a folder along with its files
app.delete('/api/folders/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params; // Folder ID from URL
    const userId = req.user._id; // User ID from token

    // Find the folder to delete
    const folder = await Folder.findById(id);
    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    // Check if the user owns the folder
    if (folder.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'You are not authorized to delete this folder' });
    }

    // Find and delete all files within the folder
    const files = await File.find({ folder: id });
    for (const file of files) {
      const filePath = path.join(__dirname, 'uploads', file.filename);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Failed to delete file ${file.filename} from filesystem:`, err);
        }
      });
      await file.deleteOne(); // Remove file from database
    }

    // Delete the folder itself
    await folder.deleteOne();
    res.json({ message: 'Folder and its files deleted successfully' });
  } catch (err) {
    console.error('Failed to delete folder:', err);
    res.status(500).json({ error: 'Failed to delete folder' });
  }
});


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folderPath = `uploads`;
    fs.mkdirSync(folderPath, { recursive: true });
    cb(null, folderPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});


const upload = multer({ storage: storage });

app.post('/api/upload', upload.single('file'), async (req, res) => {
  const token = req.headers['x-access-token'];
 //const { folderId } = req.body;
 const folderId = req.body.folderId === '' ? null : req.body.folderId;
 
 const decoded = jwt.verify(token, process.env.JWT_SECRET );
  const userId = decoded.id;


  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  console.log('Uploaded File:', req.file);

  const file = new File({
    filename: req.file.filename,
    originalname: req.file.originalname,
    uploader: userId,
    folder: folderId,
  });
  

  await file.save();
  res.status(201).json(file);
});

app.get('/api/filess', async (req, res) => {
  const files = await File.find().populate('uploader', 'username').exec();
  res.json(files);
});




app.get('/api/filess/:id/view', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    const filePath = path.join(__dirname, 'uploads', file.filename);

    const mimeType = {
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.xls': 'application/vnd.ms-excel',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.csv': 'text/csv',
      '.txt': 'text/plain',
    };

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeType[ext] || 'application/octet-stream';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${file.filename}"`);

    res.sendFile(filePath);  // Serve the file directly in the browser
  } catch (error) {
    console.error('Failed to view file:', error);
    res.status(500).json({ error: 'Failed to view file' });
  }
});


app.get('/api/files/:id/download', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    const filePath = path.join(__dirname, 'uploads', file.filename);
    const originalName = file.originalname;

   
    const mimeType = {
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.xls': 'application/vnd.ms-excel',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.csv': 'text/csv',
      '.txt': 'text/plain',
    };

    
    const ext = path.extname(filePath).toLowerCase(); 
    const contentType = mimeType[ext] || 'application/octet-stream'; 

    
    res.setHeader('Content-Disposition', `attachment; filename="${originalName}"`);
    res.setHeader('Content-Type', contentType); 

    
    res.download(filePath, originalName, (err) => {
      if (err) {
        console.error('Download failed:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Failed to download file' });
        }
      }
    });
  } catch (error) {
    console.error('Failed to download file:', error);
    res.status(500).json({ error: 'Failed to download file' });
  }
});

app.delete('/api/files/:id', async (req, res) => {
  try {
    const token = req.headers['x-access-token'];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Check if the logged-in user is the uploader
    if (file.uploader.toString() !== userId) {
      return res.status(403).json({ error: 'You are not authorized to delete this file' });
    }

    // Delete the file from the server
    const filePath = path.join(__dirname, 'uploads', file.filename);
    fs.unlink(filePath, async (err) => {
      if (err) {
        console.error('Failed to delete file from filesystem:', err);
        return res.status(500).json({ error: 'Failed to delete file' });
      }

      // Remove file entry from the database
      await file.deleteOne();
      res.json({ message: 'File deleted successfully' });
    });
  } catch (error) {
    console.error('Failed to delete file:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});




const PORT = process.env.PORT || 3002; // Default to port 3002 if PORT is not specified
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    
  })
  .catch((error) => console.log(`${error} did not connect`));
