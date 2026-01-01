import React from "react";
import {MoveUpRight} from "lucide-react";
import Link from "@docusaurus/Link";
import styles from "./A.module.css";

export default function MDXLink(props) {
  const {href, children, className = ""} = props;
  const isHashLink = href?.startsWith("#");
  const isButton = className.includes("button") || className.includes("iconButton");

  if (isHashLink || isButton) {
    return <Link {...props} />;
  }

  return (
    <Link {...props} className={`${styles.markdownLink} ${className}`}>
      {children}
      <MoveUpRight size={14} className={styles.externalIcon} />
    </Link>
  );
}

