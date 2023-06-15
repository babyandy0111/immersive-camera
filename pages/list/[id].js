import {useRouter} from 'next/router';
import styles from '../../styles/home.module.scss';
import Layout from '../../components/layout';
import {useEffect, useState} from "react";

export default function Id() {
  const router = useRouter();
  const [type, setType] = useState('');

  useEffect(() => {
    if (router.query.id) {
      setType(router.query.id);
    }
  }, [type]);

  function pushPage(member) {
    if(type==="mix"){
      router.push('/merge/' + member)
    } else {
      router.push('/photo/' + member)
    }
  }

  return (
    <Layout>
      <ul className={styles.list}>
        <li onClick={()=>pushPage(1)}>
          <img src="/images/characters/land-1.png" />
        </li>
        <li onClick={()=>pushPage(2)}>
          <img src="/images/characters/land-2.png" />
        </li>
        <li onClick={()=>pushPage(3)}>
          <img src="/images/characters/land-3.png" />
        </li>
        <li onClick={()=>pushPage(4)}>
          <img src="/images/characters/land-4.png" />
        </li>
      </ul>
    </Layout>
  )
}
