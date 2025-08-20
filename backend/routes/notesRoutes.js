import express from "express";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote
} from "../controllers/notesController.js";
import { auth } from "../Middlewares/authMiddlewares.js";
const router = express.Router();

router.get("/get", auth, getNotes);
router.post("/post", auth, createNote);
router.put("/:id", auth, updateNote);
router.delete("/:id", auth, deleteNote);

export default router;
