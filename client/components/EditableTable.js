import { useState } from 'react';


const EditableTable = ({ datasets }) => {
    const [editableDatasets, setEditableDatasets] = useState(datasets);
  
  

  return (
    <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th>Image</th>
          <th>Text</th>
          <th>Post URL</th>
          <th>Likes Count</th>
          <th>Owner Username</th>
        </tr>
      </thead>
      <tbody>
        {editableDatasets.length > 0 ? (
          editableDatasets.map((item, index) => (
            <tr key={index}>
              <td>
                <img src={item.ownerProfilePicUrl} alt={item.ownerUsername} style={{ width: '50px', borderRadius: '50%' }} />
              </td>
              <td>{item.text}</td>
              <td>
                <a href={item.postUrl} target="_blank" rel="noopener noreferrer">View Post</a>
              </td>
              <td>{item.likesCount}</td>
              <td>{item.ownerUsername}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5">No datasets found</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default EditableTable;