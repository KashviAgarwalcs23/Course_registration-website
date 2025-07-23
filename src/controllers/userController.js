const User = require('../models/User'); // Your User model
const fs = require("fs");
const bcrypt = require('bcrypt');
const path = require("path");
const usersFilePath = path.join(__dirname, "../db/users.json");
const coursesFilePath = path.join(__dirname, "../db/courses.json"); // File storing course data

// Fetch all users
exports.getUsers = (req, res) => {
    res.send('List of Users');
};

// Create a new user (Registration)
exports.createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        fs.readFile(usersFilePath, 'utf8', async (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error reading users data' });
            }

            let users = JSON.parse(data);
            const existingUser = users.find(user => user.email === email);
            if (existingUser) {
                return res.status(400).json({ message: 'Email already registered' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = {
                id: users.length + 1,
                name,
                email,
                password: hashedPassword,
                courses: []  // Initialize empty courses array
            };

            users.push(newUser);
            fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Error saving new user' });
                }

                res.status(201).json({ message: 'User registered successfully', user: newUser });
            });
        });
    } catch (error) {
        console.error('Unexpected error', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Login (Validate user)
exports.loginUser = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    fs.readFile(usersFilePath, 'utf8', async (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error reading users data' });
        }

        const users = JSON.parse(data);
        const user = users.find(user => user.email === email);

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        req.session.user = user;
        res.status(200).json({ message: 'Login successful', user });
    });
};

// Fetch user profile and courses
exports.getUserProfile = (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const loggedInUser = req.session.user;

    fs.readFile(coursesFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error reading course data' });
        }

        const courses = JSON.parse(data);
        const userCourses = courses.filter(course => loggedInUser.courses.includes(course.id));

        res.status(200).json({
            message: 'User profile fetched successfully',
            user: loggedInUser,
            enrolledCourses: userCourses
        });
    });
};
