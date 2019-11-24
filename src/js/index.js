import string from './models/Search';
// import {
//   add as a,
//   multiply as b,
//   ID
// } from './view/searchView';
// console.log(`Using imported functions! ${a(ID,2)} and ${b(3,5)}. ${string}`);

import * as searchView from './view/searchView';
console.log(`Using imported functions! ${searchView.add(searchView.ID,2)} and ${searchView.multiply(3,5)}. ${string}`);