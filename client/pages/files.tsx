// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import styles from '../styles/files.module.css';
// import FloatingContainer from './FloatingContainer';

// interface Folder {
//   id: string;
//   name: string;
// }

// export default function Dashboard() {
//   const [folders, setFolders] = useState<Folder[]>([]);
//   const [filteredFolders, setFilteredFolders] = useState<Folder[]>([]);
//   const [selectedFolder, setSelectedFolder] = useState('');
//   const [files, setFiles] = useState([]);
//   const [uploadingFile, setUploadingFile] = useState<File | null>(null);
//   const [folderName, setFolderName] = useState('');
//   const [isFloatingContainerVisible, setIsFloatingContainerVisible] = useState(false);
//   const [username, setUsername] = useState<string | null>('');
//   const [creators, setCreators] = useState([]);
//   const [filters, setFilters] = useState({
//     name: '',
//     createdBy: '',
//     createdAt: ''
//   });
  
  
//   useEffect(() => {
//     const storedUsername = localStorage.getItem('username');
//     console.log('Stored Username:', storedUsername); // Check if username exists

//     setUsername(storedUsername);

//     const fetchFolders = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get('http://localhost:3001/api/folderlist', {
//           headers: { 'x-access-token': token }
//         });
//         setFolders(response.data);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     const fetchCreators = async () => {
//       try {
//         const response = await axios.get('http://localhost:3001/api/creators');
//         setCreators(response.data); // Set distinct creators from backend
//       } catch (err) {
//         console.error('Error fetching creators:', err);
//       }
//     };

//     fetchFolders();
//     fetchCreators();
//   }, []);



//   const fetchFolderContents = async (folderId: string) => {
//     setSelectedFolder(folderId);
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`http://localhost:3001/api/folders/${folderId}/contents`, {
//         headers: { 'x-access-token': token }
//       });
//       setFiles(response.data.files);
//       setIsFloatingContainerVisible(true); // Show the floating container
//     } catch (err) {
//       console.error('Error fetching folder contents', err);
//     }
//   };

//   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       setUploadingFile(e.target.files[0]);
//     }
//   };

//   const submitFileUpload = async () => {
//     if (uploadingFile && selectedFolder) {
//       const formData = new FormData();
//       formData.append('file', uploadingFile);
//       formData.append('folderId', selectedFolder);

//       try {
//         const token = localStorage.getItem('token');
//         await axios.post('http://localhost:3001/api/upload', formData, {
//           headers: {
//             'x-access-token': token,
//             'Content-Type': 'multipart/form-data',
//           },
//         });
//         fetchFolderContents(selectedFolder); // Refresh folder contents
//       } catch (err) {
//         console.error('File upload error', err);
//       }
//     }
//   };

//   const createFolder = async () => {
//     const token = localStorage.getItem('token');
//     try {
//       const response = await axios.post(
//         'http://localhost:3001/api/folders',
//         { name: folderName },
//         {
//           headers: { 'x-access-token': token },
//         }
//       );
//       setFolders([...folders, response.data]);
//       setFolderName('');
//     } catch (err) {
//       console.error('Error creating folder', err);
//     }
//   };

//   const deleteFolder = async (folderId: string) => {
//     const token = localStorage.getItem('token');
//     try {
//       await axios.delete(`http://localhost:3001/api/folders/${folderId}`, {
//         headers: { 'x-access-token': token }
//       });
//       // Remove the deleted folder from the state
//       setFolders(folders.filter(folder => folder.id !== folderId));
//     } catch (err) {
//       console.error('Error deleting folder', err);
//     }
//   };

  
//   const fetchFilteredFolders = async () => {
//     try {
//       const response = await axios.get('http://localhost:3001/api/filter', {
//         params: {
//           name: filters.name,
//           createdBy: filters.createdBy,
//           createdAt: filters.createdAt
//         }
//       });
//       setFilteredFolders(response.data); // Update state with filtered folders
//     } catch (err) {
//       console.error('Error fetching filtered folders:', err);
//     }
//   };

//   // Handle filter form submission
//   const handleFilterSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     fetchFilteredFolders();
//   };



//   return (
//     <div className={styles.container}>
//        {/* Top right corner - Username display */}
//        <div className={styles.topRightCorner}>
//         {username && <span>Welcome, {username}</span>}
//       </div>

//       <h1 className={styles.header}>Dashboard</h1>
//       <div className={styles.leftSection}>
//       <div className={styles.createFolder}>
//         <h2>Create New Folder</h2>
//         <input
//           type="text"
//           className={styles.input}
//           placeholder="Folder name"
//           value={folderName}
//           onChange={(e) => setFolderName(e.target.value)}
//         />
//         <button className={styles.button} onClick={createFolder}>Create Folder</button>
//       </div>


//       {/* Filter form */}
//       <div className={styles.filterSection}>
//         <h2>Filter Folders</h2>
//         <form onSubmit={handleFilterSubmit}>
//           <div>
//             <label>Folder Name:</label>
//             <input
//               type="text"
//               value={filters.name}
//               onChange={(e) => setFilters({ ...filters, name: e.target.value })}
//               placeholder="Enter folder name"
//             />
//           </div>

//           <div>
//             <label>Creator:</label>
//             <select
//               value={filters.createdBy}
//               onChange={(e) => setFilters({ ...filters, createdBy: e.target.value })}
//             >
//               <option value="">All Creators</option>
//               {creators.map((creator, index) => (
//                 <option key={index} value={creator}>
//                   {creator}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label>Created After:</label>
//             <input
//               type="date"
//               value={filters.createdAt}
//               onChange={(e) => setFilters({ ...filters, createdAt: e.target.value })}
//             />
//           </div>

//           <button className={styles.button} type="submit">Filter</button>
//         </form>
//       </div>
//       </div>

//       {/* Filtered folder list */}
//     <div className={styles.rightSection}>
//       <div className={styles.folders}>
//         <h2>Filtered Folders</h2>
//         <ul>
//           {filteredFolders.map((folder: any) => (
//             <li key={folder._id} className={styles.folderItem}>
//               <div className={styles.fileIcon}></div>
//               <a onClick={() => fetchFolderContents(folder._id)}>{folder.name}</a>
//             </li>
//           ))}
//         </ul>
//       </div>


//       <div className={styles.folders}>
//         <h2> All Folders</h2>
//         <ul>
//           {folders.map((folder: any) => (
//             <li key={folder._id} className={styles.folderItem}>
//               <div className={styles.fileIcon}></div>
//               <a onClick={() => fetchFolderContents(folder._id)}>{folder.name}</a>
//               <button
//                 className={styles.deleteButton}
//                 onClick={() => deleteFolder(folder._id)}
//               >
//                 Delete
//               </button>
            
//             </li>
//           ))}
//         </ul>
//       </div>
//       </div>

//       {isFloatingContainerVisible && (
//         <FloatingContainer
//           files={files}
//           onClose={() => setIsFloatingContainerVisible(false)}
//           handleFileUpload={handleFileUpload}
//           submitFileUpload={submitFileUpload}
//         />
//       )}
      
//     </div>
  
//   );
// }
