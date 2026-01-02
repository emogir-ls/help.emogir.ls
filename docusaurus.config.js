import { themes as prismThemes } from "prism-react-renderer";
import "dotenv/config";

const config = {
  title: "emogir.ls Documentation",
  tagline: "Documentation for emogir.ls",
  favicon: "img/emogirls-eyes.png",

  url: "https://emogir.ls",
  baseUrl: "/",

  organizationName: "emogirls",
  projectName: "emogirls-docs",

  onBrokenLinks: "throw",
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.js",
          showLastUpdateAuthor: false,
          showLastUpdateTime: false,
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      },
    ],
  ],

  themeConfig: {
    navbar: {
      hideOnScroll: true,
      style: "dark",
      items: [],
    },
    algolia: {
      appId: process.env.ALGOLIA_APP_ID || "",
      apiKey: process.env.ALGOLIA_API_KEY || "",
      indexName: process.env.ALGOLIA_INDEX_NAME || "",
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["bash", "json", "yaml"],
    },
    colorMode: {
      defaultMode: "dark",
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
  },
  customFields: {
    API_URL: process.env.API_URL || "",
    FRONTEND_URL: process.env.FRONTEND_URL || "",
  },
};

export default config;
