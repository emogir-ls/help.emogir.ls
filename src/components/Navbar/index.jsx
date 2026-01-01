import React, {useState, useEffect, useRef} from "react";
import {MdHomeFilled} from "react-icons/md";
import {FaDiscord} from "react-icons/fa6";
import {HiMenu, HiX} from "react-icons/hi";
import Link from "@docusaurus/Link";
import MobileMenu from "./MobileMenu";
import SearchBar from "@site/src/components/Search";
import styles from "./styles.module.css";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navbarRef = useRef(null);


  useEffect(() => {
    if (navbarRef.current) {
      const height = navbarRef.current.offsetHeight;
      navbarRef.current.style.setProperty("--navbar-height", `${height}px`);
    }
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav ref={navbarRef} className={styles.navbar}>
        <div className={styles.navbarContent}>
          <Link href="/" className={styles.logoSection}>
            <img
              src="/img/emogirls-eyes.png"
              alt="emogir.ls"
              className={styles.logo}
            />
            <span className={styles.logoText}>
              emogir<span className={styles.logoDot}>.</span>ls Help Center
            </span>
          </Link>

          <div className={styles.rightSection}>
            <div className={styles.searchContainer}>
              <SearchBar
                searchId="navbar-search"
                className={styles.searchInput}
                placeholder="Search documentation…"
              />
              <kbd className={styles.searchKbd}>
                <span>CTRL</span>
                <span>K</span>
              </kbd>
            </div>

            <Link
              href="https://emogir.ls"
              className={styles.iconButton}
              aria-label="Home">
              <MdHomeFilled />
            </Link>

            <Link
              href="https://discord.gg/emogirls"
              className={styles.iconButton}
              aria-label="Discord">
              <FaDiscord />
            </Link>

            <div
              className={`${styles.iconButton} ${styles.mobileMenuButton}`}
              onClick={toggleMobileMenu}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleMobileMenu();
                }
              }}
              aria-label="Toggle menu">
              {isMobileMenuOpen ? <HiX /> : <HiMenu />}
            </div>
          </div>
        </div>
      </nav>

      <div 
        className={styles.mobileMenuOverlay}
        data-open={isMobileMenuOpen}>
        <div className={styles.mobileMenuContent}>
          <div className={styles.mobileSearchContainer}>
            <SearchBar
              searchId="mobile-navbar-search"
              className={styles.mobileSearchInput}
              placeholder="Search documentation…"
            />
            <kbd className={styles.mobileSearchKbd}>
              <span>CTRL</span>
              <span>K</span>
            </kbd>
          </div>
          <div className={styles.mobileMenuWrapper}>
            <MobileMenu />
          </div>
        </div>
      </div>
    </>
  );
}

