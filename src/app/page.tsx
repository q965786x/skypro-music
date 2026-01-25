import styles from './page.module.css';
//import './page.css';
import Navigation from './components/Navigation/Navigation';
import CenterBlock from './components/CenterBlock/CenterBlock';
import SideBar from './components/SideBar/SideBar';
import Bar from './components/Bar/Bar';

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.main}>
          <Navigation />
          <CenterBlock />
          <SideBar />
        </main>
        <Bar />
        <footer className="footer"></footer>
      </div>
    </div>
  );
}
