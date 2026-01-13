import React from 'react';
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TbGripVertical } from "react-icons/tb";

export default function SortableCategoryButton({ layout, handleLayoutClick, className }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: layout.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="itm-cat-btn-wrapper">
      <button type="button" className={className} onClick={() => handleLayoutClick(layout)}>
        <span>{layout.name ? layout.name.toUpperCase() : "UNNAMED"}</span>
      </button>
      <span className="drag-handle" {...attributes} {...listeners}>
        <TbGripVertical size={18} />
      </span>
    </div>
  );
}