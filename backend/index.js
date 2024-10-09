import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Server } from "socket.io";
import path from "path";

// Importing custom modules
import { chats } from "./data/data.js";
import connectDB from "./config/db.js";
import userRoute from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoute.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

// Initialize dotenv to load environment variables
dotenv.config();

const FRONTEND_ENV = process.env.FRONTEND_ENV;

// Connect to the database
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(
  cors({
    origin: FRONTEND_ENV.replace(/\/$/, ""), // Ensure no trailing slash
    credentials: true,
  })
);
app.use(express.json());
// Routes
app.use("/api/user", userRoute);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// Deployment
// const __dirname = path.resolve();

// if (process.env.NODE_ENV === "production") {
//   console.log('Production mode');
//   app.use(express.static(path.join(__dirname, "frontend", "dist")));
//   console.log('Serving static files from:', path.join(__dirname, "frontend", "dist"))

//   app.get("*", (req, res) =>
//     res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
//   );
// } else {
//   console.log('Development mode');
//   app.get("/", (req, res) => {
//     res.send("API is running..");
//   });
// }

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Create HTTP server
const server = app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on PORT http://localhost:${process.env.PORT}...`);
});

// Set up Socket.IO
const io = new Server(server, {
  cors: {
    origin: [FRONTEND_ENV],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(`User ${userData._id} connected`);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("sendNotification", (notification) => {
    console.log("Notification:", notification);
    io.emit("receiveNotification", notification);
  });

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED");
    // Additional cleanup can be done here if needed
  });
});
