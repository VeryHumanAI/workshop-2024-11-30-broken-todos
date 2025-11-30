# Feature Specification: Drag to Reorder

**Feature Branch**: `001-drag-reorder`  
**Created**: November 30, 2025  
**Status**: Draft  
**Input**: User description: "Drag to reorder - Manual ordering with persistence"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Reorder Todos by Dragging (Priority: P1)

As a user, I want to drag and drop todos to reorder them so that I can prioritize my tasks in the order that makes sense to me.

**Why this priority**: This is the core feature. Without the ability to drag items, no reordering can happen. This delivers the primary value of manual task prioritization.

**Independent Test**: Can be fully tested by dragging a todo item up or down in the list and verifying it moves to the new position. Delivers immediate value by allowing users to see their reordered list.

**Acceptance Scenarios**:

1. **Given** a list with multiple todos, **When** I drag a todo item and drop it in a new position, **Then** the todo appears at the new position and all other items shift accordingly
2. **Given** a list with multiple todos, **When** I start dragging a todo, **Then** I see visual feedback indicating the item is being dragged (e.g., opacity change, lift effect)
3. **Given** a dragged todo item, **When** I hover over other positions, **Then** I see a visual indicator showing where the item will be dropped
4. **Given** I am dragging a todo, **When** I release the drag outside a valid drop zone, **Then** the todo returns to its original position

---

### User Story 2 - Persist Order Across Sessions (Priority: P1)

As a user, I want my custom todo order to be saved so that when I refresh the page or return later, my todos remain in the order I set them.

**Why this priority**: Without persistence, the reordering is useless—users would lose their organization every time they navigate away. This is equally critical as the drag interaction itself.

**Independent Test**: Can be tested by reordering items, refreshing the browser, and verifying the order is preserved. Delivers the core value of persistent organization.

**Acceptance Scenarios**:

1. **Given** I have reordered my todos, **When** I refresh the page, **Then** the todos appear in the same order I set them
2. **Given** I have reordered my todos, **When** I close and reopen the browser, **Then** the todos appear in the same order I set them
3. **Given** multiple reorder operations are performed quickly, **When** I refresh the page, **Then** the final order is correctly preserved

---

### User Story 3 - Immediate Visual Feedback (Priority: P2)

As a user, I want the reordering to feel responsive and instant so that I have confidence my changes are being applied.

**Why this priority**: This enhances user experience but isn't strictly required for core functionality. Users could still reorder without optimistic updates, but it would feel sluggish.

**Independent Test**: Can be tested by reordering items and observing that the list updates immediately without waiting for server response.

**Acceptance Scenarios**:

1. **Given** I drop a todo in a new position, **When** the drop completes, **Then** the list immediately reflects the new order (before server confirmation)
2. **Given** I reorder todos while offline or when the server is slow, **When** the operation eventually fails, **Then** the list reverts to the last known good state

---

### User Story 4 - Accessibility for Drag and Drop (Priority: P2)

As a keyboard user or screen reader user, I want to be able to reorder todos without a mouse so that I can use this feature regardless of my input device.

**Why this priority**: Accessibility is important for inclusive design. While the majority of users will use mouse/touch, keyboard support ensures everyone can use the feature.

**Independent Test**: Can be tested by using only keyboard navigation to reorder a todo item.

**Acceptance Scenarios**:

1. **Given** I focus on a todo item using keyboard navigation, **When** I use designated keyboard shortcuts (e.g., arrow keys with modifier), **Then** I can move the item up or down in the list
2. **Given** I am using a screen reader, **When** I reorder an item, **Then** the screen reader announces the new position

---

### Edge Cases

- What happens when there is only one todo in the list? (Drag should be possible but result in no change)
- What happens if a todo is deleted by another session while dragging? (Handle gracefully, show updated list)
- What happens if network fails during reorder save? (Show error feedback, revert to previous order)
- How does reordering work with completed todos? (Completed todos can also be reordered)
- What happens when a new todo is added? (New todo appears at the bottom, can then be reordered)

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST allow users to drag any todo item in the list
- **FR-002**: System MUST allow users to drop a todo item at any position in the list
- **FR-003**: System MUST visually indicate when a todo is being dragged (drag handle or entire item)
- **FR-004**: System MUST show a drop indicator to preview where the item will be placed
- **FR-005**: System MUST update the list order immediately upon drop (optimistic UI)
- **FR-006**: System MUST persist the new order to the database after each reorder
- **FR-007**: System MUST restore todos in the persisted order when the page loads
- **FR-008**: System MUST handle drag cancellation (dropping outside valid area) by reverting position
- **FR-009**: System MUST support keyboard-based reordering for accessibility
- **FR-010**: System MUST preserve relative order when new todos are added (new todos appear at end)

### Key Entities

- **Todo**: Extended with a `position` or `order` attribute representing its place in the list (integer or sortable key). The position determines the display order when fetching todos.
- **Reorder Operation**: Conceptual operation that updates the position of one or more todos when a drag-drop completes.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can reorder any todo to any position within 2 seconds of interaction (drag, drop, visual update)
- **SC-002**: Reordered list persists correctly 100% of the time after page refresh (no order corruption)
- **SC-003**: 95% of users can successfully reorder todos on first attempt without instructions
- **SC-004**: Keyboard users can reorder todos using only keyboard input (WCAG 2.1 compliance target)
- **SC-005**: Optimistic UI updates appear within 100ms of drop action (perceived instant feedback)
