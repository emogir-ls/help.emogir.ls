import React from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import Sidebar from "@site/src/components/Sidebar";
import TableOfContents from "@site/src/components/TableOfContents";
import { FaUserCircle, FaBook, FaImage, FaCrown, FaShieldAlt, FaQuestionCircle, FaRocket, FaLink, FaStar } from "react-icons/fa";
import styles from "./index.module.css";

function Home() {
  return (
    <Layout
      title="Documentation"
      description="Comprehensive documentation for emogir.ls platform">
      <div className={styles.pageContainer}>
        <div className={styles.pageWrapper}>
          <Sidebar />
          <main className={styles.main}>
            <div className={styles.container}>
              <h1 className={styles.title}>
                How can we help you?
              </h1>
              <p className={styles.description}>
                Need help? Start by searching for answers to common questions. Whether you're setting up your page, adding social media links, or exploring premium features, we've got you covered.
              </p>
              <hr className={styles.divider} />
              <h2 id="guides--tutorials" className={styles.sectionTitle}>
                Guides & Tutorials
              </h2>
              <div className={styles.cards}>
                <Link to="/docs/getting-started/introduction" className={`${styles.card} button`}>
                  <span className={styles.cardContent}>
                    <FaUserCircle />
                    <span>Account Support</span>
                  </span>
                </Link>
                <Link to="/docs/getting-started/introduction" className={`${styles.card} button`}>
                  <span className={styles.cardContent}>
                    <FaBook />
                    <span>How-To Guides</span>
                  </span>
                </Link>
                <Link to="/docs/getting-started/introduction" className={`${styles.card} button`}>
                  <span className={styles.cardContent}>
                    <FaImage />
                    <span>How To Upload Assets</span>
                  </span>
                </Link>
                <Link to="/docs/getting-started/introduction" className={`${styles.card} button`}>
                  <span className={styles.cardContent}>
                    <FaCrown />
                    <span>Premium Guides</span>
                  </span>
                </Link>
                <Link to="/docs/getting-started/introduction" className={`${styles.card} button`}>
                  <span className={styles.cardContent}>
                    <FaShieldAlt />
                    <span>Policies & Security</span>
                  </span>
                </Link>
                <Link to="/docs/getting-started/introduction" className={`${styles.card} button`}>
                  <span className={styles.cardContent}>
                    <FaQuestionCircle />
                    <span>Troubleshooting & Issues</span>
                  </span>
                </Link>
              </div>
              <h2 id="popular-articles" className={styles.sectionTitle}>
                Popular Articles
              </h2>
              <div className={styles.cards}>
                <Link to="/docs/getting-started/introduction" className={`${styles.card} button`}>
                  <span className={styles.cardContent}>
                    <FaRocket />
                    <span>Getting Started with emogir.ls</span>
                  </span>
                </Link>
                <Link to="/docs/getting-started/introduction" className={`${styles.card} button`}>
                  <span className={styles.cardContent}>
                    <FaLink />
                    <span>Adding Your Social Media</span>
                  </span>
                </Link>
                <Link to="/docs/getting-started/introduction" className={`${styles.card} button`}>
                  <span className={styles.cardContent}>
                    <FaStar />
                    <span>Explore emogir.ls Premium</span>
                  </span>
                </Link>
              </div>
            </div>
          </main>
          <TableOfContents />
        </div>
      </div>
    </Layout>
  );
}

export default Home;
