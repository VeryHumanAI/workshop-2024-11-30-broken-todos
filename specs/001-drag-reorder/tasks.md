# Tasks: Drag to Reorder

**Input**: Design documents from `/specs/001-drag-reorder/`  
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/ ✓, quickstart.md ✓

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)

---

## Phase 1: Setup

**Purpose**: Install dependencies and configure drag-drop infrastructure

- [ ] T001 Install @dnd-kit dependencies: `npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`
- [ ] T002 [P] Verify @dnd-kit types are available in TypeScript

---

## Phase 2: Foundational (Database Schema)

**Purpose**: Add position column to todos table - BLOCKS all user stories

**⚠️ CRITICAL**: No drag-drop work can begin until position field exists

- [ ] T003 Add `position` column to schema in `db/schema.ts`
- [ ] T004 Generate migration: `npm run db:generate`
- [ ] T005 Run migration: `npm run db:migrate`
- [ ] T006 Update database mock to include position field in `db/__mocks__/index.ts`
- [ ] T007 Add tests for `getTodos` ordering by position in `app/__tests__/actions.test.ts`
- [ ] T008 Modify `getTodos` to order by position in `app/actions.ts`
- [ ] T009 Add tests for `addTodo` setting position on new todos in `app/__tests__/actions.test.ts`
- [ ] T010 Modify `addTodo` to assign position to new todos in `app/actions.ts`

**Checkpoint**: Database ready - position field exists and actions work with it

---

## Phase 3: User Story 1 - Reorder Todos by Dragging (Priority: P1) 🎯 MVP

**Goal**: Users can drag and drop todos to reorder them visually

**Independent Test**: Drag a todo up or down in the list, verify it moves to new position

### Implementation for User Story 1

- [ ] T011 [P] [US1] Add test for `reorderTodosAction` in `app/__tests__/actions.test.ts`
- [ ] T012 [US1] Implement `reorderTodosAction` server action in `app/actions.ts`
- [ ] T013 [P] [US1] Add test for DragHandle component rendering in `app/__tests__/drag-handle.test.tsx`
- [ ] T014 [US1] Create DragHandle component with grip icon in `app/drag-handle.tsx`
- [ ] T015 [P] [US1] Add test for Todo with sortable wrapper in `app/__tests__/todo.test.tsx`
- [ ] T016 [US1] Update Todo component with useSortable hook in `app/todo.tsx`
- [ ] T017 [US1] Add drag handle to Todo component (before checkbox) in `app/todo.tsx`
- [ ] T018 [P] [US1] Add test for TodoList with DndContext in `app/__tests__/todo-list.test.tsx`
- [ ] T019 [US1] Wrap TodoList with DndContext and SortableContext in `app/todo-list.tsx`
- [ ] T020 [US1] Implement onDragEnd handler with position calculation in `app/todo-list.tsx`
- [ ] T021 [US1] Add calculateNewPosition helper function in `app/todo-list.tsx`
- [ ] T022 [US1] Add drag visual feedback styles (opacity, lift effect) in `app/todo.tsx`
- [ ] T022a [US1] Add drop position indicator (line/gap highlight between items) in `app/todo-list.tsx`
- [ ] T023 [US1] Handle drag cancellation (drop outside valid zone) in `app/todo-list.tsx`

**Checkpoint**: User Story 1 complete - dragging works visually (not yet persisted)

---

## Phase 4: User Story 2 - Persist Order Across Sessions (Priority: P1) 🎯 MVP

**Goal**: Reordered todos are saved and restored on page refresh

**Independent Test**: Reorder todos, refresh page, verify order is preserved

### Implementation for User Story 2

- [ ] T024 [US2] Call reorderTodosAction from onDragEnd handler in `app/todo-list.tsx`
- [ ] T025 [P] [US2] Add E2E test: drag reorder persists after refresh in `e2e/drag-reorder.spec.ts`
- [ ] T026 [US2] Verify revalidatePath triggers list refresh in `app/actions.ts`

**Checkpoint**: User Story 2 complete - reordering persists to database

---

## Phase 5: User Story 3 - Immediate Visual Feedback (Priority: P2)

**Goal**: List updates instantly when dropping (before server confirms)

**Independent Test**: Reorder item, observe instant visual update (no loading delay)

### Implementation for User Story 3

- [ ] T027 [P] [US3] Add test for optimistic reorder in `app/__tests__/todo-list.test.tsx`
- [ ] T028 [US3] Extend useOptimistic reducer to handle 'reorder' action in `app/todo-list.tsx`
- [ ] T029 [US3] Update optimistic state immediately on drag end in `app/todo-list.tsx`
- [ ] T030 [P] [US3] Add test for error rollback behavior in `app/__tests__/todo-list.test.tsx`
- [ ] T031 [US3] Handle server action failure with rollback in `app/todo-list.tsx`

**Checkpoint**: User Story 3 complete - optimistic UI with rollback on failure

---

## Phase 6: User Story 4 - Accessibility for Drag and Drop (Priority: P2)

**Goal**: Keyboard users can reorder todos with Alt+Arrow shortcuts

**Independent Test**: Focus a todo, press Alt+ArrowUp or Alt+ArrowDown, verify it moves

### Implementation for User Story 4

- [ ] T032 [P] [US4] Add test for Alt+ArrowUp/Down keyboard reorder in `app/__tests__/todo.test.tsx`
- [ ] T033 [US4] Add onKeyDown handler for Alt+Arrow shortcuts in `app/todo.tsx`
- [ ] T034 [US4] Implement keyboard reorder logic (swap with adjacent item) in `app/todo.tsx`
- [ ] T035 [US4] Maintain focus on moved item after keyboard reorder in `app/todo.tsx`
- [ ] T036 [P] [US4] Add aria-label for drag handle in `app/drag-handle.tsx`
- [ ] T036a [US4] Add aria-live region for position change announcements in `app/todo-list.tsx`
- [ ] T037 [P] [US4] Add E2E test for keyboard reorder in `e2e/drag-reorder.spec.ts`

**Checkpoint**: User Story 4 complete - full accessibility support

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and documentation

- [ ] T038 [P] Run full test suite: `npm run test:unit`
- [ ] T039 [P] Run E2E tests: `npm run test:e2e`
- [ ] T040 [P] Run linter: `npm run lint`
- [ ] T041 Manual test: drag todo, refresh, verify order persists
- [ ] T042 Manual test: Alt+Arrow moves todo
- [ ] T043 [P] Update quickstart.md verification checklist

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) ─────────────────────────────────────────┐
                                                          │
Phase 2 (Foundational) ──────────────────────────────────┼─► BLOCKS ALL USER STORIES
                                                          │
                         ┌────────────────────────────────┘
                         │
                         ▼
          ┌──────────────┴──────────────┐
          │                             │
Phase 3 (US1: Drag)    Phase 4 (US2: Persist)
     P1 MVP                  P1 MVP
          │                       │
          └──────────┬────────────┘
                     │
                     ▼
          ┌──────────┴──────────┐
          │                     │
Phase 5 (US3: Optimistic)   Phase 6 (US4: A11y)
        P2                        P2
          │                       │
          └──────────┬────────────┘
                     │
                     ▼
              Phase 7 (Polish)
```

### User Story Dependencies

| Story            | Depends On                    | Can Parallelize With |
| ---------------- | ----------------------------- | -------------------- |
| US1 (Drag)       | Phase 2 (Foundational)        | US2 after T012       |
| US2 (Persist)    | US1 T012 (reorderTodosAction) | US1 T013-T023        |
| US3 (Optimistic) | US1, US2 complete             | US4                  |
| US4 (A11y)       | US1, US2 complete             | US3                  |

### Within Each User Story

1. Tests marked [P] can run in parallel
2. Implementation follows test (TDD)
3. Complete all tasks before checkpoint

---

## Parallel Execution Examples

### Phase 2 Parallel Opportunities

```bash
# After T006 (mock updated), these can run in parallel:
T007 [P] - Test getTodos ordering
T009 [P] - Test addTodo position
```

### User Story 1 Parallel Opportunities

```bash
# After T012 (reorderTodosAction exists), these can run in parallel:
T013 [P] - Test DragHandle
T015 [P] - Test Todo sortable
T018 [P] - Test TodoList DndContext
```

### User Story 4 Parallel Opportunities

```bash
# All tests can run in parallel:
T032 [P] - Test keyboard reorder
T036 [P] - Test aria-label
T037 [P] - E2E keyboard test
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Setup (10 min)
2. Complete Phase 2: Foundational (45 min)
3. Complete Phase 3: User Story 1 - Drag (1.5 hr)
4. Complete Phase 4: User Story 2 - Persist (30 min)
5. **STOP and VALIDATE**: Drag works, persists on refresh
6. Deploy/demo MVP!

### Full Feature (Add US3 + US4)

7. Complete Phase 5: User Story 3 - Optimistic UI (45 min)
8. Complete Phase 6: User Story 4 - Accessibility (45 min)
9. Complete Phase 7: Polish (30 min)

### Time Estimates

| Phase            | Est. Time | Cumulative |
| ---------------- | --------- | ---------- |
| Setup            | 10 min    | 10 min     |
| Foundational     | 45 min    | 55 min     |
| US1 (Drag)       | 1.5 hr    | 2.5 hr     |
| US2 (Persist)    | 30 min    | 3 hr       |
| US3 (Optimistic) | 45 min    | 3.75 hr    |
| US4 (A11y)       | 45 min    | 4.5 hr     |
| Polish           | 30 min    | 5 hr       |

**MVP (US1 + US2)**: ~3 hours  
**Full Feature**: ~5 hours

---

## Notes

- [P] tasks can run in parallel (different files, no dependencies)
- [US#] label maps task to specific user story
- Tests follow TDD - write test, verify it fails, then implement
- Commit after each task or logical group
- US1 and US2 are both P1 (MVP) - neither is complete without the other
- US3 and US4 are P2 (enhancements) - can be deferred if time-constrained
