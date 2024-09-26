const FilterBar = ({ filter, setFilter }) => {
    return (
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search Files"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: '10px', width: '300px' }}
        />
      </div>
    );
  };
  
  export default FilterBar;
  