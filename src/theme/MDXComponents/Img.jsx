import React, {useState, useEffect} from "react";
import {X, ZoomIn} from "lucide-react";
import styles from "./Img.module.css";

export default function MDXImage(props) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const handleClick = () => {
    setIsOpen(true);
  };

  const handleClose = (e) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <div className={styles.imageWrapper}>
        <img
          {...props}
          className={`${styles.image} ${props.className || ""}`}
          onClick={handleClick}
          alt={props.alt || ""}
        />
        <div className={styles.zoomIndicator}>
          <ZoomIn size={16} />
        </div>
      </div>
      {isOpen && (
        <div className={styles.lightbox} onClick={handleClose}>
          <button
            className={styles.closeButton}
            onClick={() => setIsOpen(false)}
            aria-label="Close image">
            <X size={24} />
          </button>
          <div className={styles.lightboxContent}>
            <img
              src={props.src}
              alt={props.alt || ""}
              className={styles.lightboxImage}
            />
            {props.alt && (
              <div className={styles.lightboxCaption}>{props.alt}</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

