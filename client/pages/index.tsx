// // pages/index.tsx
// import React from 'react';
// import Link from 'next/link';

// export default function Home() {
//   return (
//     <div>
//       <h1>Welcome to My App</h1>
//       <Link href="/login">Login</Link>
//       <br />
//       {/* <Link href="/register">Register</Link> */}
//     </div>
//   );
// }

import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Data Lake</h1>
      <div style={styles.linkContainer}>
        <Link href="/login" style={styles.button}>
          Login
        </Link>
        {/* Uncomment this if you want to enable registration */}
        {/* <Link href="/register" style={styles.button}>
          Register
        </Link> */}
      </div>
    </div>
  );
}


const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0',
  },
  heading: {
    fontSize: '3rem',
    marginBottom: '2rem',
    color: '#333',
  },
  linkContainer: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
  },
  button: {
    padding: '0.8rem 2rem',
    backgroundColor: '#0070f3',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '5px',
    fontSize: '1.2rem',
    marginTop: '1rem',
    cursor: 'pointer',
  },
};
