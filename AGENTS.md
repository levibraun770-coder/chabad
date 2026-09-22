# Chabad of Bologna Website — Codex Instructions

## Role and scope

Work as the senior developer/designer for the Chabad of Bologna website.

- Live site: https://www.chabadbologna.com/
- Repository: levibraun770-coder/chabad
- GitHub Pages: https://levibraun770-coder.github.io/chabad/
- Platform: ChabadOne, with some GitHub-hosted pages/assets/data/automation.

This repository has mixed roles. Much of it is a backup/snapshot/reference of the public site. Some GitHub-hosted assets or automation may still be consumed by live pages. A GitHub commit or push does **not** by itself prove that the live ChabadOne page was updated.

## Source-of-truth order

When sources disagree, use this order:

1. The user's explicit instruction in the current task.
2. The current live ChabadOne page for what visitors actually see.
3. The current file/state in this repository.
4. These instructions.
5. Older chat history, cached text, snapshots, or search results.

Never use stale repository text, cached text, or memory as proof of the current live site.

## Before changing anything

1. Inspect the existing file/page first.
2. Determine what kind of page/resource it is:
   - native ChabadOne content,
   - GitHub/iframe content,
   - GitHub-hosted shared CSS/data/asset,
   - backup/snapshot only.
3. If the request concerns the live website, inspect the live page as well whenever access is available.
4. Check the existing structure, links, wording, mobile behavior, and dependencies before editing.
5. Make the smallest change necessary. Do not “clean up,” rewrite, redesign, or modernize unrelated content.

## Publishing and verification

- Do not equate “pushed to GitHub” with “published on chabadbologna.com.”
- If a GitHub-hosted asset is referenced by ChabadOne, verify that dependency before treating a GitHub edit as live-impacting.
- For native ChabadOne pages, the live content must be changed in ChabadOne; changing a backup copy in this repository is not publication.
- If direct ChabadOne editing is unavailable, prepare the correct repository/file change if useful, but state clearly that the live page was not changed.
- Never say “updated,” “fixed,” “live,” or equivalent unless the relevant operation actually succeeded.
- After a live change, verify the live URL when possible.
- Check both desktop and mobile behavior for layout changes.

## Preserve content

Unless the user specifically asks for a change, preserve:

- exact wording and meaning,
- dates and times,
- addresses and contact information,
- URLs,
- RSVP, donation, payment, registration, and form links,
- Hebrew/transliteration,
- page titles and event details.

Do not shorten or rewrite user-approved copy merely for style. If a requested design change can be done without changing text, leave the text alone.

## ChabadOne architecture

- Keep forms, payments, registrations, zmanim, syndicated content, and other functional ChabadOne features native unless explicitly instructed otherwise.
- Existing iframe pages may remain while native migration continues.
- Native ChabadOne content may use shared styling hosted from GitHub.
- Preserve the normal ChabadOne header/footer unless the page is intentionally designed to replace or hide them.
- Avoid duplicate headers, footers, titles, or navigation.
- Do not rely on JavaScript for essential layout or core content when CSS/HTML is sufficient.

## Design system

Use the Chabad of Bologna visual language:

- Burgundy: #8F173E
- Orange: #F47A2A
- Warm cream: #FAF6EF
- Navy: #152238

Design should feel clean, premium, warm, human, and appropriate for a Jewish community—not generic or “AI-looking.”

Priorities:
- mobile-first,
- clear hierarchy,
- generous but controlled spacing,
- readable type,
- prominent practical information,
- accessible buttons/links,
- minimal clutter.

Do not reintroduce previously rejected gray ב״ה styling.

## Important site relationships

- Student-facing Jewish Life content should direct students to the Student Portal where appropriate.
- Student Portal content ultimately points to the Chabad on Campus student experience.
- The Payment & Refund Policy live page is:
  https://www.chabadbologna.com/templates/articlecco_cdo/aid/7513165/jewish/Payment-Refund-Policy-page.htm
- The About page live article is under aid/7259961.
- Functional event/holiday forms should remain on their proper ChabadOne URLs rather than being replaced by static mock forms.

Do not assume these are the only important pages; inspect current navigation before making structural changes.

## Weekly Shabbat information

The repository contains automation/data for weekly Shabbat information. Inspect the current data/workflow before changing schedule logic.

Static fallback/default schedule previously specified by the user:
- Kabbalat Shabbat: 19:30
- Shacharit: 09:30
- Lunch: 12:30

Specific holidays, special events, or explicit weekly instructions override these defaults.

## Git and code safety

Before editing:
- inspect `git status` and the relevant files,
- do not overwrite unrelated local/user changes,
- do not reset, clean, force-push, or discard changes unless explicitly asked.

After editing:
- review the diff,
- run relevant existing checks/scripts when applicable,
- verify links and obvious HTML/CSS errors,
- preserve existing conventions unless there is a reason to change them.

If asked to publish, confirm what “publish” means for that resource: GitHub push, live ChabadOne edit, or both.

## Working style

- Act on clear instructions rather than repeatedly asking for confirmation.
- If something is ambiguous, inspect the current implementation first instead of guessing.
- Ask at most one question when essential information truly cannot be determined.
- Keep explanations concise and practical.
- Report exactly what changed, where it changed, and whether the result is repo-only or verified live.
