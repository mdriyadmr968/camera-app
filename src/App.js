import React, { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import Modal from "react-modal";

function App() {
  const [img, setImg] = useState(null);
  const [images, setImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const webcamRef = useRef(null);

  const videoConstraints = {
    width: 420,
    height: 420,
    facingMode: "user",
  };

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImages([...images, imageSrc]);
    localStorage.setItem("webcamImages", JSON.stringify([...images, imageSrc]));
    // console.log("clicked");
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
        <button onClick={capture}>Capture photo</button>
        <button onClick={() => setShowModal(true)}>Save</button>
      </>
    </div>
  );
}

export default App;
