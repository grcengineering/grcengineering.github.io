# Security Policy

This repository holds the source for **https://grc.engineering** — a public,
static documentation site built with MkDocs and published to GitHub Pages.

## Reporting a vulnerability

Report privately through **GitHub Security Advisories**:

> https://github.com/grcengineering/grcengineering.github.io/security/advisories/new

Private vulnerability reporting is enabled on this repository. Please do **not**
open a public issue for a security problem.

Please include, where you can:

- what you found and where (file, URL, or workflow),
- how to reproduce it,
- what an attacker could do with it.

**Expect an acknowledgement within 5 business days**, and an assessment with a
remediation plan or a reasoned rejection within 30 days. Reports are handled by
the repository maintainers; there is no bug bounty.

## Scope

In scope:

- this repository's content, build workflows, and GitHub Actions configuration;
- the published site at `grc.engineering` and `www.grc.engineering`;
- the supply-chain configuration under `.sscsb/`.

Out of scope:

- third-party services the site merely links to (blog, Slack, LinkedIn);
- findings that require a compromised maintainer account or workstation;
- missing hardening headers on GitHub Pages, which GitHub controls and this
  repository cannot set.

Because the site is static and serves no user data and no authenticated
surfaces, the realistic risk here is supply-chain: a tampered build, a
compromised dependency or Action, or a leaked credential.

## Supply-chain controls

This repository is bootstrapped with
[sscs-bootstrapper](https://github.com/p4gs/sscs-bootstrapper). Configuration is
in `.sscsb/config.toml`; current posture is reproducible with `sscsb verify` and
`sscsb report`. In force:

| Area | Control |
| --- | --- |
| Secrets | TruffleHog (verified findings) in pre-commit/pre-push hooks and CI, plus GitHub secret scanning with push protection |
| SAST | CodeQL (`actions` + `javascript-typescript`, `security-extended`), OpenGrep, and Semgrep Cloud |
| Dependencies | Trivy + OSV-Scanner, Dependabot security updates, Renovate with digest pinning |
| Build integrity | All Actions pinned to full commit SHAs, StepSecurity Harden-Runner on every job, least-privilege `permissions` |
| Provenance | Syft SBOM, Sigstore/cosign signing, SLSA provenance and GitHub artifact attestations for any released artifact |
| Source integrity | Signed commits, protected default branch, `sscsb` pre-push policy gate |

## Supported versions

The site is continuously deployed from `main`; only the currently published site
is supported. There are no versioned releases to backport fixes to.
