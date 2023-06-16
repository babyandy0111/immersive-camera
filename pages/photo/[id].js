import React, { useEffect, useRef, useState } from "react";
import styles from "../../styles/photo.module.scss";

import { Camera } from "react-camera-pro";
import Resizer from "react-image-file-resizer";
import mergeImages from "merge-images";
import { useRouter } from "next/router";

// import Base64Downloader from 'react-base64-downloader';

let $window = [];

if (typeof window !== "undefined") {
  $window = window;
}

const Photo = () => {
  const [numberOfCameras, setNumberOfCameras] = useState(0);
  const [image, setImage] = useState(null);
  const [showImage, setShowImage] = useState(false);
  // const [showDownload, setShowDownload] = useState(false);
  const camera = useRef(null);
  const [devices, setDevices] = useState([]);
  const [activeDeviceId, setActiveDeviceId] = useState(undefined);
  const [display, setDisplay] = useState("block");
  const router = useRouter();
  const [member, setMember] = useState("");
  const [aspectRatioX, setAspectRatioX] = useState(9);
  const [aspectRatioY, setAspectRatioY] = useState(16)
  const [framePhotoSrc, setFramePhotoSrc] = useState(`${process.env.BASE_PATH}/images/characters/port-1.png`);

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
    const decodedData = $window?.atob(parts[1]);

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
    
    return new Promise(resolve => {

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
        const outputX = (outputWidth - inputWidth) * .5;
        const outputY = (outputHeight - inputHeight) * .5;

        // create a canvas that will present the output image
        const outputImage = document.createElement('canvas');

        // set it to the same size as the image
        outputImage.width = outputWidth;
        outputImage.height = outputHeight;

        // draw our image at position 0, 0 on the canvas
        const ctx = outputImage.getContext('2d');
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

  useEffect(() => {
    (async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((i) => i.kind == "videoinput");
      setDevices(videoDevices);
    })();
  });

  useEffect(() => {
    if (router.query.id) {
      setMember(router.query.id);
    }
  }, [member]);

  const resizeWindow = () => {
    let landPort = 'land';
    if ($window.innerWidth > $window.innerHeight) {
      setAspectRatioX(16);
      setAspectRatioY(9);
      landPort = 'land';
    } else {
      setAspectRatioX(9);
      setAspectRatioY(16);
      landPort = 'port';
    }
    setFramePhotoSrc(`${process.env.BASE_PATH}/images/characters/${landPort}-${router.query.id}.png`);
  }

  useEffect(() => {
    if ($window !== undefined) {
      resizeWindow();
      $window.onresize = function() {
        resizeWindow();
      }
    }
  }, [aspectRatioX, aspectRatioY])

  return (
    <>
      <div id="img_head_back">
        <div className={styles.wrapper}>
          {showImage ? (
            <div
              className={styles["full-screen-image-preview"]}
              style={{ backgroundImage: `${image ? `url("${image}")` : ""}` }}
              image={image}
              onClick={() => {
                setShowImage(!showImage);
                setDisplay(display === "none" ? "block" : "none");
              }}
            />
          ) : (
            <Camera
              ref={camera}
              facingMode="environment"
              aspectRatio={aspectRatioX / aspectRatioY}
              numberOfCamerasCallback={(i) => setNumberOfCameras(i)}
              videoSourceDeviceId={activeDeviceId}
              errorMessages={{
                noCameraAccessible:
                  "No camera device accessible. Please connect your camera or try a different browser.",
                permissionDenied:
                  "Permission denied. Please refresh and give camera permission.",
                switchCamera:
                  "It is not possible to switch camera to different one because there is only one video device accessible.",
                canvas: "Canvas is not supported.",
              }}
              videoReadyCallback={() => {
                console.log("Video feed ready.");
              }}
            />
          )}
          {display === "block" && (
            <div id="img_head" className={styles["image-head"]}>
              <img
                src={ framePhotoSrc }
                style={{
                  width: '100%',
                  height: 'auto',
                }}
              />
            </div>
          )}
          <div className={styles.control}>
            <select
              style={{ display: "none" }}
              onChange={(event) => {
                setActiveDeviceId(event.target.value);
              }}
            >
              {devices.map((d) => (
                <option key={d.deviceId} value={d.deviceId}>
                  {d.label}
                </option>
              ))}
            </select>
            <div
              className={styles["image-preview"]}
              style={{ backgroundImage: `${image ? `url("${image}")` : ""}` }}
              image={image}
              onClick={() => {
                setShowImage(!showImage);
                setDisplay(display === "none" ? "block" : "none");
              }}
            />

            <div
              className={`${styles.button} ${styles["take-photo-button"]}`}
              onClick={async () => {
                if (camera.current) {
                  // 相機圖
                  const photo = camera.current.takePhoto();
                  const cropPhoto = await crop(photo, aspectRatioX/aspectRatioY);
                  // const blob = convertBase64ToBlob(photo);
                  const img = new Image();
                  img.onload = async () => {
                    // 匡
                    const frame = await getBase64FromUrl(framePhotoSrc);
                    const blob2 = convertBase64ToBlob(frame);

                    try {
                      const png = await resizeFile(
                        blob2,
                        img.width,
                        img.height
                      );
                      // console.log('o:', photo);
                      mergeImages([
                        { src: cropPhoto, x: 0, y: 0 },
                        { src: png, x: 0, y: 0 },
                      ]).then((b64) => {
                        setImage(b64);
                      });
                    } catch (err) {
                      console.log(err);
                    }
                  };
                  img.src = cropPhoto;
                }
              }}
            />
            <div
              className={`${styles.button} ${styles["change-facing-camera-button"]}`}
              style={{ visibility: "hidden" }}
              disabled={numberOfCameras <= 1}
              onClick={() => {
                if (camera.current) {
                  const result = camera.current.switchCamera();
                  console.log(result);
                }
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Photo;
