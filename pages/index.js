import { useRouter } from 'next/navigation'
import styles from '../styles/home.module.scss';
import Layout from '../components/layout';

export default function Home() {
  const router = useRouter();

  return (
    <Layout>
      <main className={styles.main}>
        <div className={styles.func}>
          <img src="/images/logo.png" />
          <p>歡迎使用新北市議會<br />類 AR 合照系統</p>
          <button type="button" onClick={() => router.push('/list/ar')}>ENTER</button>
        </div>
      </main>
    </Layout>
  )
}
