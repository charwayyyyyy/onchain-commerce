TRUSTBAY IMPLEMENTATION RULES

You are working inside the existing TrustBay codebase.
Do not treat this as a greenfield rebuild.
Extend and improve the current architecture carefully.

====================================================
1. CORE ENGINEERING RULES
====================================================

- Never do UI-only changes for features that are already exposed to users.
- Every visible feature must have real logic behind it or be removed/simplified.
- Prefer surgical changes over broad rewrites.
- Do not break existing working flows.
- Keep the project build-safe at all times.
- Preserve premium UI quality while prioritizing real functionality.
- Follow separation of concerns strictly.
- Keep business logic out of presentation components.

====================================================
2. STACK RULES
====================================================

Use only the existing stack unless absolutely necessary:
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Clerk
- Prisma
- MongoDB
- Server Actions
- Zod
- Sonner

Do not introduce unnecessary libraries.
Do not switch auth/database/state-management architecture.

====================================================
3. AUTH RULES
====================================================

- Clerk is the source of truth for authentication and identity.
- Do not build custom password/auth logic.
- Use `auth()` from `@clerk/nextjs/server` for protected server-side logic.
- Keep App Router patterns only.
- Do not use deprecated Clerk APIs.
- Use server-side guards for every protected mutation.
- Any action that changes user-owned data must verify:
  1. authentication
  2. role if needed
  3. ownership of resource

====================================================
4. DATA / DATABASE RULES
====================================================

- Prisma + MongoDB is the source of truth for app data.
- Persist all app-level settings and marketplace state in Prisma.
- Extend schema only when necessary.
- Avoid duplicating the same information across models unless justified.
- Prefer normalized, maintainable schema design.
- Preserve compatibility with existing data.
- Keep uniqueness constraints where appropriate, especially usernames/slugs.
- Ensure all data writes are validated before persistence.

====================================================
5. SETTINGS PAGE RULES
====================================================

Make every visible settings section truly functional where feasible.

Profile:
- must save real data to database
- must validate fields
- username must be unique
- do not show fake upload flows

Security:
- must defer identity/security management to Clerk
- do not create insecure local password logic
- clearly route users to Clerk-managed account security

Notifications:
- must persist preferences to DB
- toggles must load/save correctly

Verification:
- must show real current status only
- do not fake KYC or verification processes

Payments:
- seller payout wallet settings must persist to SellerProfile
- validate wallet input reasonably
- do not add fake card/bank systems for now

Language/Preferences:
- must persist to DB if shown in UI

If a settings section cannot be truthfully implemented yet, simplify the UI instead of leaving decorative controls.

====================================================
6. SERVER ACTION RULES
====================================================

- Use server actions for mutations.
- Use Zod for every mutation input.
- Return structured success/error outcomes.
- Do not trust client input.
- Prevent invalid state changes.
- Ensure ownership checks inside the action, not just in UI.
- Avoid mixing unrelated responsibilities in a single action.

====================================================
7. ROUTE / PAGE RULES
====================================================

- Every linked route must exist and work.
- No dead buttons.
- No dead tabs.
- No fake CTAs.
- If a page exists in navigation, it must be meaningful and integrated.
- Use server components for data-heavy page loading where appropriate.
- Use client components only when interaction requires them.

====================================================
8. ORDER / MARKETPLACE LOGIC RULES
====================================================

- Order lifecycle must behave like a real state machine.
- Enforce valid transitions only.
- Prevent duplicate or invalid transitions.
- Keep stock consistent on create/cancel/update flows.
- Buyer and seller actions must be role-restricted.
- Dispute creation must update order state consistently.
- Product visibility must respect product status.
- Marketplace should not surface archived/inactive products incorrectly.

====================================================
9. WISHLIST / SECONDARY FEATURE RULES
====================================================

- If wishlist UI exists, make it fully functional.
- Prevent duplicate wishlist items.
- Ensure add/remove/view all work end-to-end.
- Do not leave placeholder-only logic in user-facing flows.

====================================================
10. UX / USABILITY RULES
====================================================

- Every form must have:
  - pending state
  - success feedback
  - error feedback
  - disabled state while submitting
- Keep interactions clear and fast.
- Use descriptive empty states.
- Preserve accessibility and semantic labels.
- Keep mobile usability in mind.
- Prefer clarity over cleverness.
- Do not overload users with fake enterprise complexity.

====================================================
11. PERFORMANCE / MAINTAINABILITY RULES
====================================================

- Avoid unnecessary client-side fetching.
- Prefer server-rendered initial data when practical.
- Avoid duplicate database queries.
- Reuse domain helpers and validations.
- Keep files modular.
- Do not create giant all-in-one components.
- Group related logic into:
  - actions
  - validations
  - domain helpers
  - UI components

====================================================
12. DESIGN / PRODUCT RULES
====================================================

- Preserve the TrustBay premium visual system.
- Do not regress the interface into generic admin UI.
- Keep the product crypto-first and trust-centered.
- Settings, payouts, disputes, and orders should feel real and aligned with the product story.
- Use truthful UI only.
- If functionality is deferred, communicate it clearly in the product instead of pretending it works.

====================================================
13. QUALITY CONTROL RULES
====================================================

Before considering a task complete, verify:
- the feature works end-to-end
- persistence is real
- validation is present
- authorization is enforced
- navigation is valid
- UI states are complete
- build still succeeds
- no hydration mismatch is introduced
- no placeholder controls remain in visible production flows

====================================================
14. DO NOT DO
====================================================

- Do not rebuild the whole app unnecessarily
- Do not introduce fake backend logic
- Do not leave decorative forms unconnected
- Do not duplicate Clerk responsibilities
- Do not trust client-side role checks alone
- Do not create insecure direct object access
- Do not add TODO-only visible features
- Do not add unnecessary dependencies
- Do not break current working features while implementing new ones

====================================================
15. EXPECTED OUTPUT STYLE
====================================================

When implementing:
- make code changes directly
- keep them minimal but complete
- explain what was added/fixed
- mention any intentionally deferred items explicitly
- preserve build stability
- prefer production-grade correctness over speed-hack solutions

FINAL PRINCIPLE:
TrustBay should behave like a real product, not a demo. Every exposed feature must either work properly, be truthfully simplified, or be removed from the visible UI until it is ready.