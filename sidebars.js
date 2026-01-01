export default {
  tutorialSidebar: [
    {
      type: "link",
      href: "/",
      label: "Home",
    },
    {
      type: "doc",
      id: "introduction",
      label: "Introduction",
    },
    {
      type: "category",
      // id: "customization/intro",
      label: "Getting Started",
      items: [
        {
          type: "doc",
          id: "customization/exploring-your-options",
          label: "Exploring Your Options",
        }
      ]
    },
    {
      type: "category",
      label: "General",
      items: [
        {
          type: "doc",
          id: "general/support",
          label: "Getting Account Support",
        },
        {
          type: "doc",
          id: "general/troubleshooting",
          label: "Troubleshooting",
        },
        {
          type: "doc",
          id: "general/policies",
          label: "Policies & Security",
        },
        {
          type: "doc",
          id: "general/contact-us",
          label: "Contact Us",
        },
        {
          type: "doc",
          id: "general/analytics",
          label: "Analytics",
        }
      ]
    }
  ],
};
