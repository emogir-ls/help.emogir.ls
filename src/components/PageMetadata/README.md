# PageMetadata Component

A customizable component for adding metadata (title, description, icon) to documentation pages.

## Usage in MDX

```mdx
import PageMetadata from "@site/src/components/PageMetadata";

<PageMetadata
  title="Custom Page Title"
  description="This is a custom description for the page"
  icon="Book"
  iconType="lucide"
  badge="New"
/>
```

## Props

- `title` (string): Custom page title (overrides frontmatter title)
- `description` (string): Page description
- `icon` (string | ReactNode): Icon name (for lucide-react) or custom icon element
- `iconType` (string): Icon type - "lucide" (default) or "custom"
- `badge` (string): Optional badge text

## Icon Types

### Lucide Icons (default)

Uses icons from `lucide-react` package. Just provide the icon name:

```mdx
<PageMetadata icon="Book" iconType="lucide" />
```

### Custom Icons

Provide a path to an image or a React element:

```mdx
<PageMetadata icon="/img/custom-icon.svg" iconType="custom" />
```

Or with a React element:

```mdx
<PageMetadata icon={<CustomIcon />} />
```

## Example

```mdx
---
sidebar_position: 1
---

import PageMetadata from "@site/src/components/PageMetadata";

<PageMetadata
  title="Getting Started"
  description="Learn how to get started with the platform"
  icon="Rocket"
  badge="New"
/>

# Getting Started

Your content here...
```
