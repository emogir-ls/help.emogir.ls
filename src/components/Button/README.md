# Button Component

A customizable button component that matches the home page button styling.

## Usage in MDX

```mdx
import Button from "@site/src/components/Button";
import { FaRocket } from "react-icons/fa";

<Button icon={<FaRocket />}>Get Started</Button>
<Button>Click Me</Button>
```

## Props

- `children` (ReactNode): The button text/content
- `icon` (ReactNode, optional): An icon element to display before the text
- `className` (string, optional): Additional CSS classes
- All standard button props are supported (onClick, disabled, etc.)

## Examples

```mdx
import Button from "@site/src/components/Button";
import { FaRocket, FaDownload } from "react-icons/fa";

<Button icon={<FaRocket />}>Launch App</Button>
<Button icon={<FaDownload />}>Download</Button>
<Button>Simple Button</Button>
```
