import React, { Fragment } from "react";
import dr from "../images/dr.png";
export const Background = () => {
  const wrapper = {
    position: "fixed",
    bottom: 0,
    zIndex: -1,
    left: "80%",
    transform: "translate(-50%)",
  };
  const imgwrapper = {
    position: "relative",
    bottom: 0,
    height: "50vh",
    opacity: 0.2,
    zIndex: -1,
  };
  return (
    <Fragment>
      <div style={wrapper}>
        <img src={dr} alt="" style={imgwrapper} />
      </div>
    </Fragment>
  );
};
