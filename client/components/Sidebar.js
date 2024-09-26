// import Link from 'next/link';
// import styles from '../styles/Sidebar.module.css';

// const Sidebar = () => {
//   return (
//     <nav className={styles.sidebar}>
//       <ul>
//         <li><Link href="/dashboard">Dashboard</Link></li>
//         <li><Link href="/data-explorer">Data Explorer</Link></li>
//         <li><Link href="/data-processing">Data Processing</Link></li>
//       </ul>
//     </nav>
//   );
// };

// export default Sidebar;


import Link from 'next/link';
import styles from '../styles/Sidebar.module.css';

const Sidebar = () => {
  return (
    <nav className={styles.sidebar}>
      <ul className={styles.menuItems}>
        <li><Link href="/dashboard">Dashboard</Link></li>
        <li><Link href="/data-explorer">Data Explorer</Link></li>
        <li><Link href="/data-processing">Data Processing</Link></li>
      </ul>
      <ul className={styles.bottomItem}>
        <li><Link href="/preprocessed-data">Pre-processed Data</Link></li>
      </ul>
    </nav>
  );
};

export default Sidebar;
