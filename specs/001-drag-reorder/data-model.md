# Data Model: Drag to Reorder

**Feature**: 001-drag-reorder  
**Date**: 2025-11-30

## Entity Changes

### Todo (Extended)

The existing `todos` table is extended with a `position` column.

| Field        | Type              | Constraints                | Description                           |
| ------------ | ----------------- | -------------------------- | ------------------------------------- |
| id           | INTEGER           | PRIMARY KEY, AUTOINCREMENT | Unique identifier                     |
| description  | TEXT              | NOT NULL                   | Todo item text                        |
| completed    | INTEGER (boolean) | NOT NULL, DEFAULT false    | Completion status                     |
| **position** | INTEGER           | NOT NULL, DEFAULT 0        | **NEW**: Sort order (lower = earlier) |

### Position Strategy

- **Initial values**: New todos get `position = MAX(position) + 1000`
- **Gap-based**: Allows ~999 insertions between any two items
- **Reordering**: Moving item A between B and C sets `position = (B.position + C.position) / 2`
- **Edge cases**:
  - Move to start: `position = first_item.position - 1000`
  - Move to end: `position = last_item.position + 1000`
- **Renumbering**: If gap becomes < 1, batch renumber all items (rare)

### Drizzle Schema

```typescript
// db/schema.ts
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const todosTable = sqliteTable("todos", {
  id: integer().primaryKey({ autoIncrement: true }),
  description: text().notNull(),
  completed: integer({ mode: "boolean" }).notNull().default(false),
  position: integer().notNull().default(0), // NEW
});
```

## Migration

```sql
-- migrations/0001_add_position.sql
ALTER TABLE todos ADD COLUMN position INTEGER NOT NULL DEFAULT 0;

-- Set initial positions based on id for existing rows
-- This preserves current order (by id) as explicit positions
UPDATE todos SET position = id * 1000;
```

## Query Changes

### getTodos

```typescript
// Before
return await db.select().from(todosTable);

// After
return await db.select().from(todosTable).orderBy(asc(todosTable.position));
```

### addTodo

```typescript
// Before
await db.insert(todosTable).values({ description });

// After
const [maxPosition] = await db.select({ max: sql`MAX(position)` }).from(todosTable);
const newPosition = (maxPosition?.max ?? 0) + 1000;

await db.insert(todosTable).values({
  description,
  position: newPosition,
});
```

## Type Definitions

```typescript
// Inferred from Drizzle schema
type Todo = {
  id: number;
  description: string;
  completed: boolean;
  position: number; // NEW
};
```

## Validation Rules

- `position` MUST be a non-negative integer
- `position` values SHOULD be unique (enforced by application, not DB constraint)
- Duplicate positions are handled by secondary sort on `id` (deterministic fallback)
