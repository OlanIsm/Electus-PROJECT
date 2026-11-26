# Light Dashboard

## Scope

The light authenticated app shell and `/dashboard` retain the approved
reference-inspired layout with an Electus-specific navy and emerald palette.
Public pages and the dark visual identity retain
their existing styling. Shared navigation carries the light shell across the
authenticated routes; their page content has not been redesigned.

## Visual System

- Typography: Urbanist, weights 400-700, loaded from Google Fonts. This is a
  close geometric substitute, not an identification of the reference's font.
- Canvas: `#f3f6f7`, edge-to-edge with no outer padding, frame, or rounded
  desktop shell. The sidebar touches the viewport edges; content uses the full
  available width with internal spacing retained.
- Ink: `#153648`; secondary text: `#51616b`.
- Brand navy: `#0b354d` for the primary upload card and active navigation/tabs.
- Brand emerald: `#21734f` for progress, review actions, focus, and selection controls.
- Information: ice blue `#e1ecf3`; pending: sand `#f1ebdd`; reviewed/screening:
  pale green `#dcece2`; supporting metrics: slate `#e7ecef`.
- Candidate cards are white, with blue-tinted skills and profile controls.
  Row position does not carry an arbitrary color or imply candidate ranking.
- Candidate rows have no avatar. Names use 23px type (21px on mobile), followed
  by a two-line description above skills. Previews use the first nonempty AI
  summary point, falling back to experience and education. Blind screening
  uses only structured experience/education to avoid revealing identity from
  free-form summaries. Processing and failed analysis have explicit messages.
- Panels: flat fills, 26-32px radii; white circular controls and navy active tabs.
- Status dots retain explicit text labels; destructive actions remain red.
- Icons: existing Lucide React library; 1.5-2px strokes and northeast arrows for
  navigation. The existing Electus logo remains unchanged. No reference
  portraits or fabricated candidate photos are used.

## Dashboard Behavior

Mode: Operate. Recruiters upload CVs, search candidates, review profiles, and
track progress. Desktop places candidate work in the wide left column and
live review progress on the right. Below 960px these sections stack. Below
640px the icon rail becomes fixed bottom navigation with safe-area padding.

Blind screening remains enabled initially. All figures derive from the current
candidate collection, except the pre-existing Interviews Sent metric, which
still has no backend integration and remains zero. Progress is explicitly
labelled as search-result progress during semantic search.

The workspace's left card is a Monday-first calendar, opening on the current
local month and date. Month navigation, date selection, and Today are supported;
it is not an interview schedule and displays no fabricated events. Upload
Candidates occupies the right card; Statistics remains available in navigation.
On mobile the calendar and upload card stack.

The AI tokens panel sits directly above the blind-screening note. There is no
backend token accounting contract yet, so it explicitly shows "Balance
unavailable", not a fabricated quantity or the Account page's static quota.
"Upgrade your plan" is intentionally a non-navigating button pending integration.

## Implementation

`src/components/layout/dashboard-light.css` owns the scoped `.light` styling.
Portaled candidate dialogs have explicit light styling outside the shell.
Dark mode retains Inter and its existing glass surfaces. Theme preference and
the existing default theme have not been changed.

## Verification

Desktop (1440px) and mobile (390px) browser checks use synthetic, intercepted
API responses, not production candidate data. Checked blind screening,
profile opening, review status updates, tabs, delete cancellation, and search.
The dark desktop rendering is also checked. The live backend was not started.
