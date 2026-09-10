# Maintaining these philosophies

README.md is the canonical statement. Change it through a pull request, regenerate content.json with `npm run build`, and obtain approval from another experienced human engineer before merging. Material changes require renewed approval. AI review cannot satisfy that requirement.

Run `npm ci`, `npm run check`, and `npm test`. CI rejects generated content that differs from the document.

The websites pin this repository's rendering package to a commit, include its complete text during their builds, and refresh content.json from main when a reader opens the philosophies page. Only document content updates automatically. Changes to rendering code require dependency updates and normal site review.

Both websites and the personal Dusk catalog import content on an hourly GitHub Actions schedule. Website synchronization commits only generated content, triggering the existing deployment pipeline so the initial HTML also stays current. The Dusk mirror is one globally pinned reference with the exact canonical commit. Each transfer checks the rendering against the source document from the same immutable commit. This republishes already reviewed commitments; changes to code or local prose still require ordinary pull requests.

The previous successful version remains available if synchronization fails. GitHub schedules and caches can delay propagation; compare revisions before assuming a change has arrived. Failed workflows must be investigated. Consumers should keep their standard GitHub Actions failure notifications enabled.

The GitHub profiles call out the commitments and link here. They do not maintain competing copies of the complete document.
