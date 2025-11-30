/**
 * DragHandle Component
 *
 * Provides a grip icon for dragging todos to reorder them.
 * Positioned on the left side of each todo item.
 */

import { DraggableSyntheticListeners } from "@dnd-kit/core";

interface DragHandleProps {
  listeners?: DraggableSyntheticListeners;
}

export function DragHandle({ listeners }: DragHandleProps) {
  return (
    <button
      type="button"
      className="mr-2 cursor-grab touch-none text-gray-400 hover:text-gray-600 active:cursor-grabbing"
      aria-label="Drag to reorder"
      {...listeners}
    >
      ⋮⋮
    </button>
  );
}
