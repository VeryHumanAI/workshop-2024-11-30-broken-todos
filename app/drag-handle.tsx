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
    <div
      className="mr-2 cursor-grab touch-none text-gray-400 select-none hover:text-gray-600 active:cursor-grabbing"
      aria-label="Drag to reorder"
      role="button"
      tabIndex={0}
      {...listeners}
    >
      ⋮⋮
    </div>
  );
}
