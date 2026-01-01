import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";

function useHeadings() {
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    const headingElements = Array.from(document.querySelectorAll("h2, h3")).map(
      (elem) => ({
        id: elem.id,
        text: elem.textContent,
        level: parseInt(elem.tagName.substring(1)),
      })
    );

    setHeadings(headingElements);
  }, []);

  return headings;
}

function useActiveHeading(headings) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0% -35% 0%",
      }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [headings]);

  return activeId;
}

export default function TableOfContents() {
  const headings = useHeadings();
  const activeId = useActiveHeading(headings);

  if (headings.length === 0) {
    return null;
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className={styles.toc} aria-label="table of contents">
      <div className={styles.tocContainer}>
        <p className={styles.tocTitle}>On This Page</p>
        <ul className={styles.tocList}>
          {headings.map((heading) => (
            <li key={heading.id} className={styles.tocItem}>
              <a
                href={`#${heading.id}`}
                className={`${styles.tocLink} ${
                  activeId === heading.id ? styles.tocLinkActive : ""
                }`}
                style={{ paddingLeft: `${(heading.level - 2) * 0.75}rem` }}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
        <div className={styles.tocFooter}>
          <button
            className={styles.scrollToTop}
            onClick={scrollToTop}
            type="button"
            aria-label="Scroll to top"
          >
            Scroll to top
            <svg
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              height="1.1em"
              className={styles.scrollIcon}
            >
              <path
                d="M9 5l7 7-7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
