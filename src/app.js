const express = require("express");
const path = require("path");
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const bodyParser = require('body-parser');
const session = require("express-session");
const hbs = require("hbs");

require("./db/conn"); // MongoDB connection
const port = process.env.PORT || 4000;

// Import routes
const userRoutes = require('./routes/userRoutes');

// Static files directory
const static_path = path.join(__dirname, "../public");

// Template and partials directories
const template_path = path.join(__dirname, "../templates/views");
const partial_path = path.join(__dirname, "../templates/partials");
console.log("Partials path:", partial_path);

// Set up Handlebars view engine
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partial_path);

// Debug navbar route
app.get("/navbar-test", (req, res) => {
  res.render("navbar-test");  // Render the test view
});

// Middleware setup
app.use(express.static(static_path));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// Session setup
app.use(
  session({
    secret: "your-secret-key", 
    resave: false,
    saveUninitialized: true,
  })
);


app.get("/", (req, res) => {
  res.render("index", { layout: false });
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send("Error logging out");
    }
    res.redirect("/login");
  });
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/AboutUs", (req, res) => {
  res.render("AboutUs");
});

// Dashboard route
app.get('/dashboard', (req, res) => {
  const userName = req.session.user ? req.session.user.name : 'Guest'; 
  res.render('dashboard', { userName: userName });
});

// POST login route
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    // Simulate user validation
    req.session.user = { name: "User Name" }; // This should be replaced with actual user data
    res.redirect("/dashboard");
  } else {
    res.redirect("/login");
  }
});

app.post('/register', (req, res) => { 
  res.send('Registration successful!'); 
});

// Import API routes
app.use('/api/users', userRoutes);

// Handle MongoDB connection errors
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});


app.use(session({
  secret: 'yoursecretkey',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
