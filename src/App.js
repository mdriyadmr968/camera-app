import React, { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import Modal from "react-modal";

function App() {
  const [img, setImg] = useState(null);
  const [images, setImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const webcamRef = useRef(null);

  const videoWidth = 400;
  const videoHeight = 400;
  const centerX = videoWidth / 2;
  const centerY = videoHeight / 2;

  const [boundaryBox, setBoundaryBox] = useState({
    x: centerX - 150,
    y: centerY - 150,
    width: 300,
    height: 300,
    // visibility: false,
  });

  const videoConstraints = {
    width: videoWidth,
    height: videoHeight,
    facingMode: "user",
  };

  const capture = React.useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => (image.onload = resolve));
    canvas.width = image.width * 0.7;
    canvas.height = image.height * 0.7;
    const width70 = image.width * 0.7;
    const height70 = image.height * 0.7;

    ctx.drawImage(
      image,
      (image.width - width70) / 2,
      (image.height - height70) / 2,
      width70,
      height70,
      0,
      0,
      canvas.width,
      canvas.height
    );
    setImages([...images, canvas.toDataURL("image/jpeg")]);
    localStorage.setItem(
      "webcamImages",
      JSON.stringify([...images, canvas.toDataURL("image/jpeg")])
    );
  }, [webcamRef, images]);

  const saveImage = useCallback(() => {
    // Write code to save the image to the desired location here
    setImg(null);
    setShowModal(false);
  }, [img]);

  useEffect(() => {
    const imagesFromLocalStorage = localStorage.getItem("webcamImages");
    if (imagesFromLocalStorage) {
      setImages(JSON.parse(imagesFromLocalStorage));
    }
  }, []);

  const handleDownload = (file) => {
    const link = document.createElement("a");
    link.href = file;
    link.download = "image";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const deleteImage = (singleImage) => {
    const currentImages =
      JSON.parse(localStorage.getItem("webcamImages")) || [];
    const newImages = currentImages.filter(
      (newImage) => newImage !== singleImage
    );

    setImages(newImages);
    localStorage.setItem("webcamImages", JSON.stringify(newImages));
  };

  return (
    <div className="Container">
      <Modal isOpen={showModal} onRequestClose={() => setShowModal(false)}>
        <h2>Saved Images</h2>
        <div>
          {/* saved image */}
          {images.map((singleImage) => (
            <div>
              <img src={singleImage} alt="Webcam Capture from Local Storage" />
              <button
                onClick={() => {
                  handleDownload(singleImage);
                }}
              >
                Download
              </button>
              <button
                onClick={() => {
                  deleteImage(singleImage);
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
        <button onClick={() => setShowModal(false)}>Close</button>
      </Modal>
      <>
        <Webcam
          audio={false}
          mirrored={true}
          height={400}
          width={400}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
        />
        <div
          style={{
            position: "absolute",
            top: boundaryBox.y,
            left: boundaryBox.x,
            width: boundaryBox.width,
            height: boundaryBox.height,
            border: "1px solid red",
          }}
        />
        <button onClick={capture}>Capture photo</button>
        <button onClick={() => setShowModal(true)}>Save</button>
      </>
    </div>
  );
}

export default App;
