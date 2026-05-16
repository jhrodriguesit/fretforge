# How to use these skills

This project has 9 skills installed via /bootstrap-skills. Each one extends what the agent can do — some trigger automatically, others you invoke explicitly.

## Installed skills

### grill-me
**What it does:** Relentlessly interviews you about a plan or design, resolving each branch of the decision tree before any code is written.
**How to trigger:** `/grill-me`, or say "grill me" / "stress-test this plan" / "let's think through this design"
**When to use it:** Before starting any non-trivial feature — catch design gaps early rather than mid-implementation.

### caveman
**What it does:** Ultra-compressed communication mode, ~75% fewer tokens while keeping full technical accuracy.
**How to trigger:** `/caveman`, or say "caveman mode" / "be brief" / "less tokens". Off with "stop caveman".
**When to use it:** Long sessions where you want tight, dense responses instead of prose explanations.

### tdd
**What it does:** Enforces red-green-refactor discipline — writes the failing test first, then the minimum code to pass, then refactors.
**How to trigger:** `/tdd`, or say "use TDD" / "test-first" / "red-green-refactor"
**When to use it:** Any time you're building a new feature or fixing a bug in `src/utils/`, `src/data/`, or components.

### vercel-react-best-practices
**What it does:** Applies 70 React performance rules from Vercel Engineering — component patterns, rendering, bundle optimization.
**How to trigger:** Auto-triggers when writing, reviewing, or refactoring React components.
**When to use it:** When building new components or reviewing existing ones for performance regressions.

### vitest
**What it does:** Deep Vitest reference (mocking, coverage, fixtures, watch mode) — from Vitest's creator Anthony Fu.
**How to trigger:** Auto-triggers when writing or debugging tests. Say "write a vitest for X" or "how do I mock Y in vitest".
**When to use it:** When writing co-located tests in component feature folders.

### requesting-code-review
**What it does:** Dispatches a focused reviewer subagent to catch issues before merge — gets fresh context, not your session history.
**How to trigger:** Auto-triggers after major features. Say "review this" / "check my work before I merge".
**When to use it:** After completing a significant chunk of work, before merging to main.

### accessibility
**What it does:** WCAG 2.2 audit and remediation — semantic HTML, keyboard nav, screen reader support, color contrast.
**How to trigger:** Say "a11y audit" / "improve accessibility" / "WCAG compliance" / "make this keyboard-navigable".
**When to use it:** When building new UI components or doing an accessibility pass on existing views.

### github-actions-docs
**What it does:** Grounds CI/CD answers in official GitHub Actions documentation rather than stale memory.
**How to trigger:** Auto-triggers when you ask about GitHub Actions workflows, runners, secrets, OIDC, or deployment.
**When to use it:** When setting up CI for FretForge (lint, test, build, deploy pipeline).

### bootstrap-skills
**What it does:** Runs a structured interview and installs the best-fit skills from skills.sh for the project.
**How to trigger:** `/bootstrap-skills`
**When to use it:** When the project grows into new territory (e.g. adding a backend, setting up monitoring) and you want new skills to match.

## Tips
- Skills with a slash command (e.g. `/tdd`, `/caveman`, `/grill-me`) are explicit — type the command to run them.
- Skills without one trigger automatically when the agent recognizes the task from the description.
- Re-run `/bootstrap-skills` anytime to add more skills as the project grows.
