import React, { useState } from "react";
import ConfirmModal from "./ConfirmModal";
import ModalWrapper from "./ModalWrapper";
import { EyeIcon } from "@heroicons/react/24/outline";

export default function NoteCard({ note, onEdit, onDelete }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showReadModal, setShowReadModal] = useState(false);

  const confirmDelete = () => {
    onDelete(note._id);
    setShowConfirm(false);
  };

  return (
    <>
      <div className="bg-white shadow-lg rounded-xl p-5 border border-pink-100 hover:shadow-xl transition-shadow duration-200 flex flex-col h-full relative">
        {/* Eye icon for reading */}
        <button
          onClick={() => setShowReadModal(true)}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <EyeIcon className="w-5 h-5" />
        </button>

        {/* Preview content */}
        <div className="flex-grow mb-4">
          <div
            className="prose prose-sm max-w-none overflow-hidden"
            style={{
              wordBreak: "break-word",
              overflowWrap: "break-word",
              lineHeight: "1.6",
              maxHeight: "5rem",
              overflow: "hidden",
            }}
            dangerouslySetInnerHTML={{ __html: note.content }}
          />
        </div>

        {/* Date */}
        {note.createdAt && (
          <div className="text-xs text-gray-400 mb-3">
            {new Date(note.createdAt).toLocaleDateString()}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-auto pt-3 border-t border-gray-100">
          <button
            onClick={() => onEdit(note)}
            className="bg-sky-400 hover:bg-sky-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            className="bg-rose-400 hover:bg-rose-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={showConfirm}
        title="Delete Note"
        message="Are you sure you want to delete this note?"
        confirmText="Yes, Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirm(false)}
      />

      {/* Full Read Modal */}
      <ModalWrapper isOpen={showReadModal} onClose={() => setShowReadModal(false)}>
        <h2 className="text-xl font-semibold mb-3">Note Details</h2>
        <div
          className="overflow-auto max-h-[70vh] text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: note.content }}
        />
      </ModalWrapper>
    </>
  );
}
