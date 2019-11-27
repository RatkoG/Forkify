import axios from 'axios';
export default class Recipe {
  constructor(id) {
    this.id = id;
  }
  async getRecipe() {
    try {
      const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
      console.log(res);
    } catch (error) {
      alert('Something went WROOOOONG !!! 😢')
    }
  }
  calcTime() {
    //Assuming that we need 15 min for each 3 ingredients
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods
  }
  calcServings() {
    this.servings = 4;
  }
  parseIngredients() {
    const newIngredients = this.ingredients.map(el => {
      const unitsLong = ['tablespoons', 'tablespoon', 'ounce', 'ounces', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
      const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
      // 1) Uniform units
      let ingredient = el.toLowerCase();
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitsShort[i]);
      })
      // 2) Remove parentheses
      ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');
      // 3) Parse ingredients in count, unit and ingredient.
      const arrIng = ingredient.split(' ');
      const unitIndex = arrIng.findIndex(el2 => unitsShort.includes(el2));
      let objIng;
      if (unitIndex > -1) {
        // There is a unit
        //Exp. 4 1/2 cups, arrCount is [4, 1/2] --> eval('4+1/2') --> 4.5
        //Exp. 4 cups, arrCount is [4]
        const arrCount = arrIng.slice(0, unitIndex);
        let count;
        if (arrCount.length === 1) {
          count = eval(arrIng[0].replace('-', '+'));
        } else {
          count = eval(arrIng.slice(0, unitIndex).join('+'));
        }
        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(' ')
        }

      } else if (parseInt(arrIng[0], 10)) {
        // THERE IS NO UNIT BUT 1st el is number
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: '',
          ingredient: arrIng.slice(1).join(' ')
        }
      } else if (unitIndex === -1) {
        // There is NO  unit and No Number in 1 position
        objIng = {
          count: 1,
          unit: '',
          ingredient
        }
      }
      return objIng;

    })
    this.ingredients = newIngredients;
  }
}