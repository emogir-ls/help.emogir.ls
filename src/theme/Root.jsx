import React from "react";
import Navbar from "@site/src/components/Navbar";

export default function Root({children}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

