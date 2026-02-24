import { ReactNode } from 'react';
import styles from './layout.module.css';

type MusicLayoutProps = {
  children: ReactNode;
};

export default function MusicLayout({ children }: MusicLayoutProps) {
  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.container}>{children}</div>
      </div>
    </>
  );
}
