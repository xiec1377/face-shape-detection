import { useState, useEffect, useRef } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

function FaceMeshComponent({ setFaceshape }) {
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
          const chin = landmarks[152];
          console.log("chin:", chin);
          const leftJaw = landmarks[234];
          console.log("left jaw:", leftJaw);
          const rightJaw = landmarks[454];
          console.log("right jaw:", rightJaw);
          const forehead = landmarks[10];
          console.log("forehead:", forehead);
          const leftTemple = landmarks[127];
          console.log("leftTemple:", leftTemple);
          const rightTemple = landmarks[356];
          console.log("rightTemple:", rightTemple);
          const noseTip = landmarks[1];
          console.log("nose tip:", noseTip);
          const leftCheek = landmarks[93];
          console.log("left cheek:", leftCheek);
          const rightCheek = landmarks[323];
          console.log("right cheek:", rightCheek);
          const cheekWidth = Math.hypot(
            rightCheek.x * canvasElement.width - leftCheek.x * canvasElement.width,
            rightCheek.y * canvasElement.height - leftCheek.y * canvasElement.height
          );


          const faceHeight = Math.hypot(
            chin.x * canvasElement.width - forehead.x * canvasElement.width,
            chin.y * canvasElement.height - forehead.y * canvasElement.height
          );
          console.log("face height:", faceHeight);

          const jawWidth = Math.hypot(
            rightJaw.x * canvasElement.width - leftJaw.x * canvasElement.width,
            rightJaw.y * canvasElement.height - leftJaw.y * canvasElement.height
          );
          console.log("jaw width:", jawWidth);

          const faceWidth = Math.hypot(
            rightCheek.x * canvasElement.width -
              leftCheek.x * canvasElement.width,
            rightCheek.y * canvasElement.height -
              leftCheek.y * canvasElement.height
          );
          console.log("face width:", faceWidth);

          const foreheadWidth = Math.hypot(
            rightTemple.x * canvasElement.width -
              leftTemple.x * canvasElement.width,
            rightTemple.y * canvasElement.height -
              leftTemple.y * canvasElement.height
          );
          console.log("foreheadWidth:", foreheadWidth);

          if (faceHeight > faceWidth && foreheadWidth > jawWidth) {
            console.log("OVAL SHAPE");
            setFaceshape("oval");
          } else if (Math.abs(faceHeight - faceWidth) < 20 && jawWidth < cheekWidth && jawWidth < cheekWidth) {
            console.log("ROUND SHAPE");
            setFaceshape("round");
          } else if (Math.abs(faceHeight - faceWidth) < 20 && Math.abs(jawWidth - foreheadWidth) < 20) {
            console.log("SQUARE SHAPE");
            setFaceshape("square");
          } else if (jawWidth < foreheadWidth && Math.abs(foreheadWidth - cheekWidth) < 20) {
            console.log("HEART SHAPE");
            setFaceshape("heart");
          } else if (faceHeight > faceWidth && jawWidth < cheekWidth && foreheadWidth < cheekWidth) {
            console.log("DIAMOND SHAPE");
            setFaceshape("diamond");
          } else {
            console.log("OTHER");
            setFaceshape("other");
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
  }, [setFaceshape]);

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
