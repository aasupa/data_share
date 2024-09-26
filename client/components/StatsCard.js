const StatsCard = ({ title, count }) => {
    return (
      <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
        <h3>{title}</h3>
        <p>{count}</p>
      </div>
    );
  };
  
  export default StatsCard;
  