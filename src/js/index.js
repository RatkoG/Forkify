import string from './models/Search';

// * This way you can import multiple things from one module
// import {
//   add as a,
//   multiply as b,
//   ID
// } from './view/searchView';
// console.log(`Using imported functions! ${a(ID,2)} and ${b(3,5)}. ${string}`);

// * This way you can import everything
import * as searchView from './view/searchView';
console.log(`Using imported functions! ${searchView.add(searchView.ID,2)} and ${searchView.multiply(3,5)}. ${string}`);