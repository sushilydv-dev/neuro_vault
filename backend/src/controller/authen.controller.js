import Users from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signUp = async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = await Users.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    });
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "3h",
      },
    );
    res.json({ token });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const logIn = async (req, res) => {
  try {
    const user = await Users.findOne({
      where: { email: req.body.email },
    });
    if (!user) {
      throw new Error("User doesnt exist");
    }
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      throw new Error("wrong passwordword");
    }
    const token = jwt.sign(
      {
       
        id: user.id,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "3h" },
    );
    res.json({ token: token });
  } catch (error) {
    console.error("logIn error:", error.message);
    res.status(400).json({ msg: error.message });
  }
};

export const verify = async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) {
      throw new Error("No token");
    }
    const token = auth.split(" ")[1];
    const data = jwt.verify(token, process.env.JWT_SECRET);
    if (!data) {
      throw new Error("Token mismatched");
    }
    res.json({ msg: "ok" });
  } catch (error) {
    res.status(401).json({ msg: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token" });
    }
    const token = auth.split(" ")[1];
    const data = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Users.findByPk(data.id, {
      attributes: [
        "id",
        "name",
        "email",
        "createdAt",
        "profilePicUrl",
        "isCustom",
      ],
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(401).json({ message: error.message || "Unauthorized" });
  }
};
