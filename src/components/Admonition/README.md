# Admonition Component

A customizable admonition component for displaying information, warnings, tips, and other callouts in your documentation.

## Usage in MDX

```mdx
import Admonition from "@site/src/components/Admonition";

<Admonition type="info">This is an informational message.</Admonition>

<Admonition type="warning">This is a warning message.</Admonition>

<Admonition type="tip">This is a helpful tip.</Admonition>
```

## Props

- `type` (string, optional): The type of admonition. Options: `info`, `warning`, `tip`, `danger`, `note`. Default: `info`
- `children` (ReactNode): The content of the admonition
- `className` (string, optional): Additional CSS classes

## Types

- **info** (blue): For informational messages
- **warning** (orange): For warnings and cautions
- **tip** (green): For helpful tips and suggestions
- **danger** (red): For critical warnings and errors
- **note** (neutral): For general notes

## Examples

```mdx
import Admonition from "@site/src/components/Admonition";

<Admonition type="info">
  You can customize your profile with various themes and layouts.
</Admonition>

<Admonition type="warning">
  Make sure to backup your data before making major changes.
</Admonition>

<Admonition type="tip">Use keyboard shortcuts to navigate faster.</Admonition>

<Admonition type="danger">
  This action cannot be undone. Please proceed with caution.
</Admonition>

<Admonition type="note">This is a general note.</Admonition>
```
