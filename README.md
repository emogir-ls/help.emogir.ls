# emogir.ls Documentation

Comprehensive documentation for emogir.ls, built with Docusaurus.

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- Bun (package manager)

### Installation

1. **Install dependencies:**

```bash
bun install
```

2. **Start the development server:**

```bash
bun start
```

The site will be available at `http://localhost:3000`.

### First-Time Setup Notes

#### Environment Variables

Create a `.env` file in the root directory with your Algolia credentials:

```env
ALGOLIA_APP_ID=your_app_id
ALGOLIA_API_KEY=your_api_key
ALGOLIA_INDEX_NAME=your_index_name
BASE_URL=https://emogir.ls
API_URL=https://api.emogir.ls
FRONTEND_URL=https://emogir.ls
```

#### Indexing Documentation to Algolia

After setting up your `.env` file, index your documentation:

```bash
bun run index-algolia
```

This will scan all `.mdx` and `.md` files in the `docs/` directory and upload them to Algolia for search functionality.

### Build

Build the documentation site for production:

```bash
bun run build
```

The built site will be in the `build/` directory.

### Serve Production Build

Serve the production build locally:

```bash
bun run serve
```

## Code Quality

This project uses ESLint and Prettier for code quality and formatting.

### Linting

```bash
bun run lint
```

Fix linting issues automatically:

```bash
bun run lint:fix
```

### Formatting

Format all files:

```bash
bun run format
```

Check formatting:

```bash
bun run format:check
```

### Code Quality Checks

Before committing, ensure:

```bash
bun run lint          # Check for linting errors
bun run format:check  # Check formatting
bun run build         # Ensure site builds successfully
```

## Troubleshooting

### Node version issues

This project requires Node.js 18.0 or higher. Use `.nvmrc` if you have nvm:

```bash
nvm use
```

## Project Structure

```
.
├── docs/                    # Documentation markdown files (.mdx/.md)
├── src/
│   ├── components/         # Custom React components
│   │   ├── Admonition/     # Admonition component
│   │   ├── Badge/          # Badge component
│   │   ├── Button/         # Button component with href support
│   │   ├── Navbar/         # Custom navbar with search
│   │   ├── Search/         # Algolia search component
│   │   ├── Sidebar/        # Custom sidebar navigation
│   │   └── PageMetadata/   # Page metadata component (icons, badges)
│   ├── css/
│   │   └── custom.css      # Custom theme styles
│   ├── pages/              # Custom pages (homepage, etc.)
│   └── theme/              # Docusaurus theme overrides
├── scripts/
│   └── index-algolia.js    # Script to index docs to Algolia
├── static/                 # Static assets (images, fonts, etc.)
├── docusaurus.config.js     # Docusaurus configuration
├── sidebars.js             # Sidebar navigation structure
└── package.json
```

## Customization

The documentation site uses a custom dark theme matching the emogir.ls platform design:

- **Dark theme** (#0a0a0a background)
- **Pink accent color** (#ff3379)
- **Sidebar-based navigation** with expandable sections
- **Customizable icons** using lucide-react
- **Page metadata component** for titles, descriptions, and icons

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## Code of Conduct

Please read our [Code of Conduct](./CODE_OF_CONDUCT.md) before contributing.

## License

This project is licensed under the MIT License with attribution requirement. See [LICENSE](./LICENSE) for details.

**Attribution Requirement:** When using, modifying, or distributing this project, you must provide appropriate credit to EMOGIR.LS LLC.
