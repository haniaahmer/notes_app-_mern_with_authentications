import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

export default function NotesEditor() {
  const [content, setContent] = useState("");
  let quillRef = null;

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await axios.post("http://localhost:5000/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data.url;
  };

  const imageHandler = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();
    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        const url = await uploadImage(file);
        const editor = quillRef.getEditor();
        const range = editor.getSelection();
        editor.insertEmbed(range.index, "image", url);
      }
    };
  };

  const saveNote = async () => {
    await axios.post("http://localhost:5000/notes", { content });
    alert("Note saved!");
  };

  return (
    <div>
      <ReactQuill
        ref={(el) => (quillRef = el)}
        value={content}
        onChange={setContent}
        modules={{
          toolbar: {
            container: [
              ["bold", "italic", "underline", "strike"],
              [{ header: [1, 2, 3, false] }],
              ["image", "link"]
            ],
            handlers: { image: imageHandler }
          }
        }}
        theme="snow"
      />
      <button onClick={saveNote}>Save</button>
    </div>
  );
}
