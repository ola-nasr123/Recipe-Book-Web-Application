const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const { ensureAuthenticated } = require('../config/auth');

router.get('/', (req, res) => {
  Recipe.find().sort({ createdAt: -1 })
    .then(recipes => res.render('index', { recipes }))
    .catch(err => {
      console.log(err);
      res.redirect('/');
    });
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {
  Recipe.find({ user: req.user.id }).sort({ createdAt: -1 })
    .then(recipes => res.render('dashboard', { recipes }))
    .catch(err => {
      console.log(err);
      res.redirect('/');
    });
});

router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('addRecipe');
});

router.post('/', ensureAuthenticated, (req, res) => {
  const { title, ingredients, instructions, image } = req.body;

  const newRecipe = new Recipe({
    title,
    ingredients,
    instructions,
    image,
    user: req.user.id
  });

  newRecipe.save()
    .then(() => {
      req.flash('success_msg', 'Recipe added successfully');
      res.redirect('/recipes/dashboard');
    })
    .catch(err => {
      console.log(err);
      res.redirect('/recipes/add');
    });
});

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Recipe.findById(req.params.id)
    .then(recipe => {
      if (!recipe || recipe.user.toString() !== req.user.id) {
        req.flash('error_msg', 'You are not allowed to modify this recipe');
        return res.redirect('/recipes/dashboard');
      }
      res.render('editRecipe', { recipe });
    })
    .catch(err => {
      console.log(err);
      res.redirect('/recipes/dashboard');
    });
});

router.put('/:id', ensureAuthenticated, (req, res) => {
  const { title, ingredients, instructions, image } = req.body;

  Recipe.findById(req.params.id)
    .then(recipe => {
      if (!recipe || recipe.user.toString() !== req.user.id) {
        req.flash('error_msg', 'You are not allowed to update this recipe');
        return res.redirect('/recipes/dashboard');
      }

      recipe.title = title;
      recipe.ingredients = ingredients;
      recipe.instructions = instructions;
      recipe.image = image;

      return recipe.save(); 
    })
    .then(() => {
      req.flash('success_msg', 'The recipe has been modified');
      res.redirect('/recipes/dashboard');
    })
    .catch(err => {
      console.log(err);
      res.redirect('/recipes/dashboard');
    });
});

router.delete('/:id', ensureAuthenticated, (req, res) => {
  Recipe.findById(req.params.id)
    .then(recipe => {
      if (!recipe || recipe.user.toString() !== req.user.id) {
        req.flash('error_msg', 'You are not allowed to delete this recipe');
        return res.redirect('/recipes/dashboard');
      }

      return Recipe.deleteOne({ _id: req.params.id });
    })
    .then(() => {
      req.flash('success_msg', 'Recipe deleted');
      res.redirect('/recipes/dashboard');
    })
    .catch(err => {
      console.log(err);
      res.redirect('/recipes/dashboard');
    });
});

router.get('/search', (req, res) => {
  const searchTerm = req.query.term; 
  const regex = new RegExp(searchTerm, 'i'); 

  Recipe.find({
    $or: [
      { title: regex },
      { ingredients: regex }
    ]
  })
    .then(recipes => {
      res.render('index', { recipes }); 
    })
    .catch(err => {
      console.log(err);
      res.redirect('/');
    });
});

module.exports = router;