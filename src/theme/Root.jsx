import React from "react";
import Navbar from "@site/src/components/Navbar";
import ChatBot from "@site/src/components/ChatBot";

export default function Root({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <ChatBot />
    </>
  );
}
