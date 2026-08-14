# In Göd Hands MVP Readiness

**Status: private, non-clinical MVP - not a broad public or clinical launch.**

This is an evidence-based operating boundary for the current product. It keeps the experience useful without implying services, oversight, or outcomes that the team has not yet put in place.

## Live, verified product scope

| Area | Status | Current boundary |
| --- | --- | --- |
| State check-in and self-guided practices | Live | A person chooses a plain-language state and can use short, optional grounding, reflection, planning, or reset paths. They may skip at any time. |
| Privacy-first private space | Live | Optional anonymous Supabase account only; no name, email, phone, health profile, contacts, or location are required. The person can delete the account. |
| Honey | Live with an availability dependency | Honey is a disclosed, non-clinical automated guide running through a constrained, authenticated bridge to the local Ollama model. It can be unavailable if the host computer or connection is unavailable. |
| Urgent support path | Live | The app directs a person to local emergency help, a trusted nearby person, and the independent Find A Helpline directory. It is not an emergency service. |
| Team check-in request | Live as a bounded intake tool | A person may voluntarily share a contact method and request a response. The app never promises a response time or continuous monitoring, and intake can be paused when the team is not covered. |
| Owner support queue | Live as a private owner tool | The protected queue can show new and in-progress requests and capacity signals. It is not yet multi-staff access, an audit system, or evidence of staffed coverage. |
| Accessibility and mobile use | Live | Responsive layout, keyboard-friendly dialogs, light/dark/system display, text size, contrast, reduced motion, optional on-device practice audio, and an installable offline shell for practices. Network features stay online-only and are never queued. |
| Optional anonymous practice feedback | Live | Off by default. When enabled, it stores only a practice category and a three-choice completion response; no writing, account ID, chat, contact detail, or device identifier is included. |

## Built-in safeguards

- No personal writing, Honey transcript, or reflection is stored by the app. Optional anonymous practice feedback is the narrow exception described above.
- Anonymous private-space creation is protected by server-side Turnstile verification.
- Honey has urgent-language routing, clinical-resource routing, model-output guardrails, a small request pace limit, and no-store responses.
- Team requests require informed consent, remain withdrawable from the same browser session, and are stored in a server-only Supabase queue.
- The team can set `TEAM_SUPPORT_INTAKE=paused` when it cannot truthfully accept new requests.

## Required before a broader pilot or public launch

These are human and operational gates, not features that software alone can certify.

1. **Safety and clinical review.** Approve non-clinical boundaries, urgent-help language, resource pathways, reviewed practices, and incident escalation for the launch geography.
2. **Privacy and legal review.** Approve the data inventory, disclosures, retention/deletion procedure, jurisdiction-specific requirements, vendor safeguards, and public claims.
3. **Covered team support.** Define who may answer requests, training and supervision, schedule and capacity, response expectations, quality assurance, and an incident process. Keep intake paused outside covered capacity.
4. **Staff identity and access.** Replace the owner-only shared-password queue with approved individual staff authentication, role-based permissions, and access/audit practices before sharing it with a team.
5. **Reliability and security review.** Confirm production monitoring, backup/recovery, secrets rotation, tunnel/host availability, and a response plan for the local Honey bridge.
6. **Closed-pilot evidence.** Test the experience with a small, consented adult cohort, measure comprehension and safety, and resolve high-severity issues before increasing access.

## Intentionally deferred

The following remain out of scope until evidence and governance justify them:

- diagnostic or treatment-like AI guidance;
- claims of therapy, clinical care, or guaranteed human availability;
- always-on peer chat, unsupervised matching, or a broad social community;
- employer dashboards, bulk personal analytics, and extensive third-party wearable ingestion;
- a large unreviewed content marketplace.

## Operating rule

When a capability is not staffed, reviewed, or available, the product should say so plainly, offer its self-guided paths and independent help directory, and avoid collecting more information than is necessary.
