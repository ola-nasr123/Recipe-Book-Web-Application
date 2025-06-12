const express = require ('express');
const app =express();
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const Recipe = require('./models/recipe');
const path = require('path');
const bodyParser=require('body-parser');
const methodOverride = require('method-override');




app.use(methodOverride('_method'));

require('./config/passport')(passport);

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/recipesDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Middleware setup

app.set('view engine', 'ejs');
app.set('views','views');
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));



app.use(session({
  secret: '123',
  resave: true,
  saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;  
  next();
});

// Routes
app.use('/users', require('./routes/users'));
app.use('/recipes', require('./routes/recipes'));

// Homepage route
app.get('/', (req, res) => {
  res.redirect('/users/login');
});

// Start server
const PORT = 5020;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));