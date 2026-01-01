import React, { useState, useEffect, useRef } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { algoliasearch } from "algoliasearch";
import Link from "@docusaurus/Link";
import { Loader2 } from "lucide-react";
import styles from "./styles.module.css";

export default function SearchBar({ searchId, className, placeholder }) {
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const ctrlKRef = useRef(false);
  const { siteConfig } = useDocusaurusContext();
  const algoliaConfig = siteConfig.themeConfig.algolia;
  const searchClientRef = useRef(null);
  const indexRef = useRef(null);

  useEffect(() => {
    if (!algoliaConfig || typeof window === "undefined") {
      console.warn("Algolia config not available:", algoliaConfig);
      return;
    }

    if (
      !algoliaConfig.appId ||
      !algoliaConfig.apiKey ||
      !algoliaConfig.indexName
    ) {
      console.warn("Missing Algolia credentials:", {
        hasAppId: !!algoliaConfig.appId,
        hasApiKey: !!algoliaConfig.apiKey,
        hasIndexName: !!algoliaConfig.indexName,
      });
      return;
    }

    try {
      const client = algoliasearch(algoliaConfig.appId, algoliaConfig.apiKey);
      searchClientRef.current = client;
      indexRef.current = algoliaConfig.indexName;
    } catch (e) {
      console.error("Failed to initialize Algolia search:", e);
    }
  }, [algoliaConfig]);

  useEffect(() => {
    if (!searchClientRef.current || !indexRef.current) {
      return;
    }

    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const search = async () => {
      try {
        const response = await searchClientRef.current.searchSingleIndex({
          indexName: indexRef.current,
          query: query,
          requestOptions: {
            hitsPerPage: 8,
            attributesToRetrieve: ["*"],
            attributesToSnippet: ["content:200"],
            getRankingInfo: true,
          },
        });

        const results = response.hits || [];
        setResults(results);
        if (!ctrlKRef.current && results.length > 0) {
          setIsOpen(true);
        }
      } catch (e) {
        console.error("Search error:", e);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(search, 200);
    return () => {
      clearTimeout(timeoutId);
      setIsLoading(false);
    };
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        ctrlKRef.current = true;
        setIsOpen(false);
        if (inputRef.current) {
          inputRef.current.focus();
        }
        setTimeout(() => {
          ctrlKRef.current = false;
        }, 300);
        return false;
      }
      if (e.key === "Escape") {
        setIsOpen(false);
        if (inputRef.current) {
          inputRef.current.blur();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, []);

  const highlightText = (text, query) => {
    if (!query || !text) return text;
    const queryWords = query.trim().split(/\s+/).filter(Boolean);
    if (queryWords.length === 0) return text;

    let highlightedText = String(text);
    queryWords.forEach((word) => {
      const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`(${escaped})`, "gi");
      highlightedText = highlightedText.replace(regex, "<mark>$1</mark>");
    });

    return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
  };

  const getContentPreview = (content, query) => {
    if (!content) return "";

    const text = String(content);
    const lines = text.split(/\n/);
    const filteredLines = lines.filter((line) => {
      const trimmed = line.trim();
      if (trimmed.length === 0) return false;

      const importPattern = /^(import|export)\s+.*?\s+from\s+["']/;
      const importPattern2 = /^import\s+.*?from\s+["']/;
      const exportPattern =
        /^export\s+(default\s+)?(function|const|class|let|var)/;

      return (
        !importPattern.test(trimmed) &&
        !importPattern2.test(trimmed) &&
        !exportPattern.test(trimmed) &&
        !trimmed.startsWith("import ") &&
        !trimmed.startsWith("export ") &&
        !trimmed.match(/^import\s+/) &&
        !trimmed.match(/^export\s+/) &&
        !trimmed.includes('from "@') &&
        !trimmed.includes("from '@")
      );
    });

    const cleaned = filteredLines.join(" ").replace(/\s+/g, " ").trim();

    if (query) {
      const queryLower = query.toLowerCase();
      const queryWords = queryLower.split(/\s+/).filter(Boolean);

      const index = cleaned.toLowerCase().indexOf(queryLower);
      if (index !== -1) {
        const start = Math.max(0, index - 50);
        const end = Math.min(cleaned.length, index + query.length + 150);
        const snippet = cleaned.substring(start, end);
        return (
          (start > 0 ? "..." : "") +
          snippet +
          (end < cleaned.length ? "..." : "")
        );
      }

      for (const word of queryWords) {
        const wordIndex = cleaned.toLowerCase().indexOf(word);
        if (wordIndex !== -1) {
          const start = Math.max(0, wordIndex - 50);
          const end = Math.min(cleaned.length, wordIndex + word.length + 150);
          const snippet = cleaned.substring(start, end);
          return (
            (start > 0 ? "..." : "") +
            snippet +
            (end < cleaned.length ? "..." : "")
          );
        }
      }
    }

    return cleaned.substring(0, 200);
  };

  const getMatchingSection = (hit, query) => {
    if (!hit.hierarchy || !query) return null;

    const queryLower = query.toLowerCase();
    const sections = [
      hit.hierarchy.lvl4,
      hit.hierarchy.lvl3,
      hit.hierarchy.lvl2,
      hit.hierarchy.lvl1,
    ].filter(Boolean);

    for (const section of sections) {
      if (section.toLowerCase().includes(queryLower)) {
        return section;
      }
    }

    if (hit.headings && Array.isArray(hit.headings)) {
      for (const heading of hit.headings) {
        if (heading && heading.toLowerCase().includes(queryLower)) {
          return heading;
        }
      }
    }

    return null;
  };

  const getSectionContent = (content, sectionTitle, query, hit) => {
    if (!content || !sectionTitle) return null;

    const text = String(content);
    const sectionLower = sectionTitle.toLowerCase();

    const sectionIndex = text.toLowerCase().indexOf(sectionLower);
    if (sectionIndex === -1) return null;

    const afterSection = text
      .substring(sectionIndex + sectionTitle.length)
      .trim();

    let endIndex = afterSection.length;

    if (hit.headings && Array.isArray(hit.headings)) {
      const currentIndex = hit.headings.findIndex(
        (h) => h && h.toLowerCase() === sectionLower
      );

      if (currentIndex !== -1 && currentIndex < hit.headings.length - 1) {
        const nextHeading = hit.headings[currentIndex + 1];
        if (nextHeading) {
          const nextHeadingLower = nextHeading.toLowerCase();
          const nextHeadingIndex = afterSection
            .toLowerCase()
            .indexOf(nextHeadingLower);
          if (nextHeadingIndex !== -1 && nextHeadingIndex < 200) {
            endIndex = nextHeadingIndex;
          }
        }
      }
    }

    const sectionContent = afterSection
      .substring(0, Math.min(endIndex, 200))
      .trim();

    if (sectionContent.length < 10) return null;

    return sectionContent;
  };

  useEffect(() => {
    if (inputRef.current) {
      const input = inputRef.current;
      let container = input.closest('[class*="searchContainer"]');
      if (!container) {
        container = input.closest('[class*="mobileSearchContainer"]');
      }
      if (container) {
        if (isFocused) {
          container.setAttribute("data-search-focused", "true");
        } else {
          container.removeAttribute("data-search-focused");
        }
      }
    }
  }, [isFocused]);

  return (
    <div className={styles.searchWrapper}>
      <input
        ref={inputRef}
        id={searchId}
        type="search"
        placeholder={placeholder}
        className={className}
        spellCheck="false"
        autoComplete="off"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
          setIsFocused(true);
          if (!ctrlKRef.current && query.trim() && results.length > 0) {
            setIsOpen(true);
          }
        }}
        onBlur={() => {
          setIsFocused(false);
        }}
        data-focused={isFocused}
      />
      {(isOpen || isLoading) && (
        <div ref={dropdownRef} className={styles.dropdown}>
          {isLoading ? (
            <div className={styles.loading}>
              <Loader2 className={styles.spinner} size={16} />
              <span>Searching...</span>
            </div>
          ) : results.length > 0 ? (
            <div className={styles.results}>
              {results.map((hit) => {
                const matchingSection = getMatchingSection(hit, query);
                const displayTitle =
                  matchingSection || hit.title || hit.hierarchy?.lvl0 || "";
                const parentTitle = matchingSection
                  ? hit.title || hit.hierarchy?.lvl0 || ""
                  : null;
                const sectionContent = matchingSection
                  ? getSectionContent(hit.content, matchingSection, query, hit)
                  : null;
                const contentToShow =
                  sectionContent ||
                  (hit.content ? getContentPreview(hit.content, query) : "");

                return (
                  <Link
                    key={hit.objectID}
                    to={hit.url}
                    className={styles.resultItem}
                    onClick={() => {
                      setQuery("");
                      setIsOpen(false);
                    }}
                  >
                    {parentTitle && (
                      <div className={styles.resultParent}>
                        {highlightText(parentTitle, query)}
                      </div>
                    )}
                    <div className={styles.resultTitle}>
                      {highlightText(displayTitle, query)}
                    </div>
                    {contentToShow && (
                      <div className={styles.resultContent}>
                        {highlightText(contentToShow, query)}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className={styles.noResults}>No results found</div>
          )}
        </div>
      )}
    </div>
  );
}
