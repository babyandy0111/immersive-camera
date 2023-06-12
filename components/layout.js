import Head from 'next/head';
import styles from '../styles/home.module.scss';

export default function Layout({ children }) {
  return <div className={styles.container}>
    <Head>
      <title>新北市議會類 AR 合照系統</title>
      <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no"/>
      <link rel="icon" href="/favicon.png" />
    </Head>
    {children}
  </div>;
}