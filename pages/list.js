import styles from '../styles/home.module.scss';
import Layout from '../components/layout';

export default function Home() {
  return (
    <Layout>
      <ul className={styles.list}>
        <li>
          <img src="/images/characters/land-1.png" />
        </li>
        <li>
          <img src="/images/characters/land-2.png" />
        </li>
        <li>
          <img src="/images/characters/land-3.png" />
        </li>
        <li>
          <img src="/images/characters/land-4.png" />
        </li>
      </ul>
    </Layout>
  )
}
