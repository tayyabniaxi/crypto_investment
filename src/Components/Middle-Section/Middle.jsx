import React from "react";
import myVID from "../../Assets/v1.mp4";
import "./Middle.css";
import Data from "./data/Data";

export default function Middle() {
  return (
    <div className="video-container">
      <video
        width="100%"
        autoPlay
        muted
        loop
        className="background-video"
      >
        <source src={myVID} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="overlay">
        <Data />
      </div>
    </div>
  );
}
