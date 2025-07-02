import { useState, useEffect, useRef } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

function FaceMeshComponent() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  useEffect(() => {
    const faceMesh = new FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults((results) => {
      const canvasElement = canvasRef.current;
      const canvasCtx = canvasElement.getContext("2d");

      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.drawImage(
        results.image,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );

      if (results.multiFaceLandmarks) {
        for (const landmarks of results.multiFaceLandmarks) {
          // console.log(landmarks);
          console.log("chin:", landmarks[152])
          console.log("left jaw:", landmarks[234])
          console.log("right jaw:", landmarks[454])
          console.log("forehead:", landmarks[10])
          console.log("nose tip:", landmarks[1])
          console.log("left cheek:", landmarks[93])
          console.log("right cheek:", landmarks[323])
          for (const point of landmarks) {
            canvasCtx.beginPath();
            canvasCtx.arc(
              point.x * canvasElement.width,
              point.y * canvasElement.height,
              1.5,
              0,
              2 * Math.PI
            );
            canvasCtx.fillStyle = "lime";
            canvasCtx.fill();
          }
        }
      }
      canvasCtx.restore();
    });
    if (typeof videoRef.current !== "undefined" && videoRef.current !== null) {
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          await faceMesh.send({ image: videoRef.current });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }
  }, []);

  return (
    <div>
      <video
        ref={videoRef}
        style={{ display: "none" }}
        width="640"
        height="480"
      />
      <canvas ref={canvasRef} width="640" height="480" />
    </div>
  );
}

export default FaceMeshComponent;
