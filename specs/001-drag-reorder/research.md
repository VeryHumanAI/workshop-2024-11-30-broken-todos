# Research: Drag to Reorder

**Feature**: 001-drag-reorder  
**Date**: 2025-11-30  
**Status**: Complete

## Research Tasks

### 1. Drag-and-Drop Library Selection

**Context**: Need a React drag-and-drop library that works with React 19 and Next.js 15 App Router (Server Components + Client Components).

**Decision**: @dnd-kit/core + @dnd-kit/sortable

**Rationale**:

- **React 19 compatible**: @dnd-kit is hooks-based and works with latest React
- **Lightweight**: ~15KB minified (vs react-beautiful-dnd ~30KB)
- **Accessible**: Built-in keyboard support and screen reader announcements
- **Flexible**: Works with any styling solution (Tailwind CSS)
- **Active maintenance**: Regular updates, TypeScript-first
- **No deprecated APIs**: Unlike react-beautiful-dnd which uses deprecated React lifecycle methods

**Alternatives Considered**:
| Library | Pros | Cons | Verdict |
|---------|------|------|---------|
| react-beautiful-dnd | Great UX, well-documented | Deprecated, React 18+ issues, no active maintenance | ❌ Rejected |
| @dnd-kit | Modern, accessible, lightweight | Learning curve | ✅ Selected |
| HTML5 Drag API | No dependencies | Poor mobile support, no keyboard | ❌ Rejected |
| react-dnd | Flexible | Complex setup, larger bundle | ❌ Rejected |

### 2. Position Storage Strategy

**Context**: Need to persist todo order in SQLite database with efficient reordering.

**Decision**: Integer `position` column with gap-based numbering (multiples of 1000)

**Rationale**:

- **Simple**: Single integer column, easy to understand and debug
- **Efficient**: Reordering only updates the moved item's position (in most cases)
- **Gap strategy**: Initial positions 1000, 2000, 3000... allows insertions without renumbering
- **SQLite-friendly**: Integer comparisons are fast
- **Renumber on exhaustion**: If gaps fill up, batch renumber all items (rare operation)

**Alternatives Considered**:
| Strategy | Pros | Cons | Verdict |
|----------|------|------|---------|
| Integer with gaps | Simple, efficient | Occasional renumbering | ✅ Selected |
| Fractional ranking (0.5) | Never renumber | Float precision issues, harder to debug | ❌ Rejected |
| Linked list (prevId) | No position column | Complex queries, O(n) to get order | ❌ Rejected |
| Array index | Simplest | Renumber all items on every reorder | ❌ Rejected |

### 3. Optimistic UI Pattern for Reordering

**Context**: Need instant visual feedback when dragging, with server sync and rollback on failure.

**Decision**: Use React 19's `useOptimistic` hook with reorder action

**Rationale**:

- **Already in use**: TodoList component uses `useOptimistic` for add/remove/toggle
- **Native React**: No additional dependencies
- **Automatic rollback**: If server action fails, state reverts automatically
- **Consistent pattern**: Matches existing codebase patterns (Constitution: Clarity Over Cleverness)

**Implementation Approach**:

1. On drag end, immediately update optimistic state with new order
2. Call `reorderTodosAction` server action in background
3. If action fails, `useOptimistic` automatically rolls back
4. `revalidatePath("/")` syncs server state on success

### 4. Keyboard Accessibility Implementation

**Context**: Need Alt+Arrow Up/Down keyboard shortcuts for reordering (per spec clarification).

**Decision**: Custom keyboard handler integrated with @dnd-kit's accessibility features

**Rationale**:

- @dnd-kit provides `KeyboardSensor` with customizable key bindings
- Can intercept Alt+Arrow at the todo item level
- Triggers the same reorder action as drag-drop for consistency
- Screen reader announcements built into @dnd-kit's `DndContext`

**Implementation Approach**:

1. Add `onKeyDown` handler to todo item container
2. Detect Alt+ArrowUp and Alt+ArrowDown
3. Calculate new position (swap with adjacent item)
4. Trigger same `reorderTodosAction` as drag-drop

### 5. Drag Handle UX

**Context**: Per clarification, use a dedicated grip icon on the left side of each todo.

**Decision**: 6-dot grip icon (⋮⋮) as a separate draggable handle element

**Rationale**:

- **Standard pattern**: Used by Trello, Notion, Linear, Todoist
- **Clear affordance**: Users recognize grip icons as "draggable"
- **Non-conflicting**: Won't interfere with future "click to edit" feature
- **Accessible**: Can be focused and used with keyboard

**Visual Design**:

- Position: Left side, before checkbox
- Icon: SVG 6-dot grid (2 columns × 3 rows)
- Hover state: Slightly darker, cursor changes to `grab`
- Dragging state: Cursor `grabbing`, item lifts with shadow

## Dependencies to Add

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

## Database Migration Required

```sql
-- Add position column with default based on id for existing rows
ALTER TABLE todos ADD COLUMN position INTEGER;
UPDATE todos SET position = id * 1000;
```

## Key Files to Modify

| File                  | Change                                                                                             |
| --------------------- | -------------------------------------------------------------------------------------------------- |
| `db/schema.ts`        | Add `position` column to `todosTable`                                                              |
| `app/actions.ts`      | Add `reorderTodosAction`, update `addTodo` to set position, update `getTodos` to order by position |
| `app/todo-list.tsx`   | Wrap in DndContext, add sortable functionality, extend optimistic state                            |
| `app/todo.tsx`        | Add drag handle, make item sortable                                                                |
| `app/drag-handle.tsx` | New component for grip icon                                                                        |

## References

- @dnd-kit documentation: https://dndkit.com/
- @dnd-kit sortable preset: https://docs.dndkit.com/presets/sortable
- React 19 useOptimistic: https://react.dev/reference/react/useOptimistic
