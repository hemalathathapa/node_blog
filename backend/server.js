const express = require("express");
const multer = require("multer");
const path = require("path");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const port = 5000;

// Database Connection
const db = mysql.createPool({
  host: "localhost",
  user: "Himani_Thapa",
  password: "Himani@2937",
  database: "blog",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}).promise();

// Ensure 'uploads' directory exists
const fs = require("fs");
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Create an 'uploads' folder in your project
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Add original extension
  },
});

const upload = multer({ storage: storage });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3000" }));

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Add Blog API
app.post("/blogs", upload.single("image"), (req, res) => {
  const { title, content } = req.body;
  const image = req.file ? req.file.filename : null;

  console.log("Received Data:", { title, content, image }); // ✅ Log received data

  if (!title || !content) {
    console.error("Validation failed: Title and Content are required!");
    return res.status(400).json({ error: "Title and content are required" });
  }

  const sql = "INSERT INTO blogs (title, content, image) VALUES (?, ?, ?)";
  db.query(sql, [title, content, image], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error", details: err.message });
    }
    console.log("Database Insert Result:", result);
    res.status(201).json({ message: "Blog added successfully!" });
  });
});


// Fetch Blogs API
app.get("/blogs", async (req, res) => {
  try {
    const [results] = await db.query("SELECT title, content, image FROM blogs");
    res.json(results);
  } catch (err) {
    console.error("Database Fetch Error:", err);
    res.status(500).json({ message: "Database error" });
  }
});
app.delete("/blogs/:id", async (req, res) => {
  const blogId = req.params.id;

  try {
    // Get the blog's image filename
    const [rows] = await db.query("SELECT image FROM blogs WHERE id = ?", [blogId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const imageFile = rows[0].image;

    // Delete blog from the database
    await db.query("DELETE FROM blogs WHERE id = ?", [blogId]);

    // Remove the image from uploads folder if it exists
    if (imageFile) {
      const imagePath = path.join(__dirname, "uploads", imageFile);
      fs.unlink(imagePath, (err) => {
        if (err && err.code !== "ENOENT") {
          console.error("Error deleting image file:", err);
        }
      });
    }

    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error("Database Delete Error:", err);
    res.status(500).json({ message: "Database error" });
  }
});


// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
