# Quickstart: Drag to Reorder Implementation

**Feature**: 001-drag-reorder  
**Date**: 2025-11-30

## Prerequisites

- Existing todo app with `todosTable` schema
- Jest + RTL test setup working
- Playwright E2E tests configured

## Implementation Order

Follow TDD approach: write failing tests first, then implement.

### Phase 1: Database Schema (30 min)

1. **Test**: Verify migration applies cleanly
2. **Implement**:
   - Add `position` column to `db/schema.ts`
   - Generate migration: `npm run db:generate`
   - Run migration: `npm run db:migrate`
3. **Verify**: `npm run db:studio` shows new column

### Phase 2: Server Actions (45 min)

1. **Test**: `app/__tests__/actions.test.ts`
   - `reorderTodosAction` updates position correctly
   - `addTodo` assigns position to new todos
   - `getTodos` returns todos ordered by position
2. **Implement**:
   - Add `reorderTodosAction` to `app/actions.ts`
   - Modify `addTodo` to set position
   - Modify `getTodos` to order by position
3. **Verify**: `npm run test:unit`

### Phase 3: Install @dnd-kit (10 min)

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

### Phase 4: Drag Handle Component (30 min)

1. **Test**: `app/__tests__/drag-handle.test.tsx`
   - Renders grip icon
   - Has correct aria attributes
   - Shows grab cursor on hover
2. **Implement**: Create `app/drag-handle.tsx`
3. **Verify**: `npm run test:unit`

### Phase 5: Todo Component Update (30 min)

1. **Test**: `app/__tests__/todo.test.tsx`
   - Drag handle appears on left
   - Item is wrapped with sortable
   - Keyboard focus works on handle
2. **Implement**: Update `app/todo.tsx`
   - Import `useSortable` from @dnd-kit
   - Add drag handle before checkbox
   - Apply sortable attributes
3. **Verify**: `npm run test:unit`

### Phase 6: TodoList Drag Context (45 min)

1. **Test**: `app/__tests__/todo-list.test.tsx`
   - DndContext wraps the list
   - Dragging item shows visual feedback
   - Drop triggers reorder action
   - Optimistic UI updates immediately
2. **Implement**: Update `app/todo-list.tsx`
   - Wrap with `DndContext` and `SortableContext`
   - Add `onDragEnd` handler
   - Extend `useOptimistic` for reorder action
   - Calculate new position and call server action
3. **Verify**: `npm run test:unit`

### Phase 7: Keyboard Accessibility (30 min)

1. **Test**: `app/__tests__/todo.test.tsx`
   - Alt+ArrowUp moves item up
   - Alt+ArrowDown moves item down
   - Focus remains on moved item
2. **Implement**: Add `onKeyDown` handler in todo component
3. **Verify**: `npm run test:unit`

### Phase 8: E2E Tests (30 min)

1. **Test**: `e2e/drag-reorder.spec.ts`
   - Drag todo to new position
   - Refresh page, order persists
   - Keyboard reorder works
2. **Verify**: `npm run test:e2e`

## Key Code Snippets

### DndContext Setup (todo-list.tsx)

```tsx
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

function TodoList({ initialTodos }) {
  const [optimisticTodos, setOptimisticTodos] = useOptimistic(...);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // Calculate new position and update optimistically
    const oldIndex = optimisticTodos.findIndex(t => t.id === active.id);
    const newIndex = optimisticTodos.findIndex(t => t.id === over.id);
    const newPosition = calculateNewPosition(optimisticTodos, oldIndex, newIndex);

    // Optimistic update
    setOptimisticTodos({ action: 'reorder', todoId: active.id, newIndex });

    // Persist to database
    await reorderTodosAction(active.id as number, newPosition);
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={optimisticTodos} strategy={verticalListSortingStrategy}>
        <ul>
          {optimisticTodos.map(todo => <Todo key={todo.id} item={todo} />)}
        </ul>
      </SortableContext>
    </DndContext>
  );
}
```

### Sortable Todo (todo.tsx)

```tsx
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function Todo({ item }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <li ref={setNodeRef} style={style} {...attributes}>
      <DragHandle {...listeners} />
      {/* rest of todo content */}
    </li>
  );
}
```

## Verification Checklist

- [ ] `npm run test:unit` passes
- [ ] `npm run test:e2e` passes
- [ ] `npm run lint` passes
- [ ] Manual test: drag todo, refresh, order persists
- [ ] Manual test: Alt+Arrow moves todo
- [ ] Manual test: screen reader announces position changes

## Common Pitfalls

1. **Forgetting `"use client"`**: DndContext requires client-side JavaScript
2. **Missing position in mock**: Update `db/__mocks__/index.ts` for tests
3. **Position collision**: Use gap-based numbering (×1000)
4. **Keyboard focus lost**: Restore focus to moved item after reorder
