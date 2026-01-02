import React from "react";
import Layout from "@theme/Layout";
import SearchBar from "@site/src/components/Search";

export default function SearchPage() {
  return (
    <Layout title="Search" description="Search the documentation">
      <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
        <h1>Search Documentation</h1>
        <SearchBar
          searchId="search-page"
          placeholder="Search documentation..."
        />
      </div>
    </Layout>
  );
}

