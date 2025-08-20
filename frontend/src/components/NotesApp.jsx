import React, { useState, useEffect, useRef } from "react";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill/dist/quill.snow.css";
import { getNotes, saveNote, updateNote, deleteNote, uploadImage } from "../api";
import NoteCard from "./NoteCard";

// Font whitelist
const Font = Quill.import("formats/font");
Font.whitelist = ["sans", "serif", "monospace", "arial", "times-new-roman", "courier"];
Quill.register(Font, true);

// Size whitelist
const Size = Quill.import("attributors/style/size");
Size.whitelist = ["10px", "12px", "16px", "18px", "24px", "32px"];
Quill.register(Size, true);

export default function NotesApp() {
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const quillRef = useRef(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await getNotes();
      setNotes(res.data);
    } catch {
      setError("Failed to load notes.");
    }
  };

  const handleSaveNote = async () => {
    if (!content.trim()) return alert("Note is empty!");
    try {
      if (editingId) {
        const res = await updateNote(editingId, content);
        setNotes(notes.map(n => n._id === editingId ? res.data : n));
        setEditingId(null);
      } else {
        const res = await saveNote(content);
        setNotes([res.data, ...notes]);
      }
      setContent("");
    } catch {
      setError("Failed to save note.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNote(id);
      setNotes(notes.filter(n => n._id !== id));
    } catch {
      setError("Failed to delete note.");
    }
  };

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await uploadImage(formData);
        const imageUrl = res.data.url;
        const editor = quillRef.current.getEditor();
        const range = editor.getSelection(true);
        editor.insertEmbed(range.index, "image", imageUrl);
        editor.setSelection(range.index + 1);
      } catch {
        setError("Image upload failed.");
      }
    };
  };

  const modules = {
    toolbar: {
      container: [
        [{ font: Font.whitelist }],
        [{ size: Size.whitelist }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["clean"],
      ],
      handlers: { image: handleImageUpload },
    },
  };

  const formats = [
    "font", "size", "bold", "italic", "underline", "strike",
    "list", "bullet", "link", "image"
  ];

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl mb-4">💖 My Sweet Notes</h1>
        {error && <p className="text-red-600">{error}</p>}
        
        <ReactQuill
          ref={quillRef}
          value={content}
          onChange={setContent}
          modules={modules}
          formats={formats}
        />

        <div className="flex gap-2 mt-2">
          <button
            onClick={handleSaveNote}
            className="bg-pink-500 text-white px-4 py-2 rounded"
          >
            {editingId ? "Update" : "Save"}
          </button>
          {editingId && (
            <button
              onClick={() => { setContent(""); setEditingId(null); }}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {notes.map(note => (
            <NoteCard
              key={note._id}
              note={note}
              onEdit={(n) => { setContent(n.content); setEditingId(n._id); }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
