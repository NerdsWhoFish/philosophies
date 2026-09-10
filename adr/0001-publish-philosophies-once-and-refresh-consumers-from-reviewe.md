# 1. Publish philosophies once and refresh consumers from reviewed content

Date: 2026-09-10

## Status

Proposed.

## Context and Problem Statement

Two independently deployed websites and every agent session need the same accepted philosophies.
Human-reviewed commitments must remain readable when GitHub is unavailable.
Dusk cannot currently ingest the new organization repository directly.

## Considered Options

1. Canonical Markdown with shared rendering and a scheduled Dusk mirror
2. Hand-maintained copies
3. Cross-repository push credentials and deployment dispatch

## Decision Outcome

Chosen: **option 1**.

Keep README.md canonical. Generate checked HTML/JSON and pin reusable rendering code in website dependencies. Both websites build a complete static fallback and refresh content from the public canonical repository at page load. Only content is fetched at runtime; code stays pinned. Import the canonical document into one generated global pinned reference in the existing Dusk catalog repository on an hourly schedule.

## Consequences

### Good

- One reviewed source controls commitments.
- No new cross-repository credentials or Dusk service changes.
- Static content and Dusk's last successful mirror survive source outages.

### Bad

- Website refresh depends on GitHub caching and successful requests.
- Dusk updates depend on the hourly Actions schedule and webhook delivery.
- Generated content needs drift checks and source provenance.

### Rejected because

- Hand-maintained copies drift and require repeated editorial work.
- Cross-repository dispatch requires broader credentials and couples unrelated deployments for a text update.
