import express from "express";
import process from "node:process";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import { connect } from "mongoose";
import jwt from "jsonwebtoken";
import Task from "./models/Task.js";
import User from "./models/User.js";
import bcrypt from "bcryptjs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set("port", PORT);

const mongoDB_connect = process.env.MONGODB_CONNECTION;

await connect(mongoDB_connect);

// Add your middleware
app.use(bodyParser.json());
app.use(cors());

//middleware function
const authenticateToken = async (req, res, next) => {
  let token;

  const authorization = req.headers.authorization;

  if (authorization && authorization.startsWith("Bearer")) {
    try {
      // retrieve token
      token = authorization.split(" ")[1];

      // verify token
      const verifyToken = jwt.verify(token, secretKey);

      // Get user from the token
      req.user = await User.findById(verifyToken.id).select("-password");

      next();
    } catch (error) {
      console.log(error);
      res.status(401).json({
        message: "Not Authorized",
      });
    }
  }

  if (!token) {
    res.status(401).json({
      message: "No Token",
    });
  }
};

// --------- TASK ENDPOINTS -----------

// @desc    Get Tasks
// @route   GET /api/tasks
app.get("/api/tasks", authenticateToken, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });

    res.status(200).json({
      data: tasks,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error has occured while retrieving the task",
      message: error.message,
    });
  }
});

// @desc    Create Task
// @route   POST /api/tasks
app.post("/api/tasks", authenticateToken, async (req, res) => {
  try {
    const { title, description } = req.body;

    const task = await Task.create({
      title,
      description,
      user: req.user.id,
    });

    res.status(200).json({
      message: "Task Created Successfully",
      data: task,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error has occured while creating the task",
      error: error.message,
    });
  }
});

// @desc    Update Task
// @route   PUT /api/tasks/:id
app.put("/api/tasks/:id", authenticateToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(400).json({
        message: "Task not found",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (task.user.toString() !== user.id) {
      return res.status(401).json({
        message: "User Not Authorized",
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    return res.status(200).json({
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error has occured while updating the task",
      error: error.message,
    });
  }
});

// @desc    Delete Task
// @route   DELETE /api/tasks/:id
app.delete("/api/tasks/:id", authenticateToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(400).json({
        message: "Task not found",
      });
    }

    const user = await User.findById(req.user.id);

    //check user
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    //check if user id of task match with user.id of who's logged in
    if (task.user.toString() !== user.id) {
      return res.status(401).json({
        message: "User Not Authorized",
      });
    }

    await task.deleteOne({ _id: req.params.id });

    return res.status(200).json({
      message: "Task deleted successfully",
      id: req.params.id,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error has occured while deleting the task",
      error: error.message,
    });
  }
});

// --------- USER ENDPOINTS -----------

// Generate Token
const secretKey = "sample123";

const generateToken = (id) => {
  return jwt.sign({ id }, secretKey, {
    expiresIn: "30d",
  });
};

// @desc    Create New User
// @route   POST /api/users
app.post("/api/users", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        message: "Please add all fields",
      });
    }

    // validate user
    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
      res.status(400).json({
        message: "Email already exists",
      });
    }

    // Hash password
    const hashPassword = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, hashPassword);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        message: "User successfully created",
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({
        message: "Invalid user data",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// @desc    Authenticate User
// @route   POST /api/users/login
app.post("/api/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    //Check for user's email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Email do not exist",
      });
    }

    //validate user and compare if hashed password and text password matched
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Password is incorrect",
      });
    }

    res.json({
      message: `Hello ${user.name}`,
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.log(error);
  }
});

// Protect route
// @desc    Get users data
// @route   GET /api/users/me
app.get("/api/users/me", authenticateToken, async (req, res) => {
  try {
    const { _id, name, email } = await User.findById(req.user.id);

    res.status(200).json({
      id: _id,
      name,
      email,
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => {
  console.log(`App is listening to port ${PORT}`);
});
