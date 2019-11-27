import Search from './models/Search';
import Recipe from './models/Recipe'
import * as searchView from './view/searchView';
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

//******* */ SEARCH CONTROLLER
const controlSearch = async () => {
  // * 1) Get query from view
  const query = searchView.getInput(); //TODO
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

    // Create new recipe object
    state.recipe = new Recipe(id);
    try {
      // Get recipe data
      await state.recipe.getRecipe();
      // Call servings and time calculate
      state.recipe.calcTime();
      state.recipe.calcServings();
      //Rencer recipe
      console.log(state.recipe);

    } catch (error) {
      alert('Error processing recipe!');
    }
  }
}

// * Adding same event listener for different events
// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));