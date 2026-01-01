import React from "react";
import Layout from "@theme-original/DocRoot/Layout";
import Sidebar from "@site/src/components/Sidebar";
import TableOfContents from "@site/src/components/TableOfContents";
import DocFooter from "@site/src/components/DocFooter";
import styles from "./styles.module.css";

export default function DocRootLayout(props) {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageWrapper}>
        <Sidebar />
        <main className={styles.main}>
          <div className={styles.container}>
            <Layout {...props} />
            <DocFooter />
          </div>
        </main>
        <TableOfContents />
      </div>
    </div>
  );
}

