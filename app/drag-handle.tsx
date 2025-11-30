/**
 * DragHandle Component
 *
 * Provides a grip icon for dragging todos to reorder them.
 * Positioned on the left side of each todo item.
 */

export function DragHandle() {
  return (
    <div
      className="mr-2 cursor-grab text-gray-400 hover:text-gray-600"
      aria-label="Drag to reorder"
    >
      ⋮⋮
    </div>
  );
}
