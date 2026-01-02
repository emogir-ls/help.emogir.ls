import React from "react";
import MDXA from "./A";
import MDXImg from "./Img";
import MDXTable from "./Table";
import MDXCode from "@theme-original/MDXComponents/Code";
import MDXPre from "@theme-original/MDXComponents/Pre";
import MDXDetails from "@theme-original/MDXComponents/Details";
import MDXHeading from "@theme-original/MDXComponents/Heading";
import MDXUl from "@theme-original/MDXComponents/Ul";
import MDXLi from "@theme-original/MDXComponents/Li";
import Head from "@docusaurus/Head";
import Admonition from "@theme-original/Admonition";
import Mermaid from "@theme-original/Mermaid";

export default {
  Head,
  details: MDXDetails,
  Details: MDXDetails,
  code: MDXCode,
  a: MDXA,
  pre: MDXPre,
  ul: MDXUl,
  li: MDXLi,
  img: MDXImg,
  Img: MDXImg,
  table: MDXTable,
  Table: MDXTable,
  Admonition,
  Mermaid,
};
