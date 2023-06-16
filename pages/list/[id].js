import { useRouter } from "next/router";
import styles from "../../styles/home.module.scss";
import Layout from "../../components/layout";
import { useEffect, useState } from "react";
import memberList from '../../public/assets/member.json';

export default function Id() {
  const router = useRouter();
  const [type, setType] = useState("");

  useEffect(() => {
    if (router.query.id) {
      setType(router.query.id);
    }
  }, [type]);

  function pushPage(member) {
    if (type === "mix") {
      router.push("/merge/" + member);
    } else {
      router.push("/photo/" + member);
    }
  }

  return (
    <Layout>
      <ul className={styles.list}>
        {memberList.map((data) => (
          <li onClick={() => pushPage(data.member)}>
            <img
              src={`${process.env.BASE_PATH}${data.url}`}
            />
          </li>
        ))}
      </ul>
    </Layout>
  );
}
