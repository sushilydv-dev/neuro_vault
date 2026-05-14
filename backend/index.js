import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import sequelize from "./src/config/db.js";
import { authRouter } from "./src/router/authen.router.js";
import { getDashInfo } from "./src/controller/dashinfo.controller.js";
import { normalizeExistingProfilePictures } from "./src/controller/profile.controller.js";
import "./src/models/associations.js";
const app = express();

app.use(cors());
app.use(express.urlencoded());
app.use(express.json());
app.use("/", authRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  "/profilepics",
  express.static(path.join(__dirname, "public/profilepics")),
);

app.use((err, req, res, next) => {
  if (
    err.message &&
    /invalid file type|only jpeg|only pdf|allowed:/i.test(err.message)
  ) {
    return res.status(400).json({ error: err.message });
  }
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "File too large" });
  }
  console.error(err);
  if (!res.headersSent) {
    res.status(500).json({ error: "Server error" });
  }
});

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    await normalizeExistingProfilePictures();

    app.listen(process.env.PORT);
  } catch (err) {
    console.log(err);
  }
};

start();
