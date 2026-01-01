import React from "react";
import { useLocation } from "@docusaurus/router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "@docusaurus/Link";
import sidebarConfig from "../../../sidebars";
import styles from "./styles.module.css";

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getAllPages(sidebarData) {
  const allItems = [];

  function flattenItems(items) {
    items.forEach((item) => {
      if (item.type === "link") {
        allItems.push({ type: "link", href: item.href, label: item.label });
      } else if (item.type === "doc") {
        allItems.push({ type: "doc", id: item.id, label: item.label });
      } else if (item.type === "category" && item.items) {
        flattenItems(item.items);
      }
    });
  }

  flattenItems(sidebarData);
  return allItems;
}

function getNavigationPages(currentPath, sidebarData) {
  const allItems = getAllPages(sidebarData);

  const currentIndex = allItems.findIndex((item) => {
    if (item.type === "link") {
      return (
        currentPath === item.href || (item.href === "/" && currentPath === "/")
      );
    } else if (item.type === "doc") {
      const docPath = `/docs/${item.id}`;
      return currentPath === docPath || currentPath.startsWith(`${docPath}/`);
    }
    return false;
  });

  let previousPage = null;
  let nextPage = null;

  if (currentIndex > 0) {
    const prevItem = allItems[currentIndex - 1];
    if (prevItem.type === "link") {
      previousPage = {
        href: prevItem.href,
        title: capitalizeFirst(prevItem.label),
      };
    } else if (prevItem.type === "doc") {
      previousPage = {
        href: `/docs/${prevItem.id}`,
        title: capitalizeFirst(prevItem.label),
      };
    }
  }

  if (currentIndex < allItems.length - 1) {
    const nextItem = allItems[currentIndex + 1];
    if (nextItem.type === "link") {
      nextPage = {
        href: nextItem.href,
        title: capitalizeFirst(nextItem.label),
      };
    } else if (nextItem.type === "doc") {
      nextPage = {
        href: `/docs/${nextItem.id}`,
        title: capitalizeFirst(nextItem.label),
      };
    }
  }

  return { previousPage, nextPage };
}

export default function DocFooter() {
  const location = useLocation();
  const sidebarData = sidebarConfig.tutorialSidebar;
  const { previousPage, nextPage } = getNavigationPages(
    location.pathname,
    sidebarData
  );

  if (!previousPage && !nextPage) {
    return null;
  }

  return (
    <div className={styles.footer}>
      {previousPage ? (
        <Link
          to={previousPage.href}
          className={styles.navLink}
          title={previousPage.title}
        >
          <ChevronLeft size={20} className={styles.iconLeft} />
          <span>{previousPage.title}</span>
        </Link>
      ) : (
        <div className={styles.navLinkPlaceholder} />
      )}
      {nextPage ? (
        <Link
          to={nextPage.href}
          className={`${styles.navLink} ${styles.navLinkNext}`}
          title={nextPage.title}
        >
          <span>{nextPage.title}</span>
          <ChevronRight size={20} className={styles.iconRight} />
        </Link>
      ) : (
        <div className={styles.navLinkPlaceholder} />
      )}
    </div>
  );
}
