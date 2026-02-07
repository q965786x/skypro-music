import styles from './page.module.css';
//import './page.css';
import Navigation from './components/Navigation/Navigation';
import { Centerblock } from './components/Centerblock/Centerblock';
import Sidebar from './components/Sidebar/Sidebar';
import Bar from './components/Bar/Bar';
import { data } from '@/data';

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.main}>
          <Navigation />
          <Centerblock tracks={data} />
          <Sidebar />
        </main>
        <Bar />
        <footer className="footer"></footer>
      </div>
    </div>
  );
}
