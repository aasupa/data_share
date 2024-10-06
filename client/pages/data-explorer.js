// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import styles from '../styles/explorer.module.css';

// // Helper function to convert data to CSV
// const convertToCSV = (data) => {
//   const array = [Object.keys(data[0])].concat(data);
//   return array
//     .map(row => {
//       return Object.values(row)
//         .map(value => (typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value))
//         .join(',');
//     })
//     .join('\n');
// };

// const DataExplorer = () => {
//   const [filter, setFilter] = useState('');
//   const [datasetId, setDatasetId] = useState('');
//   const [datasetData, setDatasetData] = useState([]);
//   const [editableData, setEditableData] = useState([]);
//   const [newColumns, setNewColumns] = useState([]);
//   const [startPoint, setStartPoint] = useState(1);
//   const [endPoint, setEndPoint] = useState(10);
//   const [viewAll, setViewAll] = useState(false);
//   const [datasetOptions, setDatasetOptions] = useState([]);

//   // Fetch dataset IDs from the backend and populate dropdown
//   useEffect(() => {
//     const fetchDatasetIds = async () => {
//       try {
//         const response = await axios.get('http://localhost:3001/api/datasets/ids');
//         setDatasetOptions(response.data); // Assuming the response is an array of objects with _id and name
//       } catch (error) {
//         console.error('Error fetching dataset IDs:', error);
//       }
//     };

//     fetchDatasetIds();
//   }, []);

//   const fetchDatasetData = async () => {
//     if (!datasetId) return;

//     try {
//       const response = await axios.get(`http://localhost:3001/api/dataset/${datasetId}`);
//       const data = response.data.data;

//       setDatasetData(data);
//       setEditableData(data);

//       const dynamicColumns = Object.keys(data[0] || {}).filter(key => !['postUrl', 'id', 'text', 'ownerUsername', 'likesCount'].includes(key));
//       setNewColumns(dynamicColumns);
//     } catch (error) {
//       console.error('Error fetching dataset data:', error);
//     }
//   };

//   const handleDatasetIdChange = (e) => {
//     setDatasetId(e.target.value);
//   };

//   const handleFilterChange = (e) => {
//     const value = e.target.value.toLowerCase();
//     setFilter(value);

//     const filtered = datasetData.filter(item =>
//       item.text?.toLowerCase().includes(value) || 
//       item.ownerUsername?.toLowerCase().includes(value)
//     );
//     setEditableData(filtered);
//   };

//   // Handle Start and End Points
//   const handleStartPointChange = (e) => {
//     setStartPoint(Number(e.target.value));
//     setViewAll(false); // Disable "view all" mode if manually selecting start/end points
//   };

//   const handleEndPointChange = (e) => {
//     setEndPoint(Number(e.target.value));
//     setViewAll(false); // Disable "view all" mode if manually selecting start/end points
//   };

//   // View All Data
//   const handleViewAll = () => {
//     setViewAll(true);
//   };

//   // Download dataset as JSON
//   const downloadAsJSON = () => {
//     const jsonData = JSON.stringify(editableData, null, 2);
//     const blob = new Blob([jsonData], { type: 'application/json' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'dataset.json';
//     a.click();
//     URL.revokeObjectURL(url); // Clean up
//   };

//   // Download dataset as CSV
//   const downloadAsCSV = () => {
//     const csvData = convertToCSV(editableData);
//     const blob = new Blob([csvData], { type: 'text/csv' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'dataset.csv';
//     a.click();
//     URL.revokeObjectURL(url); // Clean up
//   };

//   // Adjust the range of displayed items based on start and end points or view all mode
//   const startIndex = startPoint > 0 ? startPoint - 1 : 0; // Convert to 0-based index
//   const endIndex = viewAll ? datasetData.length : endPoint;
//   const currentItems = editableData.slice(startIndex, endIndex);

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.title}>Data Explorer</h1>

//       <div className={styles.inputGroup}>
//         {/* Single box for both input and dropdown */}
//         <div className={styles.singleInputBox}>
//           {/* Search Input */}
//           <input
//             type="text"
//             className={styles.input}
//             placeholder="Enter dataset ID or filter"
//             value={datasetId}
//             onChange={handleDatasetIdChange}
//           />

//           {/* Dropdown Button for Dataset Selection */}
//           <select 
//             className={styles.dropdown} 
//             value={datasetId}
//             onChange={handleDatasetIdChange}
//           >
//             <option value="">Select a dataset</option>
//             {datasetOptions.map(dataset => (
//               <option key={dataset._id} value={dataset.datasetId}>
//                 {dataset.datasetId}
//               </option>
//             ))}
//           </select>
//         </div>
        
//         {/* Search Button */}
//         <button className={styles.button} onClick={fetchDatasetData}>
//           Search Dataset
//         </button>
//       </div>

//       {/* Add Download Buttons */}
//       {editableData.length > 0 && (
//         <div className={styles.buttonContainer}>
//           <button className={styles.button} onClick={downloadAsJSON}>Download as JSON</button>
//           <button className={styles.button} onClick={downloadAsCSV}>Download as CSV</button>
//         </div>
//       )}

//       <label className={styles.label}>
//         Start Point:
//         <input
//           type="number"
//           min="1"
//           value={startPoint}
//           onChange={handleStartPointChange}
//           className={styles.inputSmall}
//         />
//       </label>

//       <label className={styles.label}>
//         End Point:
//         <input
//           type="number"
//           min="1"
//           value={endPoint}
//           onChange={handleEndPointChange}
//           className={styles.inputSmall}
//         />
//       </label>

//       <button className={styles.button} onClick={handleViewAll}>
//         View All Data
//       </button>

//       <table className={styles.table}>
//         <thead>
//           <tr>
//             <th className={styles.th}>Post URL</th>
//             <th className={styles.th}>ID</th>
//             <th className={styles.th}>Text</th>
//             <th className={styles.th}>Owner Username</th>
//             <th className={styles.th}>Likes Count</th>
//             {newColumns.map((col, index) => (
//               <th className={styles.th} key={index}>{col}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {currentItems.length > 0 ? (
//             currentItems.map((item, index) => (
//               <tr className={styles.tr} key={index}>
//                 <td className={styles.td}>
//                   <a className={styles.link} href={item.postUrl} target="_blank" rel="noopener noreferrer">
//                     {item.postUrl}
//                   </a>
//                 </td>
//                 <td className={styles.td}>{item.id}</td>
//                 <td className={styles.td}>{item.text}</td>
//                 <td className={styles.td}>{item.ownerUsername}</td>
//                 <td className={styles.td}>{item.likesCount}</td>
//                 {newColumns.map((col, colIndex) => (
//                   <td key={colIndex} className={styles.td}>{item[col]}</td>
//                 ))}
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan={newColumns.length + 5} className={styles.noDataMessage}>
//                 No data available. Please enter a valid dataset ID or check the dataset data.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default DataExplorer;
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import styles from '../styles/explorer.module.css';

// // Helper function to convert data to CSV
// const convertToCSV = (data) => {
//   const array = [Object.keys(data[0])].concat(data);
//   return array
//     .map(row => {
//       return Object.values(row)
//         .map(value => (typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value))
//         .join(',');
//     })
//     .join('\n');
// };

// const DataExplorer = () => {
//   const [filter, setFilter] = useState('');
//   const [selectedFile, setSelectedFile] = useState('');
//   const [fileData, setFileData] = useState([]);
//   const [editableData, setEditableData] = useState([]);
//   const [newColumns, setNewColumns] = useState([]);
//   const [startPoint, setStartPoint] = useState(1);
//   const [endPoint, setEndPoint] = useState(10);
//   const [viewAll, setViewAll] = useState(false);
//   const [datasetFiles, setDatasetFiles] = useState([]);
  
//   // Fetch dataset files from S3 and populate dropdown
//   useEffect(() => {
//     const fetchDatasetFiles = async () => {
//       try {
//         const response = await axios.get('http://localhost:3001/api/datasets/s3/files');
//         setDatasetFiles(response.data); // Assuming response contains an array of file keys
//       } catch (error) {
//         console.error('Error fetching dataset files:', error);
//       }
//     };

//     fetchDatasetFiles();
//   }, []);

//   const fetchFileData = async () => {
//     if (!selectedFile) return;

//     try {
//       const response = await axios.get(`http://localhost:3001/api/datasets/s3/files/${selectedFile}`);
//       const data = response.data; // Update this according to your actual response structure

//       setFileData(data);
//       setEditableData(data);

//       const dynamicColumns = Object.keys(data[0] || {}).filter(key => !['postUrl', 'id', 'text', 'ownerUsername', 'likesCount'].includes(key));
//       setNewColumns(dynamicColumns);
//     } catch (error) {
//       console.error('Error fetching dataset data:', error);
//     }
//   };

//   const handleFileSelection = (e) => {
//     setSelectedFile(e.target.value);
//   };

//   const handleFilterChange = (e) => {
//     const value = e.target.value.toLowerCase();
//     setFilter(value);

//     const filtered = fileData.filter(item =>
//       item.text?.toLowerCase().includes(value) || 
//       item.ownerUsername?.toLowerCase().includes(value)
//     );
//     setEditableData(filtered);
//   };

//   // Handle Start and End Points
//   const handleStartPointChange = (e) => {
//     setStartPoint(Number(e.target.value));
//     setViewAll(false); // Disable "view all" mode if manually selecting start/end points
//   };

//   const handleEndPointChange = (e) => {
//     setEndPoint(Number(e.target.value));
//     setViewAll(false); // Disable "view all" mode if manually selecting start/end points
//   };

//   // View All Data
//   const handleViewAll = () => {
//     setViewAll(true);
//   };

//   // Download dataset as JSON
//   const downloadAsJSON = () => {
//     const jsonData = JSON.stringify(editableData, null, 2);
//     const blob = new Blob([jsonData], { type: 'application/json' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'dataset.json';
//     a.click();
//     URL.revokeObjectURL(url); // Clean up
//   };

//   // Download dataset as CSV
//   const downloadAsCSV = () => {
//     const csvData = convertToCSV(editableData);
//     const blob = new Blob([csvData], { type: 'text/csv' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'dataset.csv';
//     a.click();
//     URL.revokeObjectURL(url); // Clean up
//   };

//   // Adjust the range of displayed items based on start and end points or view all mode
//   const startIndex = startPoint > 0 ? startPoint - 1 : 0; // Convert to 0-based index
//   const endIndex = viewAll ? fileData.length : endPoint;
//   const currentItems = editableData && editableData.length > 0 
//     ? editableData.slice(startIndex, endIndex)
//     : [];

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.title}>Data Explorer</h1>

//       <div className={styles.inputGroup}>
//         <div className={styles.singleInputBox}>
//           <select 
//             className={styles.dropdown} 
//             value={selectedFile} 
//             onChange={handleFileSelection}
//           >
//             <option value="">Select a file</option>
//             {datasetFiles.map(file => (
//               <option key={file.key} value={file.key}>
//                 {file.key} {/* Display only the file key */}
//               </option>
//             ))}
//           </select>
//         </div>
        
//         <button className={styles.button} onClick={fetchFileData}>
//           Fetch Dataset
//         </button>
//       </div>

//       {editableData.length > 0 && (
//         <div className={styles.buttonContainer}>
//           <button className={styles.button} onClick={downloadAsJSON}>Download as JSON</button>
//           <button className={styles.button} onClick={downloadAsCSV}>Download as CSV</button>
//         </div>
//       )}

//       <label className={styles.label}>
//         Start Point:
//         <input
//           type="number"
//           min="1"
//           value={startPoint}
//           onChange={handleStartPointChange}
//           className={styles.inputSmall}
//         />
//       </label>

//       <label className={styles.label}>
//         End Point:
//         <input
//           type="number"
//           min="1"
//           value={endPoint}
//           onChange={handleEndPointChange}
//           className={styles.inputSmall}
//         />
//       </label>

//       <button className={styles.button} onClick={handleViewAll}>
//         View All Data
//       </button>

//       <table className={styles.table}>
//         <thead>
//           <tr>
//             <th className={styles.th}>Post URL</th>
//             <th className={styles.th}>ID</th>
//             <th className={styles.th}>Text</th>
//             <th className={styles.th}>Owner Username</th>
//             <th className={styles.th}>Likes Count</th>
//             {newColumns.map((col, index) => (
//               <th className={styles.th} key={index}>{col}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {currentItems.length > 0 ? (
//             currentItems.map((item, index) => (
//               <tr className={styles.tr} key={index}>
//                 <td className={styles.td}>
//                   <a className={styles.link} href={item.postUrl} target="_blank" rel="noopener noreferrer">
//                     {item.postUrl}
//                   </a>
//                 </td>
//                 <td className={styles.td}>{item.id}</td>
//                 <td className={styles.td}>{item.text || 'No text'}</td>
//                 <td className={styles.td}>{item.ownerUsername || 'Unknown'}</td>
//                 <td className={styles.td}>{item.likesCount || 0}</td>
//                 {newColumns.map((col, colIndex) => (
//                   <td key={colIndex} className={styles.td}>{item[col] !== undefined ? item[col] : 'N/A'}</td>
//                 ))}
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan={newColumns.length + 5} className={styles.noDataMessage}>
//                 No data available. Please select a file.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default DataExplorer;

import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/explorer.module.css';

// Helper function to convert data to CSV
const convertToCSV = (data) => {
  const array = [Object.keys(data[0])].concat(data);
  return array
    .map(row => {
      return Object.values(row)
        .map(value => (typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value))
        .join(',');
    })
    .join('\n');
};

const DataExplorer = () => {
  const [filter, setFilter] = useState('');
  const [selectedFile, setSelectedFile] = useState('');
  const [fileData, setFileData] = useState([]);
  const [editableData, setEditableData] = useState([]);
  const [dynamicColumns, setDynamicColumns] = useState([]);
  const [startPoint, setStartPoint] = useState(1);
  const [endPoint, setEndPoint] = useState(10);
  const [viewAll, setViewAll] = useState(false);
  const [datasetFiles, setDatasetFiles] = useState([]);

  useEffect(() => {
    const fetchDatasetFiles = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/datasets/s3/files');
        setDatasetFiles(response.data);
      } catch (error) {
        console.error('Error fetching dataset files:', error);
      }
    };

    fetchDatasetFiles();
  }, []);

  const fetchFileData = async () => {
    if (!selectedFile) return;

    try {
      const response = await axios.get(`http://localhost:3001/api/datasets/s3/files/${selectedFile}`);
      const data = response.data;

      // Check if data is an array and set it accordingly
      if (Array.isArray(data)) {
        setFileData(data);
        setEditableData(data);
        const columns = Object.keys(data[0] || {});
        setDynamicColumns(columns);
      } else {
        console.error('Fetched data is not an array:', data);
      }
    } catch (error) {
      console.error('Error fetching dataset data:', error);
    }
  };

  const handleFileSelection = (e) => {
    setSelectedFile(e.target.value);
  };

  const handleFilterChange = (e) => {
    const value = e.target.value.toLowerCase();
    setFilter(value);

    const filtered = fileData.filter(item =>
      Object.values(item).some(val =>
        typeof val === 'string' && val.toLowerCase().includes(value)
      )
    );
    setEditableData(filtered);
  };

  const handleStartPointChange = (e) => {
    setStartPoint(Number(e.target.value));
    setViewAll(false);
  };

  const handleEndPointChange = (e) => {
    setEndPoint(Number(e.target.value));
    setViewAll(false);
  };

  const handleViewAll = () => {
    setViewAll(true);
  };

  const downloadAsJSON = () => {
    const jsonData = JSON.stringify(editableData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dataset.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAsCSV = () => {
    const csvData = convertToCSV(editableData);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dataset.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const startIndex = startPoint > 0 ? startPoint - 1 : 0;
  const endIndex = viewAll ? fileData.length : endPoint;
  
  // Ensure editableData is always an array
  const currentItems = Array.isArray(editableData) && editableData.length > 0 
    ? editableData.slice(startIndex, endIndex)
    : []; // Default to an empty array if editableData isn't an array

  // Debugging: Log currentItems to console
  console.log('Current Items:', currentItems, 'Type:', typeof currentItems);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Data Explorer</h1>

      <div className={styles.inputGroup}>
        <div className={styles.singleInputBox}>
          <select
            className={styles.dropdown}
            value={selectedFile}
            onChange={handleFileSelection}
          >
            <option value="">Select a file</option>
            {datasetFiles.map(file => (
              <option key={file.key} value={file.key}>
                {file.key}
              </option>
            ))}
          </select>
        </div>

        <button className={styles.button} onClick={fetchFileData}>
          Fetch Dataset
        </button>
      </div>

      {editableData.length > 0 && (
        <div className={styles.buttonContainer}>
          <button className={styles.button} onClick={downloadAsJSON}>Download as JSON</button>
          <button className={styles.button} onClick={downloadAsCSV}>Download as CSV</button>
        </div>
      )}

      <label className={styles.label}>
        Start Point:
        <input
          type="number"
          min="1"
          value={startPoint}
          onChange={handleStartPointChange}
          className={styles.inputSmall}
        />
      </label>

      <label className={styles.label}>
        End Point:
        <input
          type="number"
          min="1"
          value={endPoint}
          onChange={handleEndPointChange}
          className={styles.inputSmall}
        />
      </label>

      <button className={styles.button} onClick={handleViewAll}>
        View All Data
      </button>

      <table className={styles.table}>
        <thead>
          <tr>
            {dynamicColumns.map((col, index) => (
              <th className={styles.th} key={index}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(currentItems) && currentItems.length > 0 ? (
            currentItems.map((item, index) => (
              <tr className={styles.tr} key={index}>
                {dynamicColumns.map((col, colIndex) => (
                  <td key={colIndex} className={styles.td}>{item[col] !== undefined ? item[col] : 'N/A'}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={dynamicColumns.length} className={styles.noDataMessage}>
                No data available. Please select a file.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataExplorer;
