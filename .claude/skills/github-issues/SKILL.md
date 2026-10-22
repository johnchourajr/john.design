---
name: github-issues
description: How John tracks work in GitHub Issues. Use when filing, writing, labeling, or grouping an issue, when a PR needs an issue to close, or when asked to "file an issue", "open a ticket", "track this", "make a tracking issue", or to turn findings (an audit, a review, a bug report) into tickets. Covers the title and body shape, labels, tracking issues, and how PRs link back.
---

# GitHub Issues

Tickets are **GitHub Issues**, driven with `gh issue`. Not Linear, not Notion,
even when those are connected. Codified from how `thegrandlb` runs; that repo's
closed issues are the reference set when an example helps
(`gh issue list -R johnchourajr/thegrandlb --state closed`).

## Before filing

- `gh issue list --search "<words>" --state all` first. Add to an existing
  issue rather than opening a near-duplicate.
- **One issue, one outcome.** If the write-up has two outcomes, it is two
  issues. Related findings that share an outcome stay together.
- Look before writing. An issue cites what is actually there (file paths,
  class names, measured numbers, quoted copy), so read the code or open the
  page first. Never file from memory of how something works.

## Title

A declarative sentence about the problem **as it is now**, in plain words a
non-engineer could follow:

- "The inquiries list is unreadable on a phone"
- "The experiment readout dies on a single transient database error"
- "A sign-in link says \"Reset your password\""

For an enhancement, state what should be true: "Every figure on the analytics
dashboard should open", "Drill-downs should open in a drawer, not inline".

Never an imperative task ("Fix X", "Add Y"), never a conventional-commit
prefix (`feat:`), never a component name alone ("SettingsGroup UI").

## Body

Sections as `##` headings, in this order. Skip any that would be empty.

1. **The problem** (or **What it looks like** for something visible). Concrete
   evidence: the number, the quoted text, the screenshot, the file and line.
   Bold the one fact that makes the case ("**1,088px**. A phone is 375.").
2. **Why**: the root cause, if known. Name the function or class.
3. **This repo has already answered this**, when the codebase solved the same
   problem elsewhere. Quote it; inconsistency is the strongest argument.
4. **Also found while looking**: adjacent problems with the same outcome, as
   bullets. Anything with a different outcome becomes its own issue.
5. **Outcome**: one or two sentences on what is true when this closes. Not a
   task list, not an implementation. The PR decides the how.

Write it for someone who wasn't in the conversation. Short paragraphs, real
numbers, no hedging. Reference other issues and PRs by `#N`. No em dashes
(house style): use a colon, full stop, comma, or parentheses.

## Labels

Use the GitHub defaults: `bug` (something is wrong) or `enhancement`
(something new or better). For a body of related work, create one workstream
label whose description names its tracking issue, e.g.
`inquiry-gap: Recovering the 811 abandoned inquiries, see #220`. Don't invent
a label for a single issue.

```bash
gh label create <name> --description "<what it groups>, see #<tracking>"
```

## Tracking issues

When a piece of work spans several issues, open a tracking issue that holds:

- the finding that motivates the series, with its numbers;
- an **order of work** table (`# | Issue | Status`) kept current as issues
  close;
- decisions that are someone else's to make, called out as blocking.

Child issues carry the workstream label and mention the tracking issue.

## Filing

Write the body to a file and pass it with `--body-file`, so markdown, quotes
and backticks survive the shell:

```bash
gh issue create --title "<sentence>" --label enhancement --body-file /path/to/body.md
```

Attach screenshots by dragging them into the issue on GitHub; `gh` can't
upload images. When a screenshot was shared in chat, describe what it shows in
the body and tell John to attach it.

Report the issue URL back. Don't assign, set a milestone, or add to a project
unless asked.

## Closing the loop

- The PR body opens with `Closes #N`. If there is no issue yet, file one
  first: a PR without one has nowhere to close to.
- **PR titles** are declarative sentences about what is now true ("The drawer
  overlays the table without blocking it"). Commits stay conventional.
- Where a rule in code exists because of an issue, cite the number in the
  comment at that site (`// Rejected newlines silently, see #241`).
- The issue closes when John merges. Don't close it by hand, and don't merge.
