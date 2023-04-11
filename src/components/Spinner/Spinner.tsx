import { Spin } from "antd";
import React from "react";
import './index.css'

function Spinner() {
  return (
    <div className="spinner">
      <Spin style={{color:'gray'}} size='large'/>
    </div>
  );
}

export default Spinner;
