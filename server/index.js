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

app.use(cors({ origin: 'https://deploy-data-share.vercel.app' ,
            methods:['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true
             }));

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


app.get('/api/filess', async (req, res) => {
  const files = await File.find().populate('uploader', 'username').exec();
  res.json(files);
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
