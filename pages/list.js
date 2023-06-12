import { useRouter } from 'next/navigation'
import styles from '../styles/home.module.scss';
import Layout from '../components/layout';

export default function List() {
  const router = useRouter();
  return (
    <Layout>
      <ul className={styles.list}>
        <li onClick={() => router.push('/photo/1')}>
          <img src="/images/characters/land-1.png" />
        </li>
        <li onClick={() => router.push('/photo/2')}>
          <img src="/images/characters/land-2.png" />
        </li>
        <li onClick={() => router.push('/photo/3')}>
          <img src="/images/characters/land-3.png" />
        </li>
        <li onClick={() => router.push('/photo/4')}>
          <img src="/images/characters/land-4.png" />
        </li>
      </ul>
    </Layout>
  )
}
