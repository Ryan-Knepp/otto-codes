import React from "react";
import "./Welcome.css";
import "../../public/otto.png";

function Welcome(props) {
  return (
    <div className="popupContainer">
      <div className="popup">
        <h1>Otto Codes</h1>
        <img src="/public/otto.png" alt="Otto's profile" className="avatar" />
        <p>
          This is an app I created for my little buddy. <br />
          Hit some keys and you too can code like the best of them!
        </p>
        <button onClick={props.onGo}>Let's Code</button>
      </div>
    </div>
  );
}

export default Welcome;
