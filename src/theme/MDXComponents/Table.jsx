import React from "react";
import styles from "./Table.module.css";

export default function MDXTable(props) {
  const { children, className = "", ...rest } = props;
  
  return (
    <div className={styles.tableWrapper}>
      <table className={`${styles.table} ${className}`} {...rest}>
        {children}
      </table>
    </div>
  );
}

