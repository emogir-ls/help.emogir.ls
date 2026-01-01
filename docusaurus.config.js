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
};

export default config;
