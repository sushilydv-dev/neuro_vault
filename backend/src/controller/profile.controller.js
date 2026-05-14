import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import Users from "../models/user.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRESET_DIR = path.join(__dirname, "../../public/profilepics");
const AVATAR_UPLOAD_PREFIX = "/uploads/avatars/";
const FRONTEND_PRESET_REGEX = /^\/profilepics\/pp([1-9])\.(jpg|jpeg|png|webp|gif)$/i;

function verifyUserId(token) {
  const data = jwt.verify(token, process.env.JWT_SECRET);
  return data.id;
}

async function deleteOldCustomAvatarIfAny(user) {
  const url = user.profilePicUrl;
  if (!url || !user.isCustom || !url.startsWith(AVATAR_UPLOAD_PREFIX)) return;
  const filename = path.basename(url);
  if (!filename || filename.includes("..")) return;
  const abs = path.join(__dirname, "../../uploads/avatars", filename);
  try {
    if (fs.existsSync(abs)) fs.unlinkSync(abs);
  } catch (e) {
    console.warn("Could not remove old avatar file:", e.message);
  }
}

export const listPresetProfilePics = async (req, res) => {
  try {
    if (!fs.existsSync(PRESET_DIR)) {
      return res.json({ images: [] });
    }
    const files = fs.readdirSync(PRESET_DIR);
    const images = files
      .filter((f) => /\.(jpe?g|png|gif|webp)$/i.test(f))
      .map((f) => ({
        filename: f,
        url: `/profilepics/${encodeURIComponent(f)}`,
      }));
    res.json({ images });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to list preset avatars" });
  }
};

export const setPresetProfilePic = async (req, res) => {
  try {
    const { token, filename, profilePicUrl } = req.body;
    if (!token) {
      return res.status(400).json({ message: "token required" });
    }

    let finalUrl = profilePicUrl;

    // Backward compatibility for old payloads that sent "filename".
    if (!finalUrl && filename) {
      const safe = path.basename(filename);
      if (safe !== filename || !/^[a-zA-Z0-9._-]+$/.test(safe)) {
        return res.status(400).json({ message: "Invalid filename" });
      }
      finalUrl = `/profilepics/${encodeURIComponent(safe)}`;
    }

    if (!finalUrl || !FRONTEND_PRESET_REGEX.test(finalUrl)) {
      return res.status(400).json({ message: "Invalid preset profile pic" });
    }

    const userId = verifyUserId(token);
    const user = await Users.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    await deleteOldCustomAvatarIfAny(user);

    await user.update({ profilePicUrl: finalUrl, isCustom: false });

    res.json({
      message: "Profile picture updated",
      profilePicUrl: finalUrl,
      isCustom: false,
    });
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    console.error(err);
    res.status(500).json({ message: "Failed to update profile picture" });
  }
};

function normalizeProfilePicUrl(url) {
  if (!url) return null;
  const raw = String(url).trim().replace(/^"+|"+$/g, "");
  if (FRONTEND_PRESET_REGEX.test(raw)) return raw;
  if (
    raw.toLowerCase() === "default-avatar.png" ||
    raw.toLowerCase() === "/default-avatar.png" ||
    raw.toLowerCase() === "null"
  ) {
    return null;
  }

  const preset = raw.match(/\/profilepics\/preset-(\d+)\.jpg$/i);
  if (preset) {
    const n = Number(preset[1]);
    const mapped = ((n - 1) % 9) + 1;
    return `/profilepics/pp${mapped}.jpg`;
  }

  return raw;
}

export const normalizeExistingProfilePictures = async () => {
  const users = await Users.findAll({
    attributes: ["id", "profilePicUrl", "isCustom"],
  });
  for (const user of users) {
    const next = normalizeProfilePicUrl(user.profilePicUrl);
    const updates = {};

    if (next !== user.profilePicUrl) {
      updates.profilePicUrl = next;
    }
    
    if (next && next.startsWith("/profilepics/") && user.isCustom) {
      updates.isCustom = false;
    }
    if (
      Object.prototype.hasOwnProperty.call(updates, "profilePicUrl") ||
      Object.prototype.hasOwnProperty.call(updates, "isCustom")
    ) {
     
      await user.update(updates);
    }
  }
};

export const uploadCustomProfilePic = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "No token" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const userId = verifyUserId(token);
    const user = await Users.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    await deleteOldCustomAvatarIfAny(user);

    const profilePicUrl = `${AVATAR_UPLOAD_PREFIX}${req.file.filename}`;
    await user.update({ profilePicUrl, isCustom: true });

    res.json({
      message: "Profile picture updated",
      profilePicUrl,
      isCustom: true,
    });
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    console.error(err);
    res.status(500).json({ message: "Failed to upload profile picture" });
  }
};
