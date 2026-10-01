# Content model — where every public fact comes from

Primary source: `LAST DRAFT Usao_Community_Library_Concept_Note.docx`.
Secondary: `Concept Note-Usao Library_August 2026.docx`, `FINAL USAO Partnerships Letters.docx`
(contains the authoritative verification notes), outreach letters, `Oganizations to reach out to.docx`,
supplied images + UCReCENT brand board.

## Canonical facts (all in `frontend/lib/site.ts`)

| Fact | Value | Source |
|---|---|---|
| Name / tagline | Usao Community Library / Read · Learn · Grow · Succeed | Concept Note + brand board |
| Location | Usao Sublocation, Mbita East Division, Mbita Constituency, Homa Bay County, Kenya | Concept Note |
| Lead | Dr. Benard Oloo, PhD, Lecturer Egerton University; +254 725 817 520; olooo.odhiambo@gmail.com | Concept Note + letters |
| Vision / Mission / Goal | Verbatim in `SITE` | LAST DRAFT §§ Vision/Mission/Goal |
| Objectives (6) | Verbatim in `OBJECTIVES` | LAST DRAFT § Specific Objectives |
| Phase 1 spec | Mabati-and-wood; 10,000-book shelving; 100 seats; librarian office | Concept Note §§ 5, 9 |
| Phase 1 budget | KES 500,000 ceiling; 9-line breakdown in `BUDGET` | Concept Note budget table |
| Full functionality | KES 4,300,000; 144 sqm @ KES 30,000/sqm | Concept Note |
| Launch | 7 October 2026, **planned** | Concept Note (always labelled planned) |
| Land | Donated by the community | Concept Note |
| First 1,000 books | Identified via The Reading Culture — **terms to confirm** | Concept Note (flagged) |
| Beneficiaries | 4 primaries + 4 secondaries + youth/teachers/parents; wider Mbita East indirect | Concept Note § Target Beneficiaries |
| Timeline (6 milestones) | Aug 2026 → 7 Oct 2026 → ongoing | LAST DRAFT timeline table |
| Board (8 names) | Listed with "confirm role" notes | Concept Note § Governance |
| Partners | 4 named collaborators / 13 organisations being engaged / 7 champions, all `to-verify` | FINAL pack + Concept Note |
| Support needs (9) | Funds, books, materials, solar, ICT, connectivity, skills, volunteering, other | Concept Note § Partner With Us (expanded into form `SUPPORT_TYPES`, mirrored in backend `support_types.py`) |
| Support form | name, email, phone, organization, support_type (9 fixed values), amount (optional), message | V1 spec; no payment processing — enquiry only |
| Updates (3) | Each has title, slug, cover image (supplied project image), excerpt, date, category, full content; rendered at `/updates` and `/updates/[slug]` | Derived from Concept Note, dated Aug 2026 |
| Gallery (10) | 4 renderings + brand board + 5 community photos; categories Designs/Brand/Community; lightbox with keyboard support | Extracted docx media + WhatsApp images |

## Rules

- `frontend/lib/site.ts` is the only place these values are defined. Pages/components import them.
- Backend `apps.content` seed data must match `site.ts`; `apps.enquiries` has no payment fields by design.
- Anything uncertain carries `status: "to-verify"` and is rendered with a visible "To verify" pill —
  never silently presented as confirmed.
