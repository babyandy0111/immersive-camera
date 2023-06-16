import { useRouter } from "next/router";
import homeStyles from "../../styles/home.module.scss";
import mergeStyles from '../../styles/merge.module.scss';
import Layout from "../../components/layout";
import React, { useEffect, useState } from "react";
import Resizer from "react-image-file-resizer";
import mergeImages from "merge-images";

let $window = {};
if (typeof window !== "undefined") {
  $window = window;
}

export default function Merge() {
  const router = useRouter();
  const [member, setMember] = useState("");
  // const [blobFile, setBlobFile] = useState(null);
  // const [uploadPhoto, setUploadPhoto] = useState(null);
  const [image, setImage] = useState(null);
  
  const [aspectRatioX, setAspectRatioX] = useState(9);
  const [aspectRatioY, setAspectRatioY] = useState(16);
  const [framePhotoSrc, setFramePhotoSrc] = useState(
    `${process.env.BASE_PATH}/images/characters/port-1.png`
  );
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

  const getBase64FromBlob = async (file) => {
    let base64data = '';
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        base64data = reader.result;
        resolve(base64data);
      };
    });
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

  /**
   * @url - Source of the image to use (or base64 image)
   * @aspectRatio - The aspect ratio to apply, ex: 1/1, 16/9, 4/3... etc.
   */
  const crop = (url, aspectRatio) => {
    return new Promise((resolve) => {
      // this image will hold our source image data
      const inputImage = new Image();

      // we want to wait for our image to load
      inputImage.onload = () => {
        // let's store the width and height of our image
        const inputWidth = inputImage.naturalWidth;
        const inputHeight = inputImage.naturalHeight;

        // get the aspect ratio of the input image
        const inputImageAspectRatio = inputWidth / inputHeight;

        // if it's bigger than our target aspect ratio
        let outputWidth = inputWidth;
        let outputHeight = inputHeight;
        if (inputImageAspectRatio > aspectRatio) {
          outputWidth = inputHeight * aspectRatio;
        } else if (inputImageAspectRatio < aspectRatio) {
          outputHeight = inputWidth / aspectRatio;
        }

        // calculate the position to draw the image at
        const outputX = (outputWidth - inputWidth) * 0.5;
        const outputY = (outputHeight - inputHeight) * 0.5;

        // create a canvas that will present the output image
        const outputImage = document.createElement("canvas");

        // set it to the same size as the image
        outputImage.width = outputWidth;
        outputImage.height = outputHeight;

        // draw our image at position 0, 0 on the canvas
        const ctx = outputImage.getContext("2d");
        ctx.drawImage(inputImage, outputX, outputY);
        resolve(outputImage.toDataURL("image/jpeg"));
      };

      // start loading our image
      inputImage.src = url;
    });
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

    const handleFileChange = async (e) => {
      if (e.target.files) {
        const base64Photo = await getBase64FromBlob(e.target.files[0]);

        const photoImg = new Image();
        photoImg.onload = async () => {
          const { width, height } = photoImg;
          let preResizePhoto = base64Photo;
          console.log('a');
          if ((aspectRatioX === 9 && aspectRatioY === 16 && width > height) || (aspectRatioX === 16 && aspectRatioY === 9 && width < height)) {
            console.log('b', preResizePhoto, aspectRatioX, aspectRatioY);
            preResizePhoto = await crop(preResizePhoto, aspectRatioX / aspectRatioY);            
          }
          console.log('c');
          const cover2BlobPhoto = convertBase64ToBlob(preResizePhoto);
          console.log('d', cover2BlobPhoto);

          let sX = 1920;
          let sY = 1080;
          if (aspectRatioX === 9 && aspectRatioY === 16) {
            sX = 1080;
            sY = 1920;
          }
          const resizePhoto = await resizeFile(cover2BlobPhoto, sX, sY);
          setImage(resizePhoto);
          console.log(resizePhoto);
  
        }
        photoImg.src = base64Photo;

        // setUploadPhoto(base64Photo);
        // setBlobFile(e.target.files[0]);
      }
    };
  
  const handleUploadClick = async () => {
  //   if (!file) {
  //     return;
  //   }

  //   const url = `${process.env.BASE_PATH}` + "/images/characters/";
  //   let endpoint = "";
  //   const w = 1920;
  //   const h = 1080;

  //   // todo resize & mergeImages
  //   if (window.innerWidth > window.innerHeight) {
  //     endpoint = url + "land-" + member + ".png";
  //   } else {
  //     endpoint = url + "port-" + member + ".png";
  //     const w = 1080;
  //     const h = 1920;
  //   }

  //   const frame = await getBase64FromUrl(endpoint);
  //   const blob2 = convertBase64ToBlob(frame);

  //   const png1 = await resizeFile(file, w, h); // 上傳檔案
  //   const png2 = await resizeFile(blob2, w, h); // 匡
  //   mergeImages([
  //     { src: png1, x: 0, y: 0 },
  //     { src: png2, x: 0, y: 0 },
  //   ]).then((b64) => {
  //     setImage(b64);
  //   });
  };

  useEffect(() => {
    if (router.query.id) {
      setMember(router.query.id);
    }
  }, [member]);

  const resizeWindow = () => {
    let landPort = "land";
    if ($window?.innerWidth > $window?.innerHeight) {
      setAspectRatioX(16);
      setAspectRatioY(9);
      landPort = "land";
    } else {
      setAspectRatioX(9);
      setAspectRatioY(16);
      landPort = "port";
    }
    setFramePhotoSrc(
      `${process.env.BASE_PATH}/images/characters/${landPort}-${router.query.id}.png`
    );
  };

  useEffect(() => {
    if ($window !== undefined) {
      resizeWindow();
      $window.onresize = function () {
        resizeWindow();
      };
    }
  }, [aspectRatioX, aspectRatioY]);

  return (
    <Layout>
      <main className={`${homeStyles.main}`}>
        <div className={mergeStyles['preview-img']} style={{ backgroundImage: `url(${framePhotoSrc}`}}></div>
        <div className={`${homeStyles.func} ${mergeStyles.func}`}>
          <div className={mergeStyles['select-file']}>
            <input type="file" onChange={handleFileChange} />
            <button>選擇照片</button>
          </div>
          <button onClick={handleUploadClick}>下載照片</button>
        </div>

        <div
          className={mergeStyles['photo-img']}
          style={{
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
