import React from "react";
import Layout from "@theme/Layout";
import SearchBar from "@site/src/components/Search";
import styles from "./index.module.css";

export default function SearchPage() {
  return (
    <Layout title="Search" description="Search the documentation">
      <div className={styles.searchPage}>
        <div className={styles.searchContainer}>
          <h1 className={styles.searchTitle}>Search Documentation</h1>
          <SearchBar
            searchId="search-page"
            className={styles.searchInput}
            placeholder="Search documentation..."
          />
        </div>
      </div>
    </Layout>
  );
}

