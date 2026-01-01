import React from "react";
import {Info, AlertTriangle, Lightbulb, AlertCircle, FileText} from "lucide-react";
import styles from "./styles.module.css";

const iconMap = {
  info: Info,
  warning: AlertTriangle,
  tip: Lightbulb,
  danger: AlertCircle,
  note: FileText,
};

export default function Admonition({type = "info", children, className = ""}) {
  const Icon = iconMap[type] || Info;
  const typeClass = styles[type] || styles.info;

  return (
    <div className={`${styles.admonition} ${typeClass} ${className}`}>
      <Icon className={styles.icon} />
      <span className={styles.content}>{children}</span>
    </div>
  );
}

