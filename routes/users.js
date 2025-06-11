const express = require('express'); 
const router = express.Router(); 
const bcrypt = require('bcryptjs'); 
const passport = require('passport'); 
const User = require('../models/User'); 


router.get('/login', (req, res) => res.render('login')); 


router.get('/register', (req, res) => res.render('register')); 



router.post('/register', async (req, res) => {
  const { name, email, password, password2 } = req.body; 
  const errors = []; 

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please fill out all fields' }); 
  }

  if (password !== password2) {
    errors.push({ msg: 'The passwords do not match' }); 
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters long' }); 
  }

  if (errors.length > 0) {
    
    return res.render('register', { errors, name, email, password, password2 });
  }

  try {
    const existingUser = await User.findOne({ email }); 
    if (existingUser) {
      errors.push({ msg: 'Email is already registered' }); 
      return res.render('register', { errors, name, email, password, password2 }); 
    }

    const newUser = new User({ name, email, password }); 

    const salt = await bcrypt.genSalt(10); 
    newUser.password = await bcrypt.hash(password, salt); 
    await newUser.save(); 

    req.flash('success_msg', 'Registration successful! You can now log in'); 
    res.redirect('/login'); 
  } catch (err) {
    console.log(err); 
    res.redirect('/register'); 
  }
});


router.post('/login', (req, res, next) => {

  passport.authenticate('local', {
    successRedirect: '/recipes/dashboard', 
    failureRedirect: '/login', 
    failureFlash: true, 
  })(req, res, next); 
});


router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) return next(err); 
    req.flash('success_msg', 'You are logged out'); 
    res.redirect('/login'); 
  });
});

module.exports= router;