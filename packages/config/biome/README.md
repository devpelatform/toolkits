# @pelatform/biome-config

<a href="https://www.npmjs.com/package/@pelatform/biome-config"><img src="https://img.shields.io/npm/v/@pelatform/biome-config.svg?style=for-the-badge&labelColor=000000" alt="NPM version"></a>

Opinionated [Biome](https://biomejs.dev) configuration for modern TypeScript projects.

## Installation

```bash
bun add -D @pelatform/biome-config @biomejs/biome
```

## Usage

Create a `biome.jsonc` file in your project root:

```json
{
  "$schema": "./node_modules/@biomejs/biome/configuration_schema.json",
  "extends": ["@pelatform/biome-config/base"]
}
```

## Features

### Formatting

- 2-space indentation
- LF line endings
- 80 character line width
- Trailing commas in multi-line arrays and objects
- Semicolons always required
- Double quotes for JSX attributes
- Bracket spacing enabled

### Linting

- All recommended rules enabled
- Strict TypeScript patterns enforced
- Import extensions required (`.js` for TypeScript files)
- Type-only imports separated
- Consistent array syntax (shorthand `[]` instead of `Array<>`)
- No floating promises
- No unnecessary conditions
- No double equals (strict equality required)
- Enum initializers required
- Self-closing elements enforced

### Code Assists

- Automatic import organization
- Type imports separated into their own statements

## License

MIT License
