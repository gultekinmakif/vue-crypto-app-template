# Rulesets

GitHub branch-protection rulesets, version-controlled as JSON. GitHub does **not** auto-apply these from `.github/` — you import them manually (or scripted) per repo.

## Available rulesets

- [`pr-protection.json`](pr-protection.json) — protects the default branch: restrict deletions, block force pushes, require a PR with ≥1 approving review (code-owner review required, last-push approval required, stale reviews dismissed on push). Admin role bypasses (`actor_id: 5`).

## Importing a ruleset into this repo

```bash
gh api --method POST \
  -H "Accept: application/vnd.github+json" \
  "repos/{owner}/{repo}/rulesets" \
  --input <(jq 'del(.id, .source, .source_type)' .github/rulesets/pr-protection.json)
```

The `jq` step strips source-repo metadata so GitHub treats this as a fresh ruleset. Requires `gh` authed with `repo` scope.

## Exporting current state

After editing in the UI, capture back to JSON:

```bash
RULESET_ID=$(gh api "repos/{owner}/{repo}/rulesets" --jq '.[] | select(.name=="PR Protection").id')
gh api "repos/{owner}/{repo}/rulesets/$RULESET_ID" > .github/rulesets/pr-protection.json
```
