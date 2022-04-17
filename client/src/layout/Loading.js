import React from "react";

export const Loading = () => {
  const Margin = {
    margin: 0,
  };
  return (
    <div className="progress" style={Margin}>
      <div className="indeterminate"></div>
    </div>
  );
};
