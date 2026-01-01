import { algoliasearch } from "algoliasearch";
import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";
import matter from "gray-matter";

const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
const ALGOLIA_API_KEY = process.env.ALGOLIA_API_KEY;
const ALGOLIA_INDEX_NAME = process.env.ALGOLIA_INDEX_NAME;
const DOCS_DIR = join(process.cwd(), "docs");
const BASE_URL = process.env.BASE_URL || "https://emogir.ls";

if (!ALGOLIA_APP_ID || !ALGOLIA_API_KEY || !ALGOLIA_INDEX_NAME) {
  console.error("❌ Missing required environment variables:");
  if (!ALGOLIA_APP_ID) console.error("   - ALGOLIA_APP_ID");
  if (!ALGOLIA_API_KEY) console.error("   - ALGOLIA_API_KEY");
  if (!ALGOLIA_INDEX_NAME) console.error("   - ALGOLIA_INDEX_NAME");
  console.error("\nPlease set these in your .env file or environment variables.");
  process.exit(1);
}

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);

function extractTextFromMarkdown(content) {
  return content
    .replace(/^import\s+.*?from\s+["'][^"']+["'];?\s*/gm, "")
    .replace(/^export\s+.*?from\s+["'][^"']+["'];?\s*/gm, "")
    .replace(/<[A-Z][a-zA-Z0-9]*[^>]*>[\s\S]*?<\/[A-Z][a-zA-Z0-9]*>/g, "")
    .replace(/<[A-Z][a-zA-Z0-9]*[^>]*\/>/g, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]+`/g, "")
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
    .replace(/!\[([^\]]*)\]\([^\)]+\)/g, "")
    .replace(/[#*_~`]/g, "")
    .replace(/\n+/g, " ")
    .trim();
}

function getAllMdxFiles(dir, basePath = "") {
  const files = [];
  const items = readdirSync(dir);

  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...getAllMdxFiles(fullPath, join(basePath, item)));
    } else if (item.endsWith(".mdx") || item.endsWith(".md")) {
      files.push({
        path: fullPath,
        relativePath: join(basePath, item),
      });
    }
  }

  return files;
}

function getUrlFromPath(relativePath) {
  const pathWithoutExt = relativePath.replace(/\.(mdx|md)$/, "");
  const urlPath = pathWithoutExt === "index" ? "" : pathWithoutExt;
  return `${BASE_URL}/docs/${urlPath}`;
}

async function indexDocuments() {
  try {
    console.log("📚 Scanning documentation files...");
    const files = getAllMdxFiles(DOCS_DIR);
    console.log(`Found ${files.length} documentation files`);

    const records = [];

    for (const file of files) {
      try {
        const content = readFileSync(file.path, "utf-8");
        const { data: frontmatter, content: body } = matter(content);

        const url = getUrlFromPath(file.relativePath);
        const title =
          frontmatter.title ||
          body.match(/^#\s+(.+)$/m)?.[1]?.trim() ||
          file.relativePath
            .replace(/\.(mdx|md)$/, "")
            .split("/")
            .pop();

        const cleanedBody = body
          .replace(/^import\s+.*?from\s+["'][^"']+["'];?\s*/gm, "")
          .replace(/^export\s+.*?from\s+["'][^"']+["'];?\s*/gm, "");
        
        const textContent = extractTextFromMarkdown(cleanedBody);
        
        const headingMatches = cleanedBody.match(/^(#{1,6})\s+(.+)$/gm) || [];
        const headings = headingMatches.map((h) => h.replace(/^#+\s+/, "").trim());
        
        const h1Headings = headingMatches
          .filter((h) => h.startsWith("# "))
          .map((h) => h.replace(/^#+\s+/, "").trim());
        const h2Headings = headingMatches
          .filter((h) => h.startsWith("## "))
          .map((h) => h.replace(/^#+\s+/, "").trim());
        const h3Headings = headingMatches
          .filter((h) => h.startsWith("### "))
          .map((h) => h.replace(/^#+\s+/, "").trim());

        const record = {
          objectID: url,
          title: title,
          url: url,
          content: textContent.substring(0, 5000),
          headings: headings,
          hierarchy: {
            lvl0: title,
            lvl1: h2Headings[0] || null,
            lvl2: h2Headings[1] || null,
            lvl3: h2Headings[2] || null,
            lvl4: h2Headings[3] || null,
          },
          type: "documentation",
        };

        records.push(record);
        console.log(`✓ Indexed: ${title} (${url})`);
      } catch (error) {
        console.error(`✗ Error processing ${file.path}:`, error.message);
      }
    }

    if (records.length === 0) {
      console.warn("⚠ No records to index!");
      return;
    }

    console.log(`\n🚀 Uploading ${records.length} records to Algolia...`);
    
    await client.saveObjects({
      indexName: ALGOLIA_INDEX_NAME,
      objects: records,
    });

    console.log(
      `✅ Successfully indexed ${records.length} documents to "${ALGOLIA_INDEX_NAME}"!`
    );
    console.log(`\n📝 Update your docusaurus.config.js with:`);
    console.log(`   indexName: "${ALGOLIA_INDEX_NAME}"`);
  } catch (error) {
    console.error("❌ Error indexing documents:", error);
    process.exit(1);
  }
}

indexDocuments();
