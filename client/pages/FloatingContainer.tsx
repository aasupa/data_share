// import React, { useState, useEffect } from 'react';
// import styles from '../styles/files.module.css'; // Adjust the path if necessary
// import axios from 'axios';

// interface FloatingContainerProps {
//   files: any[];
//   onClose: () => void;
//   handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   submitFileUpload: () => void;
// }

// const FloatingContainer: React.FC<FloatingContainerProps> = ({ files, onClose, handleFileUpload, submitFileUpload }) => {
//   const [localFiles, setLocalFiles] = useState(files); // Initialize state with props
//   const [token] = useState(localStorage.getItem('token') || ''); // Replace with your token management
  
//   useEffect(() => {
//     setLocalFiles(files); // Update localFiles when files prop changes
//   }, [files]);


//   const handleDownload = async (fileId: string) => {
//     try {
//       const response = await axios.get(`http://localhost:3001/api/files/${fileId}/download`, {
//         headers: { 'x-access-token': token },
//         responseType: 'blob',
//       });

//       const disposition = response.headers['content-disposition'];
//       const filename = disposition
//         ? disposition.split('filename=')[1].replace(/['"]/g, '')
//         : `file_${fileId}`;

//       const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', filename);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (error) {
//       console.error('Error downloading file:', error);
//     }
//   };

//   const handleView = async (fileId: string) => {
//     try {
//       const response = await axios.get(`http://localhost:3001/api/files/${fileId}/view`, {
//         headers: { 'x-access-token': token },
//         responseType: 'blob',
//       });

//       const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
//       window.open(url, '_blank');
//     } catch (error) {
//       console.error('Error viewing file:', error);
//     }
//   };

//   const handleDelete = async (fileId: string) => {
//     try {
//       await axios.delete(`http://localhost:3001/api/files/${fileId}`, {
//         headers: { 'x-access-token': token },
//       });
//       setLocalFiles((prevFiles) => prevFiles.filter((file) => file._id !== fileId));
//     } catch (error) {
//       console.error('Error deleting file:', error);
//     }
//   };

//   return (
//     <div className={styles.floatingContainer}>
//       <button className={styles.closeButton} onClick={onClose}>✖</button>
//       <h2>Files in Folder</h2>
//       <ul>
//         {localFiles.map((file: any) => (
//           <li key={file._id} className={styles.fileItem}>
//             <a
//               href="#"
//               onClick={(e) => { e.preventDefault(); handleView(file._id); }}
//               className={styles.fileLink}
//             >
//               {file.originalname}
//             </a>
//             <div className={styles.download}>
//               <button onClick={() => handleDownload(file._id)} className={styles.downloadButton}>Download</button>
//             </div>
//             <div className={styles.delete} >
//               <button onClick={() => handleDelete(file._id)} className={styles.deleteButton}>Delete</button>
//             </div>
//           </li>
//         ))}
//       </ul>
//       <div className={styles.fileUpload}>
//         <input type="file" className={styles.fileInput} onChange={handleFileUpload} />
//         <button className={styles.uploadButton} onClick={submitFileUpload}>Upload File</button>
//       </div>
//     </div>
//   );
// };

// export default FloatingContainer;


// import React, { useState, useEffect } from 'react';
// import styles from '../styles/files.module.css'; // Adjust the path if necessary
// import axios from 'axios';

// interface FloatingContainerProps {
//   files: any[];
//   onClose: () => void;
//   handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   submitFileUpload: () => void;
// }

// const FloatingContainer: React.FC<FloatingContainerProps> = ({ files, onClose, handleFileUpload, submitFileUpload }) => {
//   const [localFiles, setLocalFiles] = useState(files); // Initialize state with props
//   const [token] = useState(localStorage.getItem('token') || ''); // Replace with your token management
  
//   useEffect(() => {
//     setLocalFiles(files); // Update localFiles when files prop changes
//   }, [files]);

//   const handleDownload = async (fileId: string) => {
//     try {
//       const response = await axios.get(`http://localhost:3001/api/files/${fileId}/download`, {
//         headers: { 'x-access-token': token },
//         responseType: 'blob',
//       });

//       const disposition = response.headers['content-disposition'];
//       const filename = disposition
//         ? disposition.split('filename=')[1].replace(/['"]/g, '')
//         : `file_${fileId}`;

//       const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', filename);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (error) {
//       console.error('Error downloading file:', error);
//     }
//   };

//   const handleView = async (fileId: string) => {
//     try {
//       const response = await axios.get(`http://localhost:3001/api/files/${fileId}/view`, {
//         headers: { 'x-access-token': token },
//         responseType: 'blob',
//       });

//       const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
//       window.open(url, '_blank');
//     } catch (error) {
//       console.error('Error viewing file:', error);
//     }
//   };

//   const handleDelete = async (fileId: string) => {
//     try {
//       await axios.delete(`http://localhost:3001/api/files/${fileId}`, {
//         headers: { 'x-access-token': token },
//       });
//       setLocalFiles((prevFiles) => prevFiles.filter((file) => file._id !== fileId));
//     } catch (error) {
//       console.error('Error deleting file:', error);
//     }
//   };

//   return (
//     <div className={styles.floatingContainer}>
//       <button className={styles.closeButton} onClick={onClose}>✖</button>
//       <h2>Files in Folder</h2>
//       <ul>
//         {localFiles.map((file: any) => (
            
//           <li key={file._id} className={styles.fileItem}>
//             <span className={styles.fileName}>
//               <a
//                 href="#"
//                 onClick={(e) => { e.preventDefault(); handleView(file._id); }}
//                 className={styles.fileLink}
//               >
//                 {file.originalname}
//               </a>
//               <span className={styles.fileUploader}>
//                 &nbsp; (Uploaded by: {file.uploader.username})
//               </span>
//             </span>
//             <div className={styles.download}>
//               <button onClick={() => handleDownload(file._id)} className={styles.downloadButton}>Download</button>
//             </div>
//             <div className={styles.delete}>
//               <button onClick={() => handleDelete(file._id)} className={styles.deleteButton}>Delete</button>
//             </div>
//           </li>
//         ))}
//       </ul>
//       <div className={styles.fileUpload}>
//         <input type="file" className={styles.fileInput} onChange={handleFileUpload} />
//         <button className={styles.uploadButton} onClick={submitFileUpload}>Upload File</button>
//       </div>
//     </div>
//   );
// };

// export default FloatingContainer;


import React, { useState, useEffect } from 'react';
import styles from '../styles/files.module.css'; // Adjust the path if necessary
import axios from 'axios';

interface FloatingContainerProps {
  files: any[];
  onClose: () => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  submitFileUpload: () => void;
}

const FloatingContainer: React.FC<FloatingContainerProps> = ({ files, onClose, handleFileUpload, submitFileUpload }) => {
  const [localFiles, setLocalFiles] = useState(files); // Initialize state with props
  const [token] = useState(localStorage.getItem('token') || ''); // Replace with your token management
  
  useEffect(() => {
    console.log('Files prop:', files); // Debugging: Check files prop
    setLocalFiles(files); // Update localFiles when files prop changes
  }, [files]);

  const handleDownload = async (fileId: string) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/files/${fileId}/download`, {
        headers: { 'x-access-token': token },
        responseType: 'blob',
      });

      const disposition = response.headers['content-disposition'];
      const filename = disposition
        ? disposition.split('filename=')[1].replace(/['"]/g, '')
        : `file_${fileId}`;

      const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleView = async (fileId: string) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/files/${fileId}/view`, {
        headers: { 'x-access-token': token },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error viewing file:', error);
    }
  };

  const handleDelete = async (fileId: string) => {
    try {
      await axios.delete(`http://localhost:3001/api/files/${fileId}`, {
        headers: { 'x-access-token': token },
      });
      setLocalFiles((prevFiles) => prevFiles.filter((file) => file._id !== fileId));
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  return (
    <div className={styles.floatingContainer}>
      <button className={styles.closeButton} onClick={onClose}>✖</button>
      <h2>Files in Folder</h2>
      <ul>
        {localFiles.map((file: any) => {
          console.log('File:', file); // Debugging: Check file object
          return (
            <li key={file._id} className={styles.fileItem}>
              <span className={styles.fileName}>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); handleView(file._id); }}
                  className={styles.fileLink}
                >
                  {file.originalname}
                </a>
                <span className={styles.fileUploader}>
                  &nbsp; (Uploaded by: {file.uploader.username})
                </span>
              </span>
              <div className={styles.download}>
                <button onClick={() => handleDownload(file._id)} className={styles.downloadButton}>Download</button>
              </div>
              <div className={styles.delete}>
                <button onClick={() => handleDelete(file._id)} className={styles.deleteButton}>Delete</button>
              </div>
            </li>
          );
        })}
      </ul>
      <div className={styles.fileUpload}>
        <input type="file" className={styles.fileInput} onChange={handleFileUpload} />
        <button className={styles.uploadButton} onClick={submitFileUpload}>Upload File</button>
      </div>
    </div>
  );
};

export default FloatingContainer;
