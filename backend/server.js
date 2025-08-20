import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import notesRoutes from "./routes/notesRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import path from "path";
import authRoutes from "./routes/authRoutes.js";
dotenv.config();

const app = express();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅  MongoDB connected"))
.catch(err => console.error(err));

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploads folder
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// Routes
app.use("/api/notes", notesRoutes);
app.use("/api", uploadRoutes);
app.use("/api/auth", authRoutes);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`✅  Server running on port ${PORT}`));
