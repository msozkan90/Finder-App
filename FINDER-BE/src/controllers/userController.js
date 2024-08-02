const userService = require("../services/userService");
const jwt = require("jwt-simple");
const bcrypt = require("bcryptjs");
const { jwtSecret } = require("../config/config");
const redisClient = require("../config/redisClient");

const register = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.encode({ id: user._id }, jwtSecret);

    res.json({ token, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await userService.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await userService.updateUserProfile(req.user.id, req.body);
    if (redisClient.isReady) {
      await redisClient.set(req.user.id, JSON.stringify(user));
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getNearbyUsers = async (req, res) => {
  try {
    const { coordinates, maxDistance, page, limit } = req.body;
    const { users, totalPages } = await userService.findNearbyUsers(coordinates, maxDistance, page, limit);
    res.json({ users, totalPages });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const searchUsers = async (req, res) => {
  try {
    const users = await userService.searchUsers(req.body.query);
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const likeUser = async (req, res) => {
  try {
    const { likedUserId } = req.body;
    const io = require("../index").io;

    if (!redisClient.isReady) {
      return res.status(500).json({ error: "Redis client is not ready" });
    }

    const receiverSocketId = await redisClient.get(likedUserId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("notification", {
        message: "You have a new like!",
        messageType: "like",
      });
    }

    res.status(200).json({ message: "User liked successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const dislikeUser = async (req, res) => {
  try {
    const { dislikedUserId } = req.body;
    const io = require("../index").io;

    if (!redisClient.isReady) {
      return res.status(500).json({ error: "Redis client is not ready" });
    }

    const receiverSocketId = await redisClient.get(dislikedUserId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("notification", {
        message: "You have a new dislike!",
        messageType: "dislike",

      });
    }

    res.status(200).json({ message: "User disliked successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  getNearbyUsers,
  searchUsers,
  likeUser,
  dislikeUser
};
