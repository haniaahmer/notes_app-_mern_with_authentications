// controllers/noteController.js
import Note from "../models/Note.js";

// Get notes for logged-in user
export const getNotes = async (req, res) => {
  try {
    console.log("👉 User from token:", req.user); // log user payload
    const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
    console.log("👉 Notes fetched:", notes.length); // log count
    res.json(notes);
  } catch (err) {
    console.error("❌ Error fetching notes:", err.message);
    res.status(500).json({ message: "Error fetching notes" });
  }
};

// Create note for user
export const createNote = async (req, res) => {
  try {
    console.log("👉 Create Note request by:", req.user);
    console.log("👉 Note content:", req.body.content);

    const note = await Note.create({
      content: req.body.content,
      user: req.user.id, // 👈 tie to logged-in user
    });

    console.log("✅ Note created:", note);
    res.status(201).json(note);
  } catch (err) {
    console.error("❌ Error creating note:", err.message);
    res.status(500).json({ message: "Error creating note" });
  }
};

// Update only if note belongs to user
export const updateNote = async (req, res) => {
  try {
    console.log("👉 Update request:", req.params.id, "by user:", req.user.id);
    console.log("👉 New content:", req.body.content);

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id }, // ensure ownership
      { content: req.body.content },
      { new: true }
    );

    if (!note) {
      console.warn("⚠️ Note not found for user:", req.user.id);
      return res.status(404).json({ message: "Note not found" });
    }

    console.log("✅ Note updated:", note);
    res.json(note);
  } catch (err) {
    console.error("❌ Error updating note:", err.message);
    res.status(500).json({ message: "Error updating note" });
  }
};

// Delete only if note belongs to user
export const deleteNote = async (req, res) => {
  try {
    console.log("👉 Delete request:", req.params.id, "by user:", req.user.id);

    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!note) {
      console.warn("⚠️ Note not found for user:", req.user.id);
      return res.status(404).json({ message: "Note not found" });
    }

    console.log("✅ Note deleted:", note._id);
    res.json({ message: "Note deleted" });
  } catch (err) {
    console.error("❌ Error deleting note:", err.message);
    res.status(500).json({ message: "Error deleting note" });
  }
};
