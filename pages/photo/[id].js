import React, { useEffect, useRef, useState } from 'react';
import styles from '../../styles/photo.module.scss';

import { Camera } from 'react-camera-pro';
import Resizer from 'react-image-file-resizer';
import mergeImages from 'merge-images';
import { useRouter } from 'next/router'

// import Base64Downloader from 'react-base64-downloader';

let $window = [];

if (typeof window !== 'undefined') {
  $window = window;
}

const Photo = () => {
  const [numberOfCameras, setNumberOfCameras] = useState(0);
  const [image, setImage] = useState(null);
  const [showImage, setShowImage] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const camera = useRef(null);
  const [devices, setDevices] = useState([]);
  const [activeDeviceId, setActiveDeviceId] = useState(undefined);
  const [display, setDisplay] = useState('block');
  const router = useRouter();
  const [member, setMember] = useState('');

  const getBase64FromUrl = async (url) => {
    const data = await fetch(url);
    const blob = await data.blob();
    let base64data = '';
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
    const parts = base64Image.split(';base64,');

    // Hold the content type
    const imageType = parts[0].split(':')[1];

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
  const resizeFile = (file, w, h) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        w,
        h,
        'PNG',
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        'base64',
        w,
        h,
      );
    });
  useEffect(() => {
    (async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((i) => i.kind == 'videoinput');
      setDevices(videoDevices);
    })();
  });

  useEffect(() => {
    if (router.query.id) {
      setMember(router.query.id);
    }
    // const arr = queryStr.split('=');
    // setFileName(arr[1]);
    console.log(member);
  }, [member]);

  return (
    <>
      <div id="img_head_back">
        <div className={styles.wrapper}>
          {showImage ? (
            <div className={styles['full-screen-image-preview']}
              style={{ backgroundImage:  `${image ? `url("${image}")` : ''}`}}
              image={image}
              onClick={() => {
                setShowImage(!showImage);
                setDisplay(display === 'none' ? 'block' : 'none');
              }}
            />
          ) : (
            <Camera
              ref={camera}
              facingMode="environment"
              aspectRatio="cover"
              // aspectRatio={16 / 9}
              numberOfCamerasCallback={(i) => setNumberOfCameras(i)}
              videoSourceDeviceId={activeDeviceId}
              errorMessages={{
                noCameraAccessible:
                  'No camera device accessible. Please connect your camera or try a different browser.',
                permissionDenied: 'Permission denied. Please refresh and give camera permission.',
                switchCamera:
                  'It is not possible to switch camera to different one because there is only one video device accessible.',
                canvas: 'Canvas is not supported.',
              }}
              videoReadyCallback={() => {
                console.log('Video feed ready.');
              }}
            />
          )}
          {display === 'block' && (
            <div id="img_head" className={styles['image-head']}>
              {$window?.innerWidth > $window?.innerHeight ? (
                <img
                  src={'/images/characters/land-' + member + '.png'}
                  alt={'test'}
                  style={{ width: $window?.innerWidth - 130, height: $window?.innerHeight }}
                />
              ) : (
                <img
                  src={'/images/characters/port-' + member + '.png'}
                  alt={'test'}
                  style={{ width: $window?.innerWidth}}
                />
              )}
            </div>
          )}
          <div className={styles.control}>
            <select
              style={{ display: 'none' }}
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
            <div className={styles['image-preview']}
              style={{ backgroundImage:  `${image ? `url("${image}")` : ''}`}}
              image={image}
              onClick={() => {
                setShowImage(!showImage);
                setDisplay(display === 'none' ? 'block' : 'none');
              }}
            />

            {showDownload ? (
              // <Base64Downloader base64={image} downloadName="file_name">
              //   download
              // </Base64Downloader>
              <></>
            ) : (
              <></>
            )}

            <div className={`${styles.button} ${styles['take-photo-button']}`}
              onClick={async () => {
                if (camera.current) {
                  const url = '/images/characters/';
                  let endpoint = '';

                  // 相機圖
                  const photo = camera.current.takePhoto();
                  // const blob = convertBase64ToBlob(photo);
                  const img = new Image();
                  img.onload = async () => {
                    // console.log(this.width + 'x' + this.height);
                    // 相機寬高
                    // alert('W:' + camera.current.getW() + ' H:' + camera.current.getH());
                    if (img.width > img.height) {
                      endpoint = url + 'land-' + member + '.png';
                    } else {
                      endpoint = url + 'port-' + member + '.png';
                    }

                    // 匡
                    const frame = await getBase64FromUrl(endpoint);
                    const blob2 = convertBase64ToBlob(frame);

                    try {
                      const png = await resizeFile(blob2, img.width, img.height);
                      // console.log('o:', photo);
                      mergeImages([
                        { src: photo, x: 0, y: 0 },
                        { src: png, x: 0, y: 0 },
                      ]).then((b64) => {
                        setImage(b64);
                        setShowDownload(true);
                        // console.log('n:', b64);
                      });
                    } catch (err) {
                      console.log(err);
                    }
                  }
                  img.src = photo;
                }
              }}
            />
            <div className={`${styles.button} ${styles['change-facing-camera-button']}`}
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
