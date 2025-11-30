# Implementation Plan: Drag to Reorder

**Branch**: `001-drag-reorder` | **Date**: 2025-11-30 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-drag-reorder/spec.md`

## Summary

Enable users to manually reorder todos via drag-and-drop with a dedicated grip handle. Order persists to the database and loads correctly on page refresh. Includes optimistic UI updates for instant feedback and Alt+Arrow keyboard shortcuts for accessibility.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)  
**Primary Dependencies**: Next.js 15.x, React 19.x, @dnd-kit/core (drag-and-drop library)  
**Storage**: Turso (libSQL/SQLite) via Drizzle ORM  
**Testing**: Jest + React Testing Library (unit/component), Playwright (E2E)  
**Target Platform**: Web (modern browsers)  
**Project Type**: Next.js App Router web application  
**Performance Goals**: <100ms optimistic UI response, <2s total interaction time  
**Constraints**: Must work without JavaScript for initial render (SSR), graceful degradation  
**Scale/Scope**: Single-user todo app, ~100 todos max expected

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Clarity Over Cleverness | ✅ PASS | Feature is straightforward; drag-drop is a well-known pattern |
| II. Server-First Architecture | ✅ PASS | Reorder action will be a Server Action; list renders server-side |
| III. Explicit Error Handling | ✅ PASS | Plan includes error rollback for failed reorder operations |
| IV. Type Safety | ✅ PASS | Todo type will be extended with `position` field via Drizzle |
| V. Pedagogical Intent | ✅ PASS | Feature demonstrates optimistic UI + persistence sync patterns |
| VI. Test-First Development | ✅ PASS | Will write tests before implementation per TDD workflow |

**Gate Status**: ✅ All principles satisfied. Proceeding to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/001-drag-reorder/
├── plan.md              # This file
├── research.md          # Phase 0 output - drag-drop library research
├── data-model.md        # Phase 1 output - position field schema
├── quickstart.md        # Phase 1 output - implementation guide
├── contracts/           # Phase 1 output - server action API
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
app/
├── actions.ts           # Add reorderTodosAction server action
├── todo-list.tsx        # Add drag-drop context and optimistic reorder
├── todo.tsx             # Add drag handle to each todo item
├── drag-handle.tsx      # New: Drag handle component (grip icon)
└── __tests__/
    ├── actions.test.ts  # Add reorder action tests
    └── todo-list.test.tsx # Add drag-drop interaction tests

db/
├── schema.ts            # Add position column to todosTable
└── __mocks__/
    └── index.ts         # Update mock for position field

migrations/
└── 0001_add_position.sql # New migration for position column

e2e/
└── drag-reorder.spec.ts # New E2E test for drag-drop flow
```

**Structure Decision**: Next.js App Router structure (existing). All feature code lives in `app/` directory with colocated tests. Database changes in `db/` with Drizzle migrations.

## Complexity Tracking

> No violations to justify. Feature follows existing patterns.

## Post-Design Constitution Re-Check

*Verified after Phase 1 design artifacts completed.*

| Principle | Status | Design Verification |
|-----------|--------|---------------------|
| I. Clarity Over Cleverness | ✅ PASS | @dnd-kit is a standard library; gap-based positioning is simple to understand |
| II. Server-First Architecture | ✅ PASS | `reorderTodosAction` is a server action; client only handles UI |
| III. Explicit Error Handling | ✅ PASS | Server action logs errors and re-throws for optimistic rollback |
| IV. Type Safety | ✅ PASS | `position` field added to Drizzle schema with proper types |
| V. Pedagogical Intent | ✅ PASS | Demonstrates real-world patterns: optimistic UI, drag-drop, persistence |
| VI. Test-First Development | ✅ PASS | Quickstart specifies tests before each implementation phase |

**Post-Design Gate**: ✅ All principles satisfied. Ready for Phase 2 task generation.
