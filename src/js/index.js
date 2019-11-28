import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './view/searchView';
import * as recipeView from './view/recipeView';
import * as listView from './view/listView';
import * as likesView from './view/likesView';
import {
  elements,
  renderLoader,
  clearLoader
} from './view/base';

/**GLOBAL STATE OF THE APP
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Like
 * (all of this data will be stored in one central variable.Which we can access troughout our contoller)
 */


const state = {};
window.state = state;
//******* */ SEARCH CONTROLLER
const controlSearch = async () => {
  // * 1) Get query from view
  const query = searchView.getInput(); //TODO
  //! TESTING
  // const query = 'pizza' //TODO
  // console.log(query);
  if (query) {
    // * 2) New search object and add to state
    state.search = new Search(query);
    //* 3) Prepare UI for results
    // clear the input
    searchView.clearInput();
    // clear the Results
    searchView.clearResults();
    renderLoader(elements.searchRes);
    try {
      // * 4)Search for recipes
      await state.search.getResults(); //This here returns a promise

      //* 5) Render results on UI
      // console.log(state.search.result);
      clearLoader();
      searchView.renderResults(state.search.result);

    } catch (error) {
      clearLoader();
    };
  }
}

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
})

// //* TESTING
// window.addEventListener('load', e => {
//   e.preventDefault();
//   controlSearch();
// })

elements.searchResPages.addEventListener('click', e => {
  e.preventDefault();
  const btn = e.target.closest('.btn-inline');
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);

  }
})



//******* */ RECIPE CONTROLLER
// This was a test
// const r = new Recipe('6fab1c');
// r.getRecipe();
// console.log(r);
const controlRecipe = async () => {
  // Get ID from URL
  const id = window.location.hash.replace('#', '');
  console.log(id);
  if (id) {
    // Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);
    // Highlight selected search item
    if (state.search) {
      searchView.highlightSelected(id);
    }


    // Create new recipe object
    state.recipe = new Recipe(id);
    // // ! TESTING
    // window.r = state.recipe;
    try {
      // Get recipe data and parse ingredients
      await state.recipe.getRecipe();
      console.log(state.recipe.ingredients);

      state.recipe.parseIngredients();
      // Call servings and time calculate
      state.recipe.calcTime();
      state.recipe.calcServings();
      //render recipe
      // console.log(state.recipe);
      clearLoader();
      recipeView.renderRecipe(
        state.recipe,
        state.likes.isLiked(id)
      );

    } catch (error) {
      console.log(error);

      alert('Error processing recipe!');
    }
  }
}

// * Adding same event listener for different events
// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


//***** */ LIST CONTROLLER
const controlList = () => {
  // Create a new list If there is non yet
  if (!state.list) state.list = new List()
  // Add each ingredient to the list and UI
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  })
}

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid;

  // Hangle the delete item
  if (e.target.matches('.shopping__delete,.shopping__delete *')) {
    // Delete from state
    state.list.deleteItem(id);
    // Delete from UI
    listView.deleteItem(id);
  } else if (e.target.matches('.shopping__count-value')) {
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val)
  }
})

// ***LIKE CONTROLLER
const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id
  // User has NOT yet liked current recipe
  if (!state.likes.isLiked(currentID)) {
    // Add like to the state
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    // Toggle the like button
    likesView.toggleLikeBtn(true);
    // Add like to the UI list
    likesView.renderLike(newLike);
    // console.log(state.likes);


    // User HAS liked current recipe
  } else {
    // remove like to the state
    state.likes.deleteLike(currentID);
    // Toggle the like button
    likesView.toggleLikeBtn(false);
    // remove like to the UI list
    // console.log(state.likes);
    likesView.deleteLike(currentID);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
}

// restore liked recipes on page load
window.addEventListener('load', () => {
  state.likes = new Likes();
  // Restore likes
  state.likes.readStorage();
  // Toggle like menu button
  likesView.toggleLikeMenu(state.likes.getNumLikes());
  // Render the existing likes
  state.likes.likes.forEach(like => likesView.renderLike(like));
})


//  HANDLING recipe button clicks
elements.recipe.addEventListener('click', e => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    if (state.recipe.servings > 1) {
      console.log('YEEEEEY');
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    console.log('YUUUHUUUU');
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches('.recipe__btn--add,.recipe__btn--add *')) {
    // Add ingredients to shopping list
    controlList();
  } else if (e.target.matches('.recipe__love,.recipe__love *')) {
    // Like controller
    controlLike();

  }
  // console.log(state.recipe);
})

window.l = new List();