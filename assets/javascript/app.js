const userInput = document.getElementById('user-input');
const output = document.getElementById('recipes');
const submitForm = document.getElementById('submit');

// spoonacular
submitForm.addEventListener('submit', function(event){

    event.preventDefault();
    output.textContent = '';

    const search = userInput.value;
    const searchPlus = search.replaceAll(' ','+')

    if (searchPlus === ''){
        return
    };

    userInput.value = '';

    ingredientSearch(searchPlus);
})


function ingredientSearch(searchPlus){
    fetch(`https://api.spoonacular.com/recipes/findByIngredients?apiKey=196192673e7b41b2b8a7e8f82c389470&ingredients=${searchPlus}&number=4&instructionsRequired=true&addRecipeInformation=true`)
    .then(function(response){
        return response.json();
    })
    .then(function(foodData){
        return recipeInformation(foodData);
    })
}

function recipeInformation(foodData){
    for (let i = 0; i < 4; i++) {
        fetch(`https://api.spoonacular.com/recipes/${foodData[i].id}/information?apiKey=196192673e7b41b2b8a7e8f82c389470&includeNutrition=false`)
        .then(function(response){
            return response.json();
        })
        .then(function(foodData){
            return generateRecipes(foodData);
        })
    }
}

function generateRecipes(foodData){

    const h1 = document.createElement('h1');
    const img = document.createElement('img');
    
    h1.textContent = foodData.title;
    img.setAttribute('src',foodData.image);
    img.setAttribute('style','width: 200px;');
    output.appendChild(h1);
    output.appendChild(img);
    
    const p = document.createElement('p');
    p.textContent = foodData.instructions;
    output.appendChild(p);

    for (let i = 0; i < 20; i++) {
        const ingredient = foodData.extendedIngredients[i].name
        const measurement = foodData.extendedIngredients[i].measures.metric.amount+' '+foodData.extendedIngredients[i].measures.metric.unitShort

        if (ingredient === ''){
            return
        }
        
        const li = document.createElement('li');
        li.textContent = measurement + ' ' + ingredient;
        output.appendChild(li)

    }

}

    

    