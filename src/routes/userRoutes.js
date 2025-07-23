const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const router = express.Router();
const userController = require('../controllers/userController'); 
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth'); // Import auth middleware

// Create the registration route
router.get("/", userController.getUsers);
router.post("/register", userController.createUser);
router.get('/profile', userController.getUserProfile);
// Login route to generate JWT token
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('Invalid email or password.');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid email or password.');
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, 'secretkey', { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).send('Error logging in.');
    }
});


// Mock data for courses (or fetch from a database)
const courses = {
    cpp: {  title: 'C++ Programming',
        description: 'Master the fundamentals and advanced topics in C++ programming.',
        backgroundImage: 'https://img.freepik.com/premium-photo/clear-blue-sky-sunset-with-horizon-calm-ocean-sea-background-picturesque_31965-138504.jpg?semt=ais_hybrid',
        additionalInfo: `Why Learn C++?
C++ is like the Swiss Army knife of programming languages—it's versatile, powerful, and essential for tackling some of the most exciting challenges in tech! 🚀

What Makes C++ Special?
Gaming Extraordinaire 🎮
Ever dreamed of creating your own video game? Most high-performance games are built using C++. With its super speed and low-level memory management, it's the go-to choice for game developers!

Building the Unbreakable 🛡️
From operating systems to browsers like Chrome and even advanced simulations, C++ is behind the scenes making everything fast and reliable.

The Gateway to Robots 🤖
Want to teach a robot to dance? 🕺 Or maybe build AI that learns like a pro? C++ is the foundation for many AI and robotics applications.

Banking on C++ 🏦
Big banks use C++ for lightning-fast trading systems. (Think of it as a superhero in a suit, protecting your transactions!)

Superpowers for Your Resume 💼
C++ gives you bragging rights. It’s the language every hiring manager loves because mastering it shows you can handle complexity like a boss.

How C++ Will Change Your Life
🧩 Crack Any Code: Understanding C++ opens doors to learning other languages like Python, Java, or C# more easily. It's the OG of programming.
🔬 See Behind the Curtain: C++ teaches you how computers really work—memory, hardware, and more.
⚡ Be Unstoppable: Once you master C++, no project will feel too big, whether it’s designing cutting-edge software or building a robot army (just saying 🤖).
So, Why Wait?
Take the first step with our C++ course, and soon, you’ll be bending code to your will like a programming wizard! 🧙✨

And who knows? Maybe one day, you'll build the next blockbuster game, the fastest AI, or a world-changing application. The possibilities are endless—and it all starts with C++! 🌟

`,},
    java: { title: "Java Programming",
         description: "Learn Java from scratch with hands-on examples and real-world applications." ,
         backgroundImage: 'https://img.freepik.com/premium-photo/clear-blue-sky-sunset-with-horizon-calm-ocean-sea-background-picturesque_31965-138504.jpg?semt=ais_hybrid',
        additionalInfo: `Why Learn Java? ☕
Java is the superhero of programming languages—reliable, secure, and used everywhere, from smartphones to space missions! 🌌

What Makes Java Special?
Build Apps Like a Pro 📱
Dreaming of building Android apps? Java is the backbone of Android development. Your ideas could be the next big app on Play Store!

The World Runs on Java 🌐
Java powers over 3 billion devices worldwide. From ATMs to your Netflix streaming sessions, Java is there behind the scenes.

Stay Future-Ready 🔮
From web applications to enterprise systems, Java is the go-to for large-scale, secure solutions that keep the modern world running.

Banking on Java 🏦
Major banks, healthcare systems, and governments trust Java for its speed, scalability, and security.

Superpowers for Your Resume 💼
Java proficiency is like a golden ticket to landing high-paying jobs in top companies. Plus, learning it makes transitioning to other languages like Kotlin or Scala a breeze.

How Java Will Change Your Life
🎮 Build Games: Ever wanted to create fun games? Java can do that too!
💻 Design Web Applications: Craft websites and services that millions can use.
🕵️ Crack Interviews: Java expertise makes you stand out in job interviews with its vast use cases.

So, Why Wait? 🚀
Start learning Java today, and join the ranks of developers shaping the future. Who knows? You might just create the next revolutionary tech! 🌟`,},
    "html-css": { title: "HTML & CSS for Beginners",
        description: "Build beautiful websites using HTML and CSS.",
        backgroundImage: 'https://img.freepik.com/premium-photo/clear-blue-sky-sunset-with-horizon-calm-ocean-sea-background-picturesque_31965-138504.jpg?semt=ais_hybrid',
        additionalInfo: `Why Learn HTML & CSS? 🌐
HTML and CSS are like the magic wands of the web—simple to learn yet powerful enough to create stunning websites! 🪄✨

What Makes HTML & CSS Special?
Create Stunning Websites 🎨
Want to design a portfolio that stands out? Or build a blog that looks fabulous? HTML & CSS give you the tools to make your ideas a reality.

Be the Architect of the Web 🏛️
Think of HTML as the skeleton and CSS as the fashion designer of your websites. Together, they turn code into beauty.

Control Your Online Presence 🌟
From personal websites to professional portfolios, mastering HTML & CSS lets you own your digital space.

How HTML & CSS Will Change Your Life
🖌️ Unleash Your Creativity: Design websites, landing pages, or even custom themes for others.
📈 Start Your Career: Many web designers begin their journey with just HTML & CSS.
🌎 Shape the Internet: Join the millions of developers crafting the web's future!

So, Why Wait? 🚀
Take your first step in web development and turn your dreams into stunning realities. 🌟`, },
    python: { title: "Python Programming", 
        description: "Get started with Python and build amazing projects.",
        backgroundImage: 'https://img.freepik.com/premium-photo/clear-blue-sky-sunset-with-horizon-calm-ocean-sea-background-picturesque_31965-138504.jpg?semt=ais_hybrid',
        additionalInfo: `Why Learn Python? 🐍
Python is the friendly giant of programming—easy to learn, versatile, and in-demand everywhere! 🌍

What Makes Python Special?
AI and Machine Learning Magic 🤖
Python is the brains behind your favorite AI apps like Siri and Alexa. Dive into machine learning, and you might just create the next big thing!

Web Wizardry 🧙
Frameworks like Django and Flask let you build websites that are fast, scalable, and beautiful.

Data Science Dynamo 📊
From analyzing trends to predicting stock prices, Python is the ultimate tool for data geeks.

Scripting Like a Pro 📜
Automate boring tasks like renaming files or scraping data from the web. Python makes it fun and easy!

How Python Will Change Your Life
🐾 Beginner-Friendly: Start your coding journey with Python’s simple syntax.
🚀 Fast-Track Your Career: Python skills are in high demand across industries.
🌎 Change the World: Build apps, analyze data, or contribute to exciting open-source projects.

So, Why Wait? 🌟
Join the Python revolution and become a part of one of the fastest-growing developer communities in the world!`, },
    javascript: { title: "JavaScript Essentials", 
        description: "Learn JavaScript with easy-to-follow examples.",
        backgroundImage: 'https://img.freepik.com/premium-photo/clear-blue-sky-sunset-with-horizon-calm-ocean-sea-background-picturesque_31965-138504.jpg?semt=ais_hybrid',
        additionalInfo: `Why Learn JavaScript? 🌟
JavaScript is the life of the party on the web—it makes websites interactive, fun, and alive! 🎉

What Makes JavaScript Special?
Interactive Magic 🪄
Add animations, create interactive forms, or even build games that run in your browser. JavaScript makes the web exciting!

Rule the Web 🌐
Every major website—from Google to Facebook—uses JavaScript. It's the key to becoming a full-stack web developer.

Beyond the Browser 🚀
With Node.js, JavaScript powers servers, bots, and even IoT devices. Build apps that work anywhere!

Build What You Imagine 💡
Whether it’s a dynamic portfolio or a multiplayer game, JavaScript lets you bring your wildest ideas to life.

How JavaScript Will Change Your Life
📱 Build Your Own Apps: Create mobile and web apps that people love to use.
🛠️ Be In-Demand: JavaScript is one of the top skills every company is hiring for.
🎨 Add Your Touch: Design websites that are fast, dynamic, and uniquely yours.

So, Why Wait? 🚀
Learn JavaScript today and start building the future of the web. 🌟`, },
};

// Generate JWT token


// Route for "Learn More"
router.get('/course/:courseId', (req, res) => {
    const courseId = req.params.courseId;
    const course = courses[courseId];

    if (course) {
        res.render('courseDetail', { course }); // Render a detailed view of the course
    } else {
        res.status(404).send("Course not found");
    }
});


// Route for "Learn More"
router.get('/course/:courseId', (req, res) => {
    console.log("Learn More clicked! Course ID:", req.params.courseId);  // Debugging log
    const courseId = req.params.courseId;
    const course = courses[courseId];

    if (course) {
        res.send(`Learn More about ${course.title}`);
    } else {
        res.status(404).send("Course not found");
    }
});

// Route for "Enroll Now"
router.get('/course/:courseId/enroll', (req, res) => {
    const courseId = req.params.courseId;
    const course = courses[courseId];

    if (course) {
        res.json({
            success: true,
            title: course.title,
            message: `You have successfully enrolled in ${course.title}!`,
            courseLink: `/api/users/course/${courseId}`
        });
    } else {
        res.status(404).json({ success: false, message: "Course not found" });
    }
});

module.exports = router;
