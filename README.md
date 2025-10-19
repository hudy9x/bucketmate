# BucketMate

A monorepo for BucketMate packages.

## Packages

- `@bucketmate/client` - S3 client package
- `@bucketmate/ui` - UI components package

## Getting Started

Install dependencies:

```bash
pnpm install
```

Build all packages:

```bash
pnpm run build
```

Run development mode:

```bash
pnpm run dev
```

## Publishing

To publish the client package to npm:

```bash
pnpm run publish:client
```

## Development

This monorepo uses pnpm workspaces. Each package in the `packages/` directory is a separate npm package that can be published independently.
