# Skill: Commit and Push

## Purpose
Stage all current changes, generate a meaningful commit message (≤ 50 characters), commit, and push to the remote.

## Steps

### 1. Check working tree status

```powershell
git status --short
```

- If the output is **empty** → nothing to commit, report that and stop.
- Otherwise, continue.

### 2. Inspect what changed

```powershell
git diff --stat HEAD
```

Also read the actual diff to understand *what* changed:

```powershell
git diff HEAD
```

For new untracked files, check their content:

```powershell
git diff --cached  # if already staged
```

### 3. Compose the commit message

Based on the diff, write a single-line summary that:

- Is **at most 50 characters** (count carefully — reject anything longer)
- Uses the **imperative mood** (e.g. "Add", "Fix", "Remove", "Refactor", "Update")
- Is **specific to the actual change** — never use generic messages like "update files" or "fix stuff"
- Does **not** end with a period

**Good examples:**
- `Fix unused catch bindings in auth pages`
- `Add draggable radio widget`
- `Refactor admin stats into server action`
- `Remove deprecated _err catch variables`

**Bad examples (reject these):**
- `update` — too vague
- `Fixed a bug in the code that was causing issues` — too long (52 chars) and vague
- `Changes.` — meaningless and ends with a period

If the diff spans multiple unrelated concerns, pick the **dominant** change for the subject line.

### 4. Stage all changes

```powershell
git add -A
```

### 5. Commit

```powershell
git commit -m "<your message here>"
```

> **Note (PowerShell):** Do NOT chain commands with `&&` — PowerShell does not support it. Run each command separately.

Verify the commit was created:

```powershell
git log -1 --oneline
```

### 6. Push

```powershell
git push
```

If the push is rejected (e.g. remote has diverged), do **not** force-push. Instead, report the error to the user and ask how to proceed.

### 7. Report the outcome

Report back with:

- The exact commit message used
- The number of files changed, insertions, and deletions (from `git diff --stat HEAD~1 HEAD`)
- The remote branch that was pushed to

## Important Notes

- **Never force-push** (`git push --force` / `--force-with-lease`) without explicit user approval.
- **Do not amend** existing commits without explicit user approval.
- **Do not create** a new branch — push to whichever branch is currently checked out.
- If `git push` asks for credentials, report the error and stop.
- The 50-character limit is a hard constraint — trim or rephrase the message if needed, but never exceed it.
