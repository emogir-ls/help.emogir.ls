import React from "react";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";

function ButtonIcon({icon}) {
  if (!icon) return null;
  
  if (typeof icon === "string") {
    try {
      const IconComponent = require("lucide-react")[icon];
      if (IconComponent) {
        return (
          <span className={styles.icon}>
            <IconComponent size={18} />
          </span>
        );
      }
    } catch (e) {
      console.warn(`Icon "${icon}" not found in lucide-react`);
    }
  }
  
  if (React.isValidElement(icon)) {
    return <span className={styles.icon}>{icon}</span>;
  }
  
  return null;
}

export default function Button({children, icon, href, className = "", ...props}) {
  const buttonContent = (
    <>
      <ButtonIcon icon={icon} />
      <span>{children}</span>
    </>
  );
  
  if (href) {
    return (
      <Link href={href} className={`${styles.button} ${className}`} {...props}>
        {buttonContent}
      </Link>
    );
  }
  
  return (
    <button className={`${styles.button} ${className}`} {...props}>
      {buttonContent}
    </button>
  );
}

