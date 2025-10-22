# BucketMate AGENTS Guidelines

**Reponse rule
- When you're done, please reponse: "========== DONE =======" at the end of your message

**Build/Lint/Test Commands**
- **Build**: `pnpm install && pnpm -w run build`
- **Lint**: `pnpm -w run lint`
- **Test**: `pnpm -w run test`
- **Single Test**: For a package (e.g. @bucketmate/client): `pnpm -F @bucketmate/client run test -- -t "<TestName>"` (Jest) or `--testNamePattern "<TestName>"` (Vitest). Adapt to the runner in use.

**Code Style**
- **Imports**: external modules first, then internal; use path alias `@/*` when available; avoid long relative paths.
- **Formatting**: follow ESLint/Next.js rules; run lint as CI gate; prefer consistent formatting across repo.
- **Types**: prefer explicit types; avoid `any`; use `unknown` when unsure; define interfaces for shapes.
- **Naming**: camelCase for variables/functions, PascalCase for types/classes, UPPER_SNAKE for constants.
- **Errors**: throw descriptive errors; create small custom error types; preserve stack; don’t swallow.
- **Modules**: small cohesive units; single responsibility; export practical public API.

**Testing & Quality**
- Add tests for new features; ensure tests are deterministic; mock external services properly.
- Run lint and tests locally before pushing; add CI checks if not present.

**Cursor/Copilot**
- Cursor rules: none configured.
- Copilot instructions: none configured.
