// src/NoteTaking.jsx
import React, { useState } from "react";
import ReactQuill from "react-quill"; // WYSIWYG editor
import "react-quill/dist/quill.snow.css";
import axios from "axios";

export default function NoteTaking() {
  const [content, setContent] = useState(""); // note text/html
  const [title, setTitle] = useState(""); // note title

  const saveNote = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/notes", {
        title,
        content,
      });
      alert("Note saved successfully!");
      setTitle("");
      setContent("");
    } catch (err) {
      console.error(err);
      alert("Error saving note");
    }
  };

  return (
    <div style={{ width: "60%", margin: "auto" }}>
      <h2>Add a Note</h2>
      <input
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        placeholder="Note Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
        placeholder="Write your note here..."
      />

      <button
        onClick={saveNote}
        style={{ marginTop: "10px", padding: "10px", background: "green", color: "white" }}
      >
        Save Note
      </button>
    </div>
  );
}
