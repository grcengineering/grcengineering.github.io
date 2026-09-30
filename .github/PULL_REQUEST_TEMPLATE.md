<!-- sscsb AI-provenance PR template -->
## Summary

<!-- What does this PR change and why? -->

## AI Provenance Declaration

<!-- Answer honestly — reviewers scale their scrutiny from these answers.
     The commit-level equivalents are the AI-Assisted/AI-Tool/AI-Model/AI-Role trailers. -->

- [ ] AI generated or assisted with **code** in this PR
- [ ] AI generated or assisted with **tests** in this PR
- [ ] AI introduced or suggested **new dependencies** in this PR
- [ ] AI generated or assisted with **documentation** in this PR

**AI tool(s)/model(s) used (if any):**

**Human review performed on AI-generated parts (what/how):**

## Dependency Changes

<!-- If new dependencies were added (especially AI-suggested ones):
     - `sscsb deps check` output attached?
     - packages verified to exist on their registry (anti-slopsquat)?
     - `sscsb deps approve <eco>:<name>` recorded in .sscsb/policy/packages.toml? -->

- [ ] No new dependencies
- [ ] New dependencies validated (`sscsb deps check`) and approved

## Merge Policy Reminder

Merges to protected branches must be signed by an approved **human** hardware-backed
key. When AI involvement is declared above, the merge commit needs review
evidence (`Reviewed-by:` trailer). See `docs/signing.md`.
