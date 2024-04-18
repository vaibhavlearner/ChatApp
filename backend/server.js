import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import userRoutes from "./routes/user.route.js";

import connectoMongoDB from "./db/connectToMongoDB.js";

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();

app.use(express.json()); //to parse the incoming requests with JSON payloads
app.use(cookieParser());
app.use("/api/auth", authRoutes);

app.use("/api/messages", messageRoutes);

app.use("/api/users", userRoutes);
// app.get("/", (req, res) => {
//     //root
//     res.send("Hello World");
// });

app.listen(PORT, () => {
    connectoMongoDB();
    console.log(`Server running on port ${PORT}`);
});
