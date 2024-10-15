require('dotenv').config()

const express = require('express')
const app = express()

const cors = require('cors')
const corsOptions = {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200
}
app.use(cors(corsOptions))

const { initializeDatabase } = require('./db/db.connect')
const Recipe = require('./models/recipes.models')

app.use(express.json())

initializeDatabase()

async function createRecipe(newRecipe) {
  try {
    const recipe = new Recipe(newRecipe)
    const saveRecipe = await recipe.save()
    return saveRecipe
  } catch (error) {
    console.log("Error adding recipe:", error)
  }
}

app.post("/recipes", async (req, res) => {
  try {
    const savedRecipe = await createRecipe(req.body)
    if(savedRecipe) {
      res.status(201).json({message: "Recipe added successfully.", recipe: savedRecipe})
    } else {
      res.status(400).json({error: "Incorrect recipe data."})
    }
  } catch (error) {
    res.status(500).json({error: "Failed to add recipe."})
  }
})

async function readAllRecipes() {
  try {
    const allRecipes = await Recipe.find()
    return allRecipes
  } catch (error) {
    console.log("Error reading all recipes:", error)
  }
}

app.get("/recipes", async (req, res) => {
  try {
    const allRecipes = await readAllRecipes()
    if(allRecipes.length != 0) {
      res.json(allRecipes)
    } else {
      res.status(404).json({error: "No recipes found."})
    }
  } catch (error) {
    res.status(500).json({error: "Failed to fetch recipes."})
  }
})

async function readRecipeByTitle(recipeTitle) {
  try {
    const recipeByTitle = await Recipe.findOne({title: recipeTitle})
    return recipeByTitle
  } catch (error) {
    console.log("Error reading recipe by title:", error)
  }
}

app.get("/recipes/:recipeTitle", async (req, res) => {
  try {
    const recipe = await readRecipeByTitle(req.params.recipeTitle)
    if(recipe) {
      res.json(recipe)
    } else {
      res.status(404).json({error: "Recipe not found."})
    }
  } catch (error) {
    res.status(500).json({error: "Failed to fetch recipe."})
  }
})

async function readRecipesByAuthor(recipeAuthor) {
  try {
    const recipesByAuthor = await Recipe.find({author: recipeAuthor})
    return recipesByAuthor
  } catch (error) {
    console.log("Error reading recipes by author:", error)
  }
}

app.get("/recipes/author/:authorName", async (req, res) => {
  try {
    const recipes = await readRecipesByAuthor(req.params.authorName)
    if(recipes.length != 0) {
      res.json(recipes)
    } else {
      res.status(404).json({error: "No recipes found."})
    }
  } catch (error) {
    res.status(500).json({error: "Failed to fetch recipes."})
  }
})

async function readRecipesByDifficultyLevel(difficultyLevel) {
  try {
    const recipesByDifficultyLevel = await Recipe.find({difficulty: difficultyLevel})
    return recipesByDifficultyLevel
  } catch (error) {
    console.log("Error reading recipes by difficulty level:", error)
  }
}

app.get("/recipes/difficulty/:recipeDifficultyLevel", async (req, res) => {
  try {
    const recipes = await readRecipesByDifficultyLevel(req.params.recipeDifficultyLevel)
    if(recipes.length != 0) {
      res.json(recipes)
    } else {
      res.status(404).json({error: "No recipes found."})
    }
  } catch (error) {
    res.status(500).json({error: "Failed to fetch recipes."})
  }
})

async function updateRecipeById(recipeId, dataToUpdate) {
  try {
    const updateRecipe = await Recipe.findByIdAndUpdate(recipeId, dataToUpdate, {new: true})
    return updateRecipe
  } catch (error) {
    console.log("Error updating recipe by id:", error)
  }
}

app.post("/recipes/:recipeId", async (req, res) => {
  try {
    const updatedRecipe = await updateRecipeById(req.params.recipeId, req.body)
    if(updatedRecipe) {
      res.status(200).json({message: "Recipe updated successfully.", updatedRecipe: updatedRecipe})
    } else {
      res.status(404).json({error: "Recipe not found."})
    }
  } catch (error) {
    res.status(500).json({error: "Failed to update recipe."})
  }
})

async function updateRecipeByTitle(recipeTitle, dataToUpdate) {
  try {
    const updateRecipe = await Recipe.findOneAndUpdate({title: recipeTitle}, dataToUpdate, {new: true})
    return updateRecipe
  } catch (error) {
    console.log("Error updating recipe by title:", error)
  }
}

app.post("/recipes/title/:recipeTitle", async (req, res) => {
  try {
    const updatedRecipe = await updateRecipeByTitle(req.params.recipeTitle, req.body)
    if(updatedRecipe) {
      res.status(200).json({message: "Recipe updated successfully.", updatedRecipe: updatedRecipe})
    } else {
      res.status(404).json({error: "Recipe not found."})
    }
  } catch (error) {
    res.status(500).json({error: "Failed to update recipe."})
  }
})

async function deleteRecipeById(recipeId) {
  try {
    const deleteRecipe = await Recipe.findByIdAndDelete(recipeId)
    return deleteRecipe
  } catch (error) {
    console.log("Error deleting recipe by id:", error)
  }
}

app.delete("/recipes/:recipeId", async (req, res) => {
  try {
    const deletedRecipe = await deleteRecipeById(req.params.recipeId)
    if(deletedRecipe) {
      res.status(200).json({message: "Recipe deleted successfully."})
    } else {
      res.status(404).json({error: "Recipe not found."})
    }
  } catch (error) {
    res.status(500).json({error: "Failed to delete recipe."})
  }
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})