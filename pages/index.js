import { useRouter } from "next/navigation";
import styles from "../styles/home.module.scss";
import Layout from "../components/layout";

export default function Home() {
  const router = useRouter();

  return (
    <Layout>
      <main
        className={styles.main}
        style={{
          backgroundImage: `url(${process.env.BASE_PATH}/images/bg3.png)`,
        }}
      >
        <div className={styles.func}>
          <img src={`${process.env.BASE_PATH}` + "/images/logo.png"} />
          <p>第四屆新北市議會<br />議員合影系統</p>
          <button type="button" onClick={() => router.push("/list/ar")}>現場合影系統</button>
        </div>
      </main>
    </Layout>
  );
}
