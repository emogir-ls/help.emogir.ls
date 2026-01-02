import React, { useState, useEffect } from "react";
import { useLocation } from "@docusaurus/router";
import Link from "@docusaurus/Link";
import { ChevronDown } from "lucide-react";
import sidebarConfig from "../../../sidebars";
import styles from "./styles.module.css";

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function MobileMenuItem({ item, pathname, expandedSections, toggleSection, onNavigate }) {
  const handleClick = () => {
    if (onNavigate) {
      setTimeout(() => {
        onNavigate();
      }, 100);
    }
  };

  if (item.type === "link") {
    const isActive =
      item.href === "/"
        ? pathname === "/"
        : pathname === item.href || pathname.startsWith(item.href);
    return (
      <Link
        to={item.href}
        className={`${styles.mobileNavLink} ${isActive ? styles.mobileNavLinkActive : ""}`}
        onClick={handleClick}
      >
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
        className={`${styles.mobileNavLink} ${isActive ? styles.mobileNavLinkActive : ""}`}
        onClick={handleClick}
      >
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
      <div className={styles.mobileNavCategory}>
        <div
          className={`${styles.mobileNavCategoryButton} ${hasActiveChild ? styles.mobileNavCategoryActive : ""}`}
          onClick={() => toggleSection(categoryKey)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggleSection(categoryKey);
            }
          }}
        >
          <span className={styles.mobileNavCategoryLabel}>
            {capitalizeFirst(item.label)}
          </span>
          <ChevronDown
            size={14}
            className={`${styles.mobileNavChevron} ${isExpanded ? styles.mobileNavChevronExpanded : ""}`}
          />
        </div>
        <div
          className={`${styles.mobileNavCategoryItems} ${isExpanded ? styles.mobileNavCategoryItemsExpanded : ""}`}
        >
          {item.items?.map((subItem, index) => (
            <MobileMenuItem
              key={index}
              item={subItem}
              pathname={pathname}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </div>
    );
  }

  return null;
}

export default function MobileMenu({ onNavigate }) {
  const location = useLocation();
  const sidebarData = sidebarConfig.tutorialSidebar;

  const getAllCategoryKeys = (data) => {
    const keys = new Set();
    data?.forEach((item) => {
      if (item.type === "category") {
        keys.add(item.label.toLowerCase());
      }
    });
    return keys;
  };

  const [expandedSections, setExpandedSections] = useState(() =>
    getAllCategoryKeys(sidebarData)
  );

  useEffect(() => {
    const activeSection = sidebarData.find((item) => {
      if (item.type === "category") {
        return item.items?.some((subItem) => {
          if (subItem.type === "doc") {
            const docPath = `/docs/${subItem.id}`;
            return (
              location.pathname === docPath ||
              location.pathname.startsWith(`${docPath}/`)
            );
          }
          return false;
        });
      }
      return false;
    });
    if (activeSection) {
      setExpandedSections((prev) => {
        const newSet = new Set(prev);
        newSet.add(activeSection.label.toLowerCase());
        return newSet;
      });
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
    <nav className={styles.mobileNav}>
      {sidebarData.map((item, index) => (
        <MobileMenuItem
          key={index}
          item={item}
          pathname={location.pathname}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          onNavigate={onNavigate}
        />
      ))}
    </nav>
  );
}
