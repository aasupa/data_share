// // pages/login.tsx
// import { useState } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/router';
// import styles from '../styles/login.module.css';

// export default function Login() {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     try {
//       const { data } = await axios.post('http://localhost:3001/api/login', { username, password });
//       localStorage.setItem('token', data.token);
//       localStorage.setItem('username', data.username);
//       router.push('/files');
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <form onSubmit={handleSubmit} className={styles.form}>
//         <h1>Login</h1>
//         <label>
//           Username:
//           <input
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             required
//           />
//         </label>
//         <label>
//           Password:
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </label>
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// }
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from '../styles/login.module.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('https://deploy-data-share-server.vercel.app/api/login', { username, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username); // Store the username
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1>Login</h1>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
