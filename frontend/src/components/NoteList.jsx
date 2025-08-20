// src/NoteList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function NoteList() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/notes")
      .then((res) => setNotes(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ width: "60%", margin: "auto", marginTop: "20px" }}>
      <h2>Saved Notes</h2>
      {notes.map((note) => (
        <div
          key={note._id}
          style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}
        >
          <h3>{note.title}</h3>
          {/* React dangerouslySetInnerHTML to display HTML */}
          <div dangerouslySetInnerHTML={{ __html: note.content }} />
        </div>
      ))}
    </div>
  );
}
