import express from "express";
import cors from "cors";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";

const app = express();
const PORT = 8000;

//! Multer Middleware
//? Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + uuidv4() + path.extname(file.originalname));
  },
});

//? Multer configuration for file uploads
const upload = multer({ storage: storage });

//! Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // watch it
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

//! Routes
app.get("/", (req, res) => {
  res.send({ message: "Hello, User!" });
});

app.post("/upload", upload.single("file"), (req, res) => {
  res.send({ message: "File uploaded successfully" });
  res.end(); 
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
