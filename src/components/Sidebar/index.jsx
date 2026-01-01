import React, {useState, useEffect} from "react";
import {useLocation} from "@docusaurus/router";
import Link from "@docusaurus/Link";
import sidebarConfig from "../../../sidebars";
import styles from "./styles.module.css";

function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const updatePosition = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", updatePosition);
    updatePosition();

    return () => window.removeEventListener("scroll", updatePosition);
  }, []);

  return scrollPosition;
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function SidebarItem({item, pathname, expandedSections, toggleSection}) {
  if (item.type === "link") {
    const isActive = item.href === "/" 
      ? pathname === "/" 
      : pathname === item.href || pathname.startsWith(item.href);
    return (
      <Link
        to={item.href}
        className={`${styles.sidebarLink} ${isActive ? styles.sidebarLinkActive : ""}`}>
        {capitalizeFirst(item.label)}
      </Link>
    );
  }

  if (item.type === "doc") {
    const docPath = `/docs/${item.id}`;
    const isActive = pathname === docPath || pathname.startsWith(`${docPath}/`);
    return (
      <Link
        to={docPath}
        className={`${styles.sidebarLink} ${isActive ? styles.sidebarLinkActive : ""}`}>
        {capitalizeFirst(item.label)}
      </Link>
    );
  }

  if (item.type === "category") {
    const categoryKey = item.label.toLowerCase();
    const isExpanded = expandedSections.has(categoryKey);
    const hasActiveChild = item.items?.some((subItem) => {
      if (subItem.type === "doc") {
        const docPath = `/docs/${subItem.id}`;
        return pathname === docPath || pathname.startsWith(`${docPath}/`);
      }
      return false;
    });

    return (
      <div className={styles.sidebarCategory}>
        <button
          className={`${styles.sidebarCategoryButton} ${hasActiveChild ? styles.sidebarCategoryActive : ""}`}
          onClick={() => toggleSection(categoryKey)}>
          <span className={styles.sidebarCategoryLabel}>{capitalizeFirst(item.label)}</span>
          <span className={styles.chevron}>{isExpanded ? "▲" : "▼"}</span>
        </button>
        {isExpanded && item.items && (
          <div className={styles.sidebarCategoryItems}>
            {item.items.map((subItem, index) => (
              <SidebarItem
                key={index}
                item={subItem}
                pathname={pathname}
                expandedSections={expandedSections}
                toggleSection={toggleSection}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
}

export default function Sidebar() {
  const location = useLocation();
  const sidebarData = sidebarConfig.tutorialSidebar;
  const [expandedSections, setExpandedSections] = useState(new Set());
  const scrollPosition = useScrollPosition();
  const isScrolled = scrollPosition > 0;

  useEffect(() => {
    const activeSection = sidebarData.find((item) => {
      if (item.type === "category") {
        return item.items?.some((subItem) => {
          if (subItem.type === "doc") {
            const docPath = `/docs/${subItem.id}`;
            return location.pathname === docPath || location.pathname.startsWith(`${docPath}/`);
          }
          return false;
        });
      }
      return false;
    });
    if (activeSection) {
      setExpandedSections(new Set([activeSection.label.toLowerCase()]));
    }
  }, [location.pathname, sidebarData]);

  const toggleSection = (sectionKey) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionKey)) {
      newExpanded.delete(sectionKey);
    } else {
      newExpanded.add(sectionKey);
    }
    setExpandedSections(newExpanded);
  };

  if (!sidebarData) {
    return null;
  }

  return (
    <aside className={styles.sidebar}>
      <div className={`${styles.sidebarCard} ${isScrolled ? styles.sidebarCardBlurred : ""}`}>
        <nav className={styles.nav}>
          {sidebarData.map((item, index) => (
            <SidebarItem
              key={index}
              item={item}
              pathname={location.pathname}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
            />
          ))}
        </nav>
      </div>
    </aside>
  );
}

