const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');

router.get('/login', (req, res) => {
  res.render('users/login');
});


router.get('/register', (req, res) => {
  res.render('users/register', {
    errors: [],
    name: '',
    email: '',
    password: '',
    password2: ''
  });
});


router.post('/register', (req, res) => {
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
    return res.render('users/register', { errors, name, email, password, password2 });
  }

  User.findOne({ email: email })
    .then(existingUser => {
      if (existingUser) {
        errors.push({ msg: 'Email is already registered' });
        return res.render('users/register', { errors, name, email, password, password2 });
      }

      
      const newUser = new User({ name, email, password });

     
      bcrypt.genSalt(10)
        .then(salt => bcrypt.hash(newUser.password, salt))
        .then(hash => {
          newUser.password = hash;
          return newUser.save();
        })
        .then(() => {
          req.flash('success_msg', 'Registration successful! You can now log in');
          res.redirect('/users/login');
        })
        .catch(err => {
          console.error(err);
          res.redirect('/users/register');
        });
    })
    .catch(err => {
      console.error(err);
      res.redirect('/users/register');
    });
});


router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/recipes/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});


router.get('/logout', (req, res) => {
  req.logout(() => {
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  });
});

module.exports = router;