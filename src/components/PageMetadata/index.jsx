import React from "react";
import styles from "./styles.module.css";

function PageIcon({ icon, iconType = "lucide" }) {
  if (!icon) return null;

  if (iconType === "lucide") {
    try {
      const IconComponent = require(`lucide-react`)[icon];
      if (IconComponent) {
        return <IconComponent size={24} className={styles.icon} />;
      }
    } catch (e) {
      console.warn(`Icon "${icon}" not found in lucide-react`);
    }
  }

  if (iconType === "custom" && typeof icon === "string") {
    return <img src={icon} alt="" className={styles.icon} />;
  }

  if (React.isValidElement(icon)) {
    return <div className={styles.icon}>{icon}</div>;
  }

  return null;
}

export default function PageMetadata({
  title,
  description,
  icon,
  iconType,
  badge,
}) {
  return (
    <div className={styles.metadata}>
      {(icon || title) && (
        <div className={styles.header}>
          {icon && <PageIcon icon={icon} iconType={iconType} />}
          {title && (
            <div className={styles.titleRow}>
              <h1 className={styles.title}>{title}</h1>
              {badge && <span className={styles.badge}>{badge}</span>}
            </div>
          )}
        </div>
      )}
      {description && <p className={styles.description}>{description}</p>}
    </div>
  );
}
