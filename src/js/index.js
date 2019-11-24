import Search from './models/Search';
/**GLOBAL STATE OF THE APP
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Like
 * (all of this data will be stored in one central variable.Which we can access troughout our contoller)
 */


const state = {};
const controlSearch = async () => {
  // * 1) Get query from view
  const query = 'pizza'; //TODO

  if (query) {
    // * 2) New search object and add to state
    state.search = new Search(query);
    //* 3) Prepare UI for results

    // * 4)Search for recipes
    await state.search.getResults(); //This here returns a promise

    //* 5) Render results on UI
    console.log(state.search.result);
  }


}

document.querySelector('.search').addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
})