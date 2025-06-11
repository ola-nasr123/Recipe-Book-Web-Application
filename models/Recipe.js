const mongoose = require('mongoose'); 
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
});
module.exports = mongoose.model('Recipe', RecipeSchema);
