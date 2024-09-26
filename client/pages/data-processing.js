// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import styles from '../styles/dataProcessing.module.css';

// const DataProcessing = () => {
//   const [datasetIds, setDatasetIds] = useState([]);
//   const [selectedDataset, setSelectedDataset] = useState('');
//   const [selectedElement, setSelectedElement] = useState('');
//   const [elementsTable, setElementsTable] = useState([]);
  
//   // Fetch dataset IDs when the component mounts
//   useEffect(() => {
//     const fetchDatasetIds = async () => {
//       try {
//         const response = await axios.get('http://localhost:3001/api/datasets/ids');
//         setDatasetIds(response.data); // Assuming the API returns an array of objects with _id and datasetId
//       } catch (error) {
//         console.error('Error fetching dataset IDs:', error);
//       }
//     };

//     // Fetch created elements (history)
//     const fetchCreatedElements = async () => {
//       try {
//         const response = await axios.get('http://localhost:3001/api/elements');
//         setElementsTable(response.data); // Assuming the API returns an array of created elements
//       } catch (error) {
//         console.error('Error fetching created elements:', error);
//       }
//     };

//     fetchDatasetIds();
//     fetchCreatedElements();
//   }, []);

//   // Handle Dataset selection
//   const handleDatasetChange = (e) => {
//     setSelectedDataset(e.target.value);
//   };

//   // Handle Element selection
//   const handleElementChange = (e) => {
//     setSelectedElement(e.target.value);
//   };

//   // Handle the creation of an element in the table
//   const handleCreateElement = async () => {
//     if (selectedDataset && selectedElement) {
//       const newElement = {
//         element: selectedElement,
//         datasetName: selectedDataset,
//         used: 'No' // Default value for 'used'
//       };

//       try {
//         // Send the new element to the backend to store it in the database
//         await axios.post('http://localhost:3001/api/elements', newElement);
        
//         // Update the table locally (after successful backend save)
//         setElementsTable([...elementsTable, newElement]);
//       } catch (error) {
//         console.error('Error creating new element:', error);
//       }
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.title}>Data Processing</h1>

//       {/* Dropdown to select dataset */}
//       <div className={styles.filterContainer}>
//         <label className={styles.label}>Select Dataset:</label>
//         <select className={styles.dropdown} value={selectedDataset} onChange={handleDatasetChange}>
//           <option value="">Select Dataset</option>
//           {datasetIds.map(({ _id, datasetId }) => (
//             <option key={_id} value={datasetId}>
//               {datasetId}
//             </option>
//           ))}
//         </select>

//         {/* Dropdown to select element */}
//         <label className={styles.label}>Select Element:</label>
//         <select className={styles.dropdown} value={selectedElement} onChange={handleElementChange}>
//           <option value="">Select Element</option>
//           <option value="Data Annotation">Data Annotation</option>
//           <option value="Pre-Processing">Pre-Processing</option>
//         </select>
//       </div>

//       <button className={styles.button} onClick={handleCreateElement}>
//         Create Element
//       </button>

//       {/* Table to display the elements */}
//       {elementsTable.length > 0 && (
//         <table className={styles.table}>
//           <thead>
//             <tr>
//               <th className={styles.th}>Element</th>
//               <th className={styles.th}>Dataset Name</th>
//               <th className={styles.th}>Used</th>
//             </tr>
//           </thead>
//           <tbody>
//             {elementsTable.map((item, index) => (
//               <tr key={index} className={styles.tr}>
//                 <td className={styles.td}>{item.element}</td>
//                 <td className={styles.td}>{item.datasetName}</td>
//                 <td className={styles.td}>{item.used}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default DataProcessing;


import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/dataProcessing.module.css';

const DataProcessing = () => {
  const [datasetIds, setDatasetIds] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState('');
  const [selectedElement, setSelectedElement] = useState('');
  const [elementsTable, setElementsTable] = useState([]);

  // Fetch dataset IDs when the component mounts
  useEffect(() => {
    const fetchDatasetIds = async () => {
      try {
        const response = await axios.get('deploy-data-share.vercel.app/api/datasets/ids');
        setDatasetIds(response.data); // Assuming the API returns an array of objects with _id and datasetId
      } catch (error) {
        console.error('Error fetching dataset IDs:', error);
      }
    };

    // Fetch created elements (history)
    const fetchCreatedElements = async () => {
      try {
        const response = await axios.get('deploy-data-share.vercel.app/api/elements');
        setElementsTable(response.data); // Assuming the API returns an array of created elements
      } catch (error) {
        console.error('Error fetching created elements:', error);
      }
    };

    fetchDatasetIds();
    fetchCreatedElements();
  }, []);

  // Handle Dataset selection
  const handleDatasetChange = (e) => {
    setSelectedDataset(e.target.value);
  };

  // Handle Element selection
  const handleElementChange = (e) => {
    setSelectedElement(e.target.value);
  };

  // Handle the creation of an element in the table
  const handleCreateElement = async () => {
    if (selectedDataset && selectedElement) {
      const newElement = {
        element: selectedElement,
        datasetName: selectedDataset,
        used: 'No', // Default value for 'used'
        createdAt: new Date().toISOString(), // Add current date for local update (Backend will handle the official time)
      };

      try {
        // Send the new element to the backend to store it in the database
        await axios.post('deploy-data-share.vercel.app/api/elements', newElement);
        
        // Update the table locally (after successful backend save)
        setElementsTable([...elementsTable, newElement]);
      } catch (error) {
        console.error('Error creating new element:', error);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Data Processing</h1>

      {/* Dropdown to select dataset */}
      <div className={styles.filterContainer}>
        <label className={styles.label}>Select Dataset:</label>
        <select className={styles.dropdown} value={selectedDataset} onChange={handleDatasetChange}>
          <option value="">Select Dataset</option>
          {datasetIds.map(({ _id, datasetId }) => (
            <option key={_id} value={datasetId}>
              {datasetId}
            </option>
          ))}
        </select>

        {/* Dropdown to select element */}
        <label className={styles.label}>Select Element:</label>
        <select className={styles.dropdown} value={selectedElement} onChange={handleElementChange}>
          <option value="">Select Element</option>
          <option value="Data Annotation">Data Annotation</option>
          <option value="Pre-Processing">Pre-Processing</option>
        </select>
      </div>

      <button className={styles.button} onClick={handleCreateElement}>
        Create Element
      </button>

      {/* Table to display the elements */}
      {elementsTable.length > 0 && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>S.N.</th> {/* New Serial Number column */}
              <th className={styles.th}>Element</th>
              <th className={styles.th}>Dataset Name</th>
              <th className={styles.th}>Used</th>
              <th className={styles.th}>Created At</th> {/* Created at column */}
            </tr>
          </thead>
          <tbody>
            {elementsTable.map((item, index) => (
              <tr key={index} className={styles.tr}>
                <td className={styles.td}>{index + 1}</td> {/* Display Serial Number */}
                <td className={styles.td}>{item.element}</td>
                <td className={styles.td}>{item.datasetName}</td>
                <td className={styles.td}>{item.used}</td>
                <td className={styles.td}>{new Date(item.createdAt).toLocaleString()}</td> {/* Format and display createdAt */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DataProcessing;
