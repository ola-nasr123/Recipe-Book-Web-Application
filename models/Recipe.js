const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe');

const mongoose = require('mongoose'); 

router.get('/my', function (req, res) {
  const userId = req.user && req.user._id;

  if (!userId) {
    return res.redirect('/users/login');
  }

  Recipe.find({ user: userId }, function (err, recipes) {
    if (err) {
      return res.send('An error occurred while fetching recipes.');
    }

    res.render('dashboard', { recipes: recipes });
  });
});
const RecipeSchema = new mongoose.Schema({
  title: {
    type: String,        
    required: true       
  },
  ingredients: {
    type: String,         
    required: true
  },
  instructions: {
    type: String,         
    required: true
  },
  image: {
    type: String          
  },
  createdAt: {
    type: Date,
    default: Date.now     
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,  
    ref: 'User',                           
    required: true
  }
},{ timestamps: true });
module.exports = mongoose.models.Recipe || mongoose.model('Recipe', RecipeSchema);
