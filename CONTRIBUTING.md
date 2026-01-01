# Contributing to Platform Documentation

Thank you for your interest in contributing to our documentation!

## How to Contribute

### Reporting Issues

If you find errors, unclear sections, or missing information:

1. Check if an issue already exists
2. Create a new issue with a clear title and description
3. Include the page URL and specific section if applicable

### Suggesting Changes

1. Fork the repository
2. Create a branch for your changes
3. Make your edits
4. Submit a pull request with a clear description

### Writing Documentation

#### Markdown Guidelines

- Use clear, concise language
- Break up long paragraphs
- Use headings to organize content
- Include code examples where helpful
- Add images/diagrams when they clarify concepts

#### File Naming

- Use kebab-case for filenames
- Be descriptive (e.g., `user-authentication.md` not `auth.md`)

#### Frontmatter

Each documentation page should include frontmatter:

```yaml
---
sidebar_position: 1
---
```

#### Code Examples

Use appropriate code fences with language tags:

````markdown
```javascript
// Example code
```
````

### Code Quality

Before submitting:

1. Run `bun run lint` to check for linting errors
2. Run `bun run format` to ensure consistent formatting
3. Ensure the site builds successfully with `bun run build`

### Review Process

- All contributions require review
- Maintainers will review for accuracy, clarity, and consistency
- Feedback will be provided for improvements

## Questions?

If you have questions about contributing, please open an issue or contact the maintainers.

Thank you for helping improve our documentation!
