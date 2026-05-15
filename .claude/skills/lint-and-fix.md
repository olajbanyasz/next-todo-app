# Skill: Lint and Fix

## Purpose
Run ESLint on the project, automatically fix all auto-fixable errors, then report any remaining issues that require manual attention.

## Steps

### 1. Run ESLint with `--fix` flag

Execute the following command from the project root (`c:\dev\next-todo-app`):

```powershell
npx eslint . --fix
```

This will:
- Scan all files matched by `eslint.config.mjs` (excludes `.next/`, `out/`, `build/`, `next-env.d.ts`)
- Automatically fix all auto-fixable rule violations (formatting, unused imports that can be removed, etc.)
- Leave unfixable errors in place and print them to stdout

### 2. Capture and parse the output

After running `--fix`, re-run ESLint **without** `--fix` to get the final error list:

```powershell
npx eslint . --format=compact
```

Parse the output and categorize issues by severity:
- **errors** (severity 2) — must be fixed before build
- **warnings** (severity 1) — should be addressed but won't break the build

### 3. For each remaining error

For **every remaining error** that was NOT auto-fixed:
1. Open the referenced file.
2. Read the surrounding context (at least ±10 lines around the reported line).
3. Understand the rule that was violated (look up the rule name if needed).
4. Apply a manual fix that resolves the violation without changing the intended behavior.
5. Re-run ESLint on that specific file to confirm the fix:
   ```powershell
   npx eslint <filepath>
   ```

Repeat until `npx eslint .` exits with code `0` (no errors).

### 4. Report the outcome

After all errors are resolved, report back with:

| Category | Count |
|----------|-------|
| Auto-fixed | N |
| Manually fixed | N |
| Remaining warnings | N |

List any remaining **warnings** with their file, line, and rule name so the user can decide whether to address them.

## Important Notes

- **Never suppress errors with `// eslint-disable`** unless the user explicitly asks for it.
- **Do not change the ESLint configuration** (`eslint.config.mjs`) to silence rules — fix the code, not the config.
- If a fix would require a larger refactor (e.g., a `@typescript-eslint/no-explicit-any` violation inside a complex type), describe the issue and ask the user how they want to proceed instead of making a breaking change.
- The lint script in `package.json` is `"lint": "eslint"` — prefer `npx eslint` directly so flags can be passed freely.
