import { useRouter } from "next/router";
import styles from "../../styles/home.module.scss";
import Layout from "../../components/layout";
import React, { useEffect, useState } from "react";
import Resizer from "react-image-file-resizer";
import mergeImages from "merge-images";

export default function Merge() {
  const router = useRouter();
  const [member, setMember] = useState("");
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);

  const getBase64FromUrl = async (url) => {
    const data = await fetch(url);
    const blob = await data.blob();
    let base64data = "";
    await new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        base64data = reader.result;
        resolve(base64data);
      };
    });
    return base64data;
  };

  const convertBase64ToBlob = (base64Image) => {
    // Split into two parts
    const parts = base64Image.split(";base64,");

    // Hold the content type
    const imageType = parts[0].split(":")[1];

    // Decode Base64 string
    const decodedData = window?.atob(parts[1]);

    // Create UNIT8ARRAY of size same as row data length
    const uInt8Array = new Uint8Array(decodedData.length);

    // Insert all character code into uInt8Array
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i);
    }

    // Return BLOB image after conversion
    return new Blob([uInt8Array], { type: imageType });
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const resizeFile = (file, w, h) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        w,
        h,
        "PNG",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64",
        w,
        h
      );
    });

  const handleUploadClick = async () => {
    if (!file) {
      return;
    }

    const url = `${process.env.BASE_PATH}` + "/images/characters/";
    let endpoint = "";
    const w = 1920;
    const h = 1080;

    // todo resize & mergeImages
    if (window.innerWidth > window.innerHeight) {
      endpoint = url + "land-" + member + ".png";
    } else {
      endpoint = url + "port-" + member + ".png";
      const w = 1080;
      const h = 1920;
    }

    const frame = await getBase64FromUrl(endpoint);
    const blob2 = convertBase64ToBlob(frame);

    const png1 = await resizeFile(file, w, h); // 上傳檔案
    const png2 = await resizeFile(blob2, w, h); // 匡
    mergeImages([
      { src: png1, x: 0, y: 0 },
      { src: png2, x: 0, y: 0 },
    ]).then((b64) => {
      setImage(b64);
    });
  };

  useEffect(() => {
    if (router.query.id) {
      setMember(router.query.id);
    }
  }, [member]);

  return (
    <Layout>
      <main className={styles.main}>
        <div className={styles.func}>
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUploadClick}>Upload</button>
        </div>

        <div
          style={{
            width: 1980,
            height: 1020,
            backgroundImage: `${image ? `url("${image}")` : ""}`,
          }}
          image={image}
          onClick={() => {
            // alert(1);
          }}
        />
      </main>
    </Layout>
  );
}
