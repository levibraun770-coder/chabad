# Chabad Regional CRM

Mobile-first operational CRM shell for Chabad of Bologna / Emilia-Romagna.

## Security model

- No Salesforce contacts, notes, addresses, donations, access tokens, refresh tokens, client secrets, or snapshot files belong in this repository.
- The hosted static app contains code only.
- A private JSON snapshot can be imported locally in the browser and is stored in that browser's local storage.
- Salesforce remains the source of truth.
- Edits can be staged locally and converted into an exact ChatGPT update request containing the Salesforce record ID and only the intended fields.
- Direct Salesforce OAuth is intentionally disabled in this static build. A production direct-sync version requires a secure backend plus a Salesforce External Client App using Authorization Code + PKCE. Do not use pasted access tokens or implicit/user-agent OAuth.

## Current workflows

- Household-first review with individual contacts inside each household.
- Salesforce Account/Contact links.
- Geographic sections: Emilia-Romagna, Rest of Italy, Outside Italy, Unknown location.
- Search by names, phone, email, city, source evidence, and confirmed categories.
- Multiple confirmed categories without overwriting existing Salesforce evidence.
- Mark reviewed, skip, flag, previous/next, saved resume position.
- Shared household address editor with ChatGPT/Salesforce update request generator.
- Person phone/email editor with ChatGPT/Salesforce update request generator.
- Chanukah household campaign statuses and delivery deduplication.
- Local review/campaign backup export.
- PWA/offline app shell.

## Data boundary

Imported Salesforce fields are evidence. Do not infer Jewish status, household relationships, residency, student status, or donor status from names or incomplete signals. Household merges/splits require explicit human approval.
