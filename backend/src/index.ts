import express, { Request, Response } from 'express';
import bodyParser from "body-parser";
import jwt from 'jsonwebtoken'; // Import jsonwebtoken
import bcrypt from 'bcryptjs'; // Import bcryptjs for password hashing
import mongoose from 'mongoose'; // Import mongoose for database interaction

// Assuming you have a User model defined with Mongoose
// For example:
// import User from './models/User'; // You'll need to create this file

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Replace with your actual MongoDB connection string
const mongoURI = 'mongodb://localhost:27017/your_database_name';

// Connect to MongoDB
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define a simple User Schema and Model for demonstration purposes
// In a real application, this would be in a separate file (e.g., models/User.ts)
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'USER' }
});

// Pre-save hook to hash password
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', UserSchema);


interface SignupPayload {
    name: string;
    email: string;
    password: string;
    role?: string;
}

// Signup Route
app.post('/signup', async (req: Request, res: Response) => {
    const { name, email, password, role = 'USER' }: SignupPayload = req.body;

    // Basic validation
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Name, email, and password are required." });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User with this email already exists." });
        }

        // Create new user
        const newUser = new User({ name, email, password, role });
        await newUser.save();

        res.status(201).json({ message: 'Signup successful', user: { id: newUser._id, email: newUser.email, role: newUser.role } });

    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Server error during signup." });
    }
});

// Signin Route
app.post("/signin", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        // Generate JWT token
        // IMPORTANT: Replace "your_jwt_secret" with a strong, environment variable in production
        const token = jwt.sign({ id: user._id, role: user.role }, "your_jwt_secret", {
            expiresIn: "1h" // Token expires in 1 hour
        });

        res.status(200).json({ message: "Signin successful", token });

    } catch (error) {
        console.error("Signin error:", error);
        res.status(500).json({ message: "Server error during signin." });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});