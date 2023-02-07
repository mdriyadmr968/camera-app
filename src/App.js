import React, { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import Modal from "react-modal";

function App() {
  const [img, setImg] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const webcamRef = useRef(null);

  const videoConstraints = {
    width: 420,
    height: 420,
    facingMode: "user",
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImg(imageSrc);
    localStorage.setItem("webcamImage", imageSrc);
  }, [webcamRef]);

  const saveImage = useCallback(() => {
    // Write code to save the image to the desired location here
    setImg(null);
    setShowModal(false);
  }, [img]);

  return (
    <div className="Container">
      <Modal isOpen={showModal} onRequestClose={() => setShowModal(false)}>
        <h2>Saved Images</h2>
        <div>{/* Show the saved images here */}</div>
        <button onClick={() => setShowModal(false)}>Close</button>
      </Modal>
      {img === null ? (
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
        </>
      ) : (
        <>
          <img src={img} alt="screenshot" />
          <button onClick={() => setImg(null)}>Retake</button>
          <button onClick={() => setShowModal(true)}>Save</button>
        </>
      )}
    </div>
  );
}

export default App;
