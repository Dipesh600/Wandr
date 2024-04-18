// server.js

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');


const BlogPost = require('./BlogPost');
const Guide = require('./Guide');
const User = require('./User');


const cors = require('cors');
const { body, validationResult } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://dipeshch040313:e83zwdhyQlKvocgG@cluster0.owgwqsd.mongodb.net/Blogs')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Middleware
app.use(cors());
app.use(express.json());


///Blogs
// API Endpoints
app.get('/api/blogposts', async (req, res) => {
  try {
    const blogPosts = await BlogPost.find();
    res.json(blogPosts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/blogposts', async (req, res) => {
  const blogPost = new BlogPost({
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    publicationDate: new Date(),
    imageUrl: req.body.imageUrl
  });

  try {
    const newBlogPost = await blogPost.save();
    res.status(201).json(newBlogPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Other CRUD endpoints (update, delete) can be added similarly
// Update Endpoint
app.put('/api/blogposts/:id', async (req, res) => {
    try {
      const updatedBlogPost = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedBlogPost) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      res.json(updatedBlogPost);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  // Delete Endpoint
  app.delete('/api/blogposts/:id', async (req, res) => {
    try {
      const deletedBlogPost = await BlogPost.findByIdAndDelete(req.params.id);
      if (!deletedBlogPost) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      res.json({ message: 'Blog post deleted successfully' });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  // Add a new POST endpoint to create a blog post
  
// Custom Error Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong' });
  });
  


// Validation Middleware
const validateBlogPost = [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('author').notEmpty().withMessage('Author is required'),
  body('imageURL').isURL().withMessage('Invalid image URL'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

/*
// Update Create Endpoint with Validation
app.post('/api/blogposts', validateBlogPost, async (req, res) => {
  try {
    const newBlogPost = new BlogPost(req.body);
    const savedBlogPost = await newBlogPost.save();
    res.json(savedBlogPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

*/


///Guide Booking.js file to use the above code for update functionality


// Validation Middleware
const validateGuideBooking = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email'),
  body('destination').notEmpty().withMessage('Destination is required'),
  body('date').notEmpty().withMessage('Date is required').isISO8601().toDate().withMessage('Invalid date'),
  body('duration').notEmpty().withMessage('Duration is required').isNumeric().withMessage('Duration should be a number'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];



/*
// API Endpoints
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await GuideBooking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
*/

// API Endpoint to fetch guide data
app.get('/api/guides', async (req, res) => {
  try {
    const guides = await Guide.find();
    res.json(guides);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



app.post('/api/bookings', validateGuideBooking, async (req, res) => {
  const guideBooking = new Guide({
    name: req.body.name,
    email: req.body.email,
    destination: req.body.destination,
    date: req.body.date,
    duration: req.body.duration
  });

  try {
    const newBooking = await guideBooking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Other CRUD endpoints can be added similarly


// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong' });
});


///User registration and login routes


// Middleware
app.use(express.json());
app.use(session({
  secret: 'secret', // Change this to a random string
  resave: false,
  saveUninitialized: false
}));



// Registration endpoint
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    // Store user id in session
    req.session.userId = user._id;
    res.json({ message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Logout endpoint
app.post('/api/logout', async (req, res) => {
  try {
    // Destroy session
    req.session.destroy();
    res.json({ message: 'Logout successful' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Protected endpoint (requires authentication)
app.get('/api/profile', async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    // Fetch user profile
    const user = await User.findById(req.session.userId);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});









// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
