import bcrypt from "bcryptjs";

import User from "../models/user.model.js";

import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender } =
            req.body; //input from the user

        if (password != confirmPassword) {
            //check if passwords doesn't match
            return res.status(400);
        }
        const user = await User.findOne({ username }); //if there is other user with same username
        if (user) {
            return res.status(400).json({ error: "Username Already exists" });
        }

        //Hash password here
        //salt
        const salt = await bcrypt.genSalt(10);

        //hasedpassword
        const hashedPassword = await bcrypt.hash(password, salt);

        //unique profile pic for each user by using API
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        //creating user
        const newUser = new User({
            fullName,
            username,
            password: hashedPassword,
            gender,
            profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
        });

        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res);

            await newUser.save(); //saving to database

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic,
            });
        } else {
            res.status(400).json({ error: "Invalid user data" });
        }
    } catch (error) {
        console.log("Sign up error: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user?.password || ""
        );

        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.log("Login error: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch {
        console.log("Logout error: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
