# Linear

Task tracking for Safefund lives in Linear, team **SafeFund**; agents use it by default.

| Field | Value |
|---|---|
| Workspace | Z — https://linear.app/useforz53 |
| Team | **SafeFund**, key `SAFEFUN` (issues are `SAFEFUN-<n>`) |
| Projects | none yet |
| MCP server | `linear`, configured in root `.mcp.json` (`https://mcp.linear.app/mcp`, OAuth via `/mcp`) |

## Rules for agents

- Always pass `team: "SafeFund"` when listing or creating issues.
- Ignore the **Kintalks** team (`KIN-*`) in the same workspace: it is an unrelated product.
- Before creating an issue, check `list_issues` (team SafeFund) for a duplicate.
- `SAFEFUN-1`, `-3`, `-4` are Linear's default onboarding issues, all canceled. Ignore them.

Decided 2026-11-17, see [[decisions]].

Sources: none (team decision in chat, 2026-11-17)
