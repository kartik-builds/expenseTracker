import express from "express"
import User from "../models/User.js";
import bcrypt from "bcrypt";
const router = express.Router()
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 12)
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        })
        res.status(201).json({
            message: "Registration successful",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });
    }
    catch (err) {
        console.log("Error while registration:", err);

        if (err.name === "ValidationError") {
            return res.status(400).json({
                message: "Invalid entry"
            });
        }

        if (err.code === 11000) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
})
//Login API
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {                        //check whether the user entered both credentials
            return res.status(400).json({
                message: "Email and password are required"
            })
        }
        const normalisedEmail = email.trim().toLowerCase()
        const user = await User.findOne({ email: normalisedEmail })
        if (!user) {            // if user doesnt exist return an error
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }
        const isMatched = await bcrypt.compare(password, user.password)  // compare the passwords if user exists
        if (!isMatched) {
            return res.status(401).json({ message: "Invalid Email and password" })
        }
        // generating a new session after password verification for each user
        req.session.regenerate((err) => {
            if (err) {
                console.error("Session regeneration error:", err);
                return res.status(500).json({
                    message: "Unable to create session"
                });
            }

            req.session.userId = user._id.toString();

            req.session.save((err) => {
                if (err) {
                    console.error("Session save error:", err); 
                    return res.status(500).json({
                        message: "Unable to save session"
                    });
                }

                res.status(200).json({
                    message: "Login successful",
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email
                    }
                });
            });
        });
    }
    catch (err) {
        console.log("Error while login : ", err)
        return res.status(500).json({ message: "Internal server error" })
    }
})
export default router