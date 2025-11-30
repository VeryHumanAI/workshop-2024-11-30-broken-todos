# API Contract: Server Actions

**Feature**: 001-drag-reorder  
**Date**: 2025-11-30

## New Server Action

### reorderTodosAction

Persists a new todo order after drag-drop or keyboard reorder.

**Signature**:
```typescript
async function reorderTodosAction(
  todoId: number, 
  newPosition: number
): Promise<void>
```

**Parameters**:
| Name | Type | Description |
|------|------|-------------|
| todoId | number | ID of the todo being moved |
| newPosition | number | New position value for the todo |

**Behavior**:
1. Update the todo's `position` to `newPosition`
2. Call `revalidatePath("/")` to refresh the page data
3. Throw on database error (caught by error boundary)

**Example Usage**:
```typescript
// Move todo #5 to position 2500 (between 2000 and 3000)
await reorderTodosAction(5, 2500);
```

## Modified Server Actions

### addTodo

**Change**: Auto-assign position to new todos.

**Before**:
```typescript
await db.insert(todosTable).values({ description });
```

**After**:
```typescript
const [maxPosition] = await db
  .select({ max: sql`MAX(position)` })
  .from(todosTable);
const newPosition = (maxPosition?.max ?? 0) + 1000;

await db.insert(todosTable).values({ 
  description, 
  position: newPosition 
});
```

### getTodos

**Change**: Return todos ordered by position.

**Before**:
```typescript
return await db.select().from(todosTable);
```

**After**:
```typescript
return await db
  .select()
  .from(todosTable)
  .orderBy(asc(todosTable.position), asc(todosTable.id));
```

**Note**: Secondary sort by `id` ensures deterministic order if positions are equal.

## Client-Side Position Calculation

Position calculation happens client-side before calling `reorderTodosAction`.

```typescript
function calculateNewPosition(
  todos: Todo[],
  fromIndex: number,
  toIndex: number
): number {
  // Moving down in list
  if (toIndex > fromIndex) {
    const before = todos[toIndex];
    const after = todos[toIndex + 1];
    if (!after) {
      // Moving to end
      return before.position + 1000;
    }
    return Math.floor((before.position + after.position) / 2);
  }
  
  // Moving up in list
  const after = todos[toIndex];
  const before = todos[toIndex - 1];
  if (!before) {
    // Moving to start
    return Math.floor(after.position / 2);
  }
  return Math.floor((before.position + after.position) / 2);
}
```

## Error Handling

All server actions follow the constitution's error handling principle:

```typescript
export async function reorderTodosAction(todoId: number, newPosition: number) {
  try {
    await db
      .update(todosTable)
      .set({ position: newPosition })
      .where(eq(todosTable.id, todoId));
    
    revalidatePath("/");
  } catch (error) {
    // Log error for debugging
    console.error("Failed to reorder todo:", error);
    // Re-throw to trigger error boundary / optimistic rollback
    throw error;
  }
}
```
