import React, { useEffect, useState } from 'react';
import StatsCard from '../components/StatsCard';
import axios from 'axios'; // Make sure you have Axios installed
import styles from '../styles/dashboard.module.css';
const Dashboard = () => {
  const [totalFiles, setTotalFiles] = useState(0);
  const [totalInfluencers, setTotalInfluencers] = useState(10); // Assuming you still want to keep this as a dummy value

  useEffect(() => {  
    const fetchTotalFiles = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/files/total-files'); // Update with your backend URL
        setTotalFiles(response.data.totalFiles);
      } catch (error) {
        console.error('Error fetching total files:', error);
      }
    };
    fetchTotalFiles();
  }, []);

  return (
    <div className="dashboard-container">
    <h1 className="dashboard-title">Dashboard</h1>
    <div className="dashboard-stats">
      <StatsCard title="Total Files" count={totalFiles} />
      <StatsCard title="Total Influencers" count={totalInfluencers} />
    </div>
  </div>
);
};

export default Dashboard;
